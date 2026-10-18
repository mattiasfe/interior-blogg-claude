import type { Metadata } from "next";
import Link from "next/link";
import {
  getStudioSession,
  isAuthConfigured,
  isBillingConfigured,
  monthlyQuota,
} from "@/lib/access";
import BillingButton from "@/components/BillingButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Subscription for the Room Studio — AI room analysis, furniture suggestions and Pinterest copy.",
};

const priceLabel = process.env.NEXT_PUBLIC_STUDIO_PRICE_LABEL || "kr 149 / month";

const included = [
  "AI analysis of your own room photos",
  "3-6 concrete furniture and decor suggestions",
  "Ready-to-use Pinterest title, description and alt text",
  "A blog-ready draft you can edit",
  "Cancel any time from your account",
];

export default async function PricingPage() {
  const session = await getStudioSession();

  return (
    <div className="container-content py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">Pricing</h1>
        <p className="mt-3 text-ink/70">
          The blog is free and stays free. The Room Studio runs an AI model on your photo, which
          costs money per analysis, so it sits behind a subscription.
        </p>
      </div>

      <div className="mt-10 max-w-md rounded-xl2 border border-sand bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark">Room Studio</p>
        <p className="mt-2 font-serif text-3xl font-semibold text-ink">{priceLabel}</p>
        <p className="mt-1 text-sm text-ink/60">
          Up to {monthlyQuota()} analyses per month. VAT is added at checkout where applicable.
        </p>

        <ul className="mt-6 space-y-2 text-sm text-ink/80">
          {included.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="text-sage-dark">
                •
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          {!isAuthConfigured() || !isBillingConfigured() ? (
            <p className="rounded-xl bg-sand/50 px-4 py-3 text-sm text-ink/70">
              Subscriptions are not open yet. Check back shortly.
            </p>
          ) : session.access === "signed-out" ? (
            <Link
              href="/registrer"
              className="inline-block rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
            >
              Create an account
            </Link>
          ) : session.access === "active" ? (
            <Link
              href="/studio"
              className="inline-block rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
            >
              Open the studio
            </Link>
          ) : (
            <BillingButton
              endpoint="/api/stripe/checkout"
              label="Start subscription"
              pendingLabel="Opening Stripe …"
            />
          )}
        </div>
      </div>

      <p className="mt-6 max-w-md text-xs text-ink/50">
        Payments are handled by Stripe. Card details are never stored on this site. See our{" "}
        <Link href="/personvern" className="underline hover:text-ink">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
