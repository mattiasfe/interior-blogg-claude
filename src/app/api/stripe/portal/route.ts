import { NextResponse } from "next/server";
import { getStudioSession, isBillingConfigured } from "@/lib/access";
import { getStripe, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Opens the Stripe Customer Portal, where the user changes card, sees invoices
 * and cancels. Stripe hosts it, so no payment UI lives in this app.
 */
export async function POST(request: Request) {
  if (!isBillingConfigured()) {
    return NextResponse.json({ error: "Betaling er ikke satt opp ennå." }, { status: 503 });
  }

  const session = await getStudioSession();
  if (!session.userId || session.userId === "local-dev") {
    return NextResponse.json({ error: "Sign in first.", code: "signed-out" }, { status: 401 });
  }

  const customerId = session.subscription?.stripeCustomerId;
  if (!customerId) {
    return NextResponse.json(
      { error: "No payment details on file yet.", code: "no-customer" },
      { status: 400 }
    );
  }

  try {
    const portal = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl(request)}/konto`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("[stripe/portal]", error);
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
