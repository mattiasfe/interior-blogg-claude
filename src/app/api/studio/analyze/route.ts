import { NextResponse } from "next/server";
import { analyzeRoom, getCatalog } from "@/lib/studio";
import { consumeStudioCredit, getStudioSession } from "@/lib/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const allowedTypes = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedType = (typeof allowedTypes)[number];

const problems = {
  "signed-out": { status: 401, error: "Logg inn for å analysere et rom." },
  "needs-plan": { status: 402, error: "Analyse krever et aktivt abonnement." },
  quota: { status: 429, error: "Du har brukt opp analysene dine denne måneden." },
} as const;

export async function POST(request: Request) {
  // Check access before anything else, so an unauthorised caller never reaches
  // the model — but only book the credit once the request is actually valid.
  const session = await getStudioSession();
  if (session.access !== "active") {
    const problem = problems[session.access];
    return NextResponse.json(
      { error: problem.error, code: session.access, used: session.used, quota: session.quota },
      { status: problem.status }
    );
  }

  try {
    const { image, mediaType, notes } = (await request.json()) as {
      image?: string;
      mediaType?: string;
      notes?: string;
    };

    if (!image || !mediaType || !allowedTypes.includes(mediaType as AllowedType)) {
      return NextResponse.json({ error: "Mangler bilde (jpg, png eller webp)." }, { status: 400 });
    }

    // Booked before the Anthropic call so retries on a failing analysis cannot
    // drain the API key.
    const credit = await consumeStudioCredit();
    if (!credit.ok) {
      const problem = problems[credit.reason];
      const error =
        credit.reason === "quota"
          ? `Du har brukt alle ${credit.quota} analysene denne måneden. Kvoten nullstilles den 1.`
          : problem.error;
      return NextResponse.json(
        { error, code: credit.reason, used: credit.used, quota: credit.quota },
        { status: problem.status }
      );
    }

    const result = await analyzeRoom(image, mediaType as AllowedType, notes ?? "");
    return NextResponse.json({
      result,
      catalog: getCatalog(),
      usage: { used: credit.used, quota: credit.quota },
    });
  } catch (error) {
    console.error("[studio/analyze]", error);
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
