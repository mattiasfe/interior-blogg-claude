import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

/**
 * Studio access control.
 *
 * The studio page itself is public — anyone may look at it. Running an
 * analysis costs Anthropic tokens, so that requires a signed-in user with an
 * active subscription (or the owner), plus a monthly quota.
 *
 * Subscription state and usage live in the Clerk user's privateMetadata, so
 * the MVP needs no database of its own. Stripe webhooks are the only writer of
 * the subscription fields.
 */

export type StudioAccess = "signed-out" | "needs-plan" | "active";

export type StudioSubscription = {
  stripeCustomerId?: string;
  subscriptionId?: string;
  status?: string;
  /** Unix seconds */
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
};

export type StudioUsage = {
  /** YYYY-MM */
  month: string;
  count: number;
};

type StudioMetadata = {
  subscription?: StudioSubscription;
  usage?: StudioUsage;
};

export type StudioSession = {
  access: StudioAccess;
  userId: string | null;
  email: string | null;
  isOwner: boolean;
  used: number;
  /** null means unlimited (owner) */
  quota: number | null;
  subscription: StudioSubscription | null;
};

/** Clerk is only wired up once the keys exist, so the blog still builds without them. */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );
}

export function isBillingConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
}

/**
 * Without Clerk keys the studio falls back to its old behaviour: usable in
 * `npm run dev`, invisible in production.
 */
export function isLocalOwnerFallback(): boolean {
  return !isAuthConfigured() && process.env.NODE_ENV === "development";
}

export function monthlyQuota(): number {
  const parsed = Number(process.env.STUDIO_MONTHLY_QUOTA);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 30;
}

function ownerEmails(): string[] {
  return (process.env.STUDIO_OWNER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function readMetadata(raw: unknown): StudioMetadata {
  const studio = (raw as { studio?: StudioMetadata } | null)?.studio;
  return studio ?? {};
}

function hasActivePlan(sub: StudioSubscription | undefined): boolean {
  return sub?.status === "active" || sub?.status === "trialing";
}

/** Reads the signed-in user's studio access. Safe to call from pages and routes. */
export async function getStudioSession(): Promise<StudioSession> {
  if (isLocalOwnerFallback()) {
    return {
      access: "active",
      userId: "local-dev",
      email: null,
      isOwner: true,
      used: 0,
      quota: null,
      subscription: null,
    };
  }

  if (!isAuthConfigured()) {
    return {
      access: "signed-out",
      userId: null,
      email: null,
      isOwner: false,
      used: 0,
      quota: monthlyQuota(),
      subscription: null,
    };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      access: "signed-out",
      userId: null,
      email: null,
      isOwner: false,
      used: 0,
      quota: monthlyQuota(),
      subscription: null,
    };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const metadata = readMetadata(user?.privateMetadata);
  const isOwner = Boolean(email && ownerEmails().includes(email.toLowerCase()));
  const used = metadata.usage?.month === currentMonth() ? metadata.usage.count : 0;

  return {
    access: isOwner || hasActivePlan(metadata.subscription) ? "active" : "needs-plan",
    userId,
    email,
    isOwner,
    used,
    quota: isOwner ? null : monthlyQuota(),
    subscription: metadata.subscription ?? null,
  };
}

export type CreditResult =
  | { ok: true; used: number; quota: number | null }
  | { ok: false; reason: "signed-out" | "needs-plan" | "quota"; used: number; quota: number | null };

/**
 * Checks access and books one analysis against this month's quota. Called
 * before the Anthropic request so a failing analysis still costs the user a
 * credit rather than letting the key be drained by retries.
 */
export async function consumeStudioCredit(): Promise<CreditResult> {
  const session = await getStudioSession();

  if (session.access === "signed-out") {
    return { ok: false, reason: "signed-out", used: 0, quota: session.quota };
  }
  if (session.access === "needs-plan") {
    return { ok: false, reason: "needs-plan", used: session.used, quota: session.quota };
  }
  if (session.quota === null || !session.userId || session.userId === "local-dev") {
    return { ok: true, used: session.used, quota: null };
  }
  if (session.used >= session.quota) {
    return { ok: false, reason: "quota", used: session.used, quota: session.quota };
  }

  const used = session.used + 1;
  await setStudioMetadata(session.userId, { usage: { month: currentMonth(), count: used } });
  return { ok: true, used, quota: session.quota };
}

/** Merges fields into the user's studio metadata without dropping the rest. */
export async function setStudioMetadata(
  userId: string,
  patch: Partial<StudioMetadata>
): Promise<void> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existing = readMetadata(user.privateMetadata);
  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...(user.privateMetadata ?? {}),
      studio: { ...existing, ...patch },
    },
  });
}

/**
 * Merges into the subscription object specifically, so a partial update (a
 * failed payment, say) keeps the subscription id and period end.
 */
export async function mergeStudioSubscription(
  userId: string,
  patch: StudioSubscription
): Promise<void> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existing = readMetadata(user.privateMetadata);
  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...(user.privateMetadata ?? {}),
      studio: {
        ...existing,
        subscription: { ...(existing.subscription ?? {}), ...patch },
      },
    },
  });
}

/**
 * Finds the Clerk user a Stripe customer belongs to. Only a fallback: webhook
 * events normally carry the Clerk id in the subscription metadata.
 */
export async function findUserByStripeCustomer(customerId: string): Promise<string | null> {
  const client = await clerkClient();
  const pageSize = 100;

  for (let offset = 0; offset < pageSize * 20; offset += pageSize) {
    const { data } = await client.users.getUserList({ limit: pageSize, offset });
    const match = data.find(
      (u) => readMetadata(u.privateMetadata).subscription?.stripeCustomerId === customerId
    );
    if (match) return match.id;
    if (data.length < pageSize) break;
  }

  return null;
}
