import Stripe from "stripe";

/** Stripe client. Created per call so a missing key fails loudly in one place. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY mangler i miljøvariablene.");
  return new Stripe(key);
}

export function priceId(): string {
  const price = process.env.STRIPE_PRICE_ID;
  if (!price) throw new Error("STRIPE_PRICE_ID mangler i miljøvariablene.");
  return price;
}

/** Stripe Tax has to be switched on in the dashboard before this is useful. */
export function automaticTaxEnabled(): boolean {
  return process.env.STRIPE_AUTOMATIC_TAX === "1";
}

export function siteUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  return new URL(request.url).origin;
}

/**
 * `current_period_end` sits on the subscription in older API versions and on
 * the subscription item in newer ones, so read whichever is present.
 */
export function periodEnd(subscription: Stripe.Subscription): number | undefined {
  const flat = (subscription as unknown as { current_period_end?: number }).current_period_end;
  if (typeof flat === "number") return flat;
  const item = subscription.items?.data?.[0] as unknown as { current_period_end?: number } | undefined;
  return item?.current_period_end;
}
