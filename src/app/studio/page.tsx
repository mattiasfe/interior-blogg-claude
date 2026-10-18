import type { Metadata } from "next";
import StudioClient from "@/components/studio/StudioClient";
import StudioLocked from "@/components/studio/StudioLocked";
import { getStudioSession, isBillingConfigured, monthlyQuota } from "@/lib/access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Room Studio",
  description:
    "Upload a photo of your room and get an analysis, furniture suggestions and ready-made Pinterest copy.",
};

const priceLabel = process.env.NEXT_PUBLIC_STUDIO_PRICE_LABEL || "kr 149 / month";

/**
 * The studio page is public: anyone may see what the tool does. Running an
 * analysis requires a signed-in user with an active subscription, which is
 * enforced here and again in /api/studio/analyze.
 */
export default async function StudioPage() {
  const session = await getStudioSession();

  return (
    <div className="container-content py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark">
          Room Studio
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Romassistent
        </h1>
        <p className="mt-3 text-ink/70">
          Last opp et rombilde. Claude analyserer rommet, foreslår møbler fra katalogen, skriver en
          Pinterest-pin og et bloggutkast du kan redigere.
        </p>
      </div>

      {session.access === "active" ? (
        <StudioClient isOwner={session.isOwner} used={session.used} quota={session.quota} />
      ) : (
        <StudioLocked
          access={session.access}
          billingEnabled={isBillingConfigured()}
          quota={monthlyQuota()}
          priceLabel={priceLabel}
        />
      )}
    </div>
  );
}
