import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudioSession, isAuthConfigured, isBillingConfigured } from "@/lib/access";
import BillingButton from "@/components/BillingButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

const statusLabels: Record<string, string> = {
  active: "Active",
  trialing: "Trial",
  past_due: "Payment failed",
  canceled: "Cancelled",
  incomplete: "Incomplete",
  unpaid: "Unpaid",
};

function formatDate(unixSeconds?: number): string | null {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AccountPage() {
  if (!isAuthConfigured()) redirect("/");

  const session = await getStudioSession();
  if (session.access === "signed-out") redirect("/logg-inn");

  const subscription = session.subscription;
  const renews = formatDate(subscription?.currentPeriodEnd);
  const showBilling = isBillingConfigured() && !session.isOwner;

  return (
    <div className="container-content py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">Your account</h1>
        {session.email && <p className="mt-2 text-ink/70">{session.email}</p>}
      </div>

      <div className="mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
        <section className="rounded-xl2 border border-sand bg-white p-6">
          <h2 className="font-serif text-xl font-semibold text-ink">Subscription</h2>

          {session.isOwner ? (
            <p className="mt-3 text-sm text-ink/80">
              Owner account — full studio access without a subscription.
            </p>
          ) : subscription?.status ? (
            <>
              <p className="mt-3 text-sm font-semibold text-ink">
                {statusLabels[subscription.status] ?? subscription.status}
              </p>
              {renews && (
                <p className="mt-1 text-sm text-ink/70">
                  {subscription.cancelAtPeriodEnd ? "Access ends" : "Renews"} {renews}
                </p>
              )}
              {subscription.status === "past_due" && (
                <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                  The last payment failed. Update your card to keep studio access.
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-ink/70">No active subscription.</p>
          )}

          {showBilling && (
            <div className="mt-6 space-y-3">
              {session.access === "active" ? (
                <BillingButton
                  endpoint="/api/stripe/portal"
                  label="Manage payment"
                  pendingLabel="Opening Stripe …"
                  className="rounded-full border border-sand px-5 py-2.5 text-sm font-semibold text-ink/80 transition-colors hover:border-sage hover:text-sage-dark disabled:opacity-50"
                />
              ) : (
                <>
                  <BillingButton
                    endpoint="/api/stripe/checkout"
                    label="Start subscription"
                    pendingLabel="Opening Stripe …"
                  />
                  {subscription?.stripeCustomerId && (
                    <BillingButton
                      endpoint="/api/stripe/portal"
                      label="Invoices and payment details"
                      pendingLabel="Opening Stripe …"
                      className="rounded-full border border-sand px-5 py-2.5 text-sm font-semibold text-ink/80 transition-colors hover:border-sage hover:text-sage-dark disabled:opacity-50"
                    />
                  )}
                </>
              )}
            </div>
          )}
        </section>

        <section className="rounded-xl2 border border-sand bg-white p-6">
          <h2 className="font-serif text-xl font-semibold text-ink">Usage this month</h2>
          <p className="mt-3 text-sm text-ink/80">
            {session.quota === null
              ? `${session.used} analyses — no limit`
              : `${session.used} of ${session.quota} analyses used`}
          </p>
          {session.quota !== null && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand/60">
              <div
                className="h-full rounded-full bg-sage"
                style={{ width: `${Math.min(100, (session.used / session.quota) * 100)}%` }}
              />
            </div>
          )}
          <p className="mt-3 text-xs text-ink/50">The quota resets on the 1st of each month.</p>
          <Link
            href="/studio"
            className="mt-6 inline-block text-sm font-semibold text-sage-dark underline"
          >
            Go to the studio
          </Link>
        </section>
      </div>
    </div>
  );
}
