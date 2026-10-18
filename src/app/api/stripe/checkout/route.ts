import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getStudioSession,
  isBillingConfigured,
  mergeStudioSubscription,
} from "@/lib/access";
import { automaticTaxEnabled, getStripe, priceId, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Starts a Stripe Checkout session for the studio subscription. */
export async function POST(request: Request) {
  if (!isBillingConfigured()) {
    return NextResponse.json({ error: "Betaling er ikke satt opp ennå." }, { status: 503 });
  }

  const session = await getStudioSession();
  if (!session.userId || session.userId === "local-dev") {
    return NextResponse.json({ error: "Sign in first.", code: "signed-out" }, { status: 401 });
  }
  if (session.access === "active" && session.subscription?.status) {
    return NextResponse.json(
      { error: "You already have an active subscription.", code: "already-active" },
      { status: 409 }
    );
  }

  try {
    const stripe = getStripe();
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    // Reuse the customer across attempts so a user never ends up with two.
    let customerId = session.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { clerkUserId: session.userId },
      });
      customerId = customer.id;
      await mergeStudioSubscription(session.userId, { stripeCustomerId: customerId });
    }

    const origin = siteUrl(request);
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: session.userId,
      line_items: [{ price: priceId(), quantity: 1 }],
      allow_promotion_codes: true,
      // The webhook needs to find the Clerk user from the subscription alone.
      subscription_data: { metadata: { clerkUserId: session.userId } },
      ...(automaticTaxEnabled()
        ? { automatic_tax: { enabled: true }, customer_update: { address: "auto" as const } }
        : {}),
      success_url: `${origin}/konto?checkout=success`,
      cancel_url: `${origin}/priser?checkout=cancelled`,
    });

    if (!checkout.url) throw new Error("Stripe returnerte ingen checkout-URL.");
    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("[stripe/checkout]", error);
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
