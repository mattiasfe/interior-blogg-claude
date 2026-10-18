import Link from "next/link";
import BillingButton from "@/components/BillingButton";

const steps = [
  {
    title: "Upload a photo of your room",
    body: "A phone snapshot is enough. Drag it in, or paste a screenshot straight from the clipboard.",
  },
  {
    title: "Get an honest analysis",
    body: "What works in the room, what holds it back, the palette it already has, and the style it leans towards.",
  },
  {
    title: "See concrete suggestions",
    body: "Three to six furniture and decor changes, each with where it goes and why it helps this particular room.",
  },
  {
    title: "Take the text with you",
    body: "A Pinterest title, description and alt text, plus an editable draft you can publish wherever you like.",
  },
];

/**
 * What visitors see on /studio before they can use it. The page stays public
 * on purpose — the tool has to be visible to be worth paying for.
 */
export default function StudioLocked({
  access,
  billingEnabled,
  quota,
  priceLabel,
}: {
  access: "signed-out" | "needs-plan";
  billingEnabled: boolean;
  quota: number;
  priceLabel: string;
}) {
  return (
    <div className="mt-8 space-y-10">
      <div className="rounded-xl2 border border-sand bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark">
              {access === "signed-out" ? "Sign in to use the studio" : "Subscription required"}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
              {access === "signed-out"
                ? "Create a free account to get started"
                : "Your account is ready — pick a plan"}
            </h2>
            <p className="mt-3 text-sm text-ink/70">
              Each analysis runs an AI model on your photo, which costs money per run. That is why
              the studio needs an account and a subscription, while the blog stays free.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {access === "signed-out" ? (
              <>
                <Link
                  href="/registrer"
                  className="rounded-full bg-sage px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
                >
                  Create account
                </Link>
                <Link
                  href="/logg-inn"
                  className="rounded-full border border-sand px-6 py-3 text-center text-sm font-semibold text-ink/80 transition-colors hover:border-sage hover:text-sage-dark"
                >
                  I already have an account
                </Link>
              </>
            ) : billingEnabled ? (
              <BillingButton
                endpoint="/api/stripe/checkout"
                label="Start subscription"
                pendingLabel="Opening Stripe …"
              />
            ) : (
              <p className="rounded-xl bg-sand/50 px-4 py-3 text-sm text-ink/70">
                Subscriptions are not open yet.
              </p>
            )}
            <p className="text-center text-xs text-ink/50">
              {priceLabel} · {quota} analyses per month
            </p>
          </div>
        </div>
      </div>

      {/* Disabled stand-in for the real upload area, so the page shows the shape
          of the tool rather than describing it. */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div
          aria-hidden
          className="flex min-h-[260px] select-none items-center justify-center rounded-xl2 border-2 border-dashed border-sand bg-sand/20 opacity-70"
        >
          <div className="p-6 text-center text-ink/50">
            <p className="font-semibold text-ink/60">Drag a room photo here</p>
            <p className="mt-1 text-sm">Available once you are signed in</p>
          </div>
        </div>

        <ol className="space-y-5">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sage/15 text-sm font-semibold text-sage-dark">
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-sm text-ink/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-sm text-ink/60">
        See{" "}
        <Link href="/priser" className="font-semibold text-sage-dark underline">
          pricing
        </Link>{" "}
        for what is included, or read the{" "}
        <Link href="/blogg" className="font-semibold text-sage-dark underline">
          blog
        </Link>{" "}
        — that part is free for everyone.
      </p>
    </div>
  );
}
