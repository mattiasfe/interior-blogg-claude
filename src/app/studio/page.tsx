import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StudioClient from "@/components/studio/StudioClient";
import { isStudioEnabled } from "@/lib/studio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Romassistent",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (!isStudioEnabled()) notFound();

  return (
    <div className="container-content py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark">
          Internt verktøy · kun lokalt
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Romassistent
        </h1>
        <p className="mt-3 text-ink/70">
          Last opp et rombilde. Claude analyserer rommet, foreslår møbler fra katalogen,
          skriver en Pinterest-pin og et bloggutkast du kan redigere og lagre rett i repoet.
        </p>
      </div>
      <StudioClient />
    </div>
  );
}
