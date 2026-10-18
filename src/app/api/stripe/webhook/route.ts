import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { findUserByStripeCustomer, mergeStudioSubscription } from "@/lib/access";
import { getStripe, periodEnd } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook — the only writer of subscription state.
 *
 * Never trust the browser returning from Checkout: a user can open the success
 * URL directly. What Stripe tells us here is what decides access.
 *
 * Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET mangler." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Mangler stripe-signature." }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    // The raw body is required for signature verification.
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch (error) {
    console.error("[stripe/webhook] signatur", error);
    return NextResponse.json({ error: "Ugyldig signatur." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkout = event.data.object;
        const userId = checkout.client_reference_id;
        if (userId && typeof checkout.subscription === "string") {
          const subscription = await stripe.subscriptions.retrieve(checkout.subscription);
          await saveSubscription(userId, subscription);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = await resolveUserId(subscription);
        if (userId) await saveSubscription(userId, subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
        const userId = customerId ? await findUserByStripeCustomer(customerId) : null;
        // Stripe also sends subscription.updated with status past_due, but a
        // failed payment is worth recording even if that event is delayed.
        if (userId) {
          await mergeStudioSubscription(userId, {
            stripeCustomerId: customerId ?? undefined,
            status: "past_due",
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    // A 500 makes Stripe retry, which is what we want for a transient failure.
    console.error("[stripe/webhook]", event.type, error);
    return NextResponse.json({ error: "Kunne ikke behandle hendelsen." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/** Subscriptions carry the Clerk id in metadata; fall back to a customer lookup. */
async function resolveUserId(subscription: Stripe.Subscription): Promise<string | null> {
  const fromMetadata = subscription.metadata?.clerkUserId;
  if (fromMetadata) return fromMetadata;
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  return customerId ? findUserByStripeCustomer(customerId) : null;
}

async function saveSubscription(userId: string, subscription: Stripe.Subscription): Promise<void> {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;

  await mergeStudioSubscription(userId, {
    stripeCustomerId: customerId,
    subscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodEnd: periodEnd(subscription),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}
