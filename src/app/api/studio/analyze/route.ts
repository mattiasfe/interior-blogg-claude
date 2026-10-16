import { NextResponse } from "next/server";
import { analyzeRoom, getCatalog, isStudioEnabled } from "@/lib/studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const allowedTypes = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedType = (typeof allowedTypes)[number];

export async function POST(request: Request) {
  if (!isStudioEnabled()) {
    return new NextResponse("Not found", { status: 404 });
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

    const result = await analyzeRoom(image, mediaType as AllowedType, notes ?? "");
    return NextResponse.json({ result, catalog: getCatalog() });
  } catch (error) {
    console.error("[studio/analyze]", error);
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
