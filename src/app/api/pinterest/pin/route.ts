import { NextResponse } from "next/server";
import { getStudioSession } from "@/lib/access";
import { createPin } from "@/lib/pinterest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await getStudioSession()).isOwner) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const body = (await request.json()) as {
      boardId?: string;
      title?: string;
      description?: string;
      altText?: string;
      link?: string;
      image?: string;
    };

    if (!body.boardId || !body.image || !body.title) {
      return NextResponse.json({ error: "Mangler tavle, bilde eller tittel." }, { status: 400 });
    }

    const pin = await createPin({
      boardId: body.boardId,
      title: body.title,
      description: body.description ?? "",
      altText: body.altText ?? "",
      link: body.link ?? "",
      imageBase64: body.image,
      contentType: "image/jpeg",
    });

    return NextResponse.json({ id: pin.id, url: `https://www.pinterest.com/pin/${pin.id}/` });
  } catch (error) {
    console.error("[pinterest/pin]", error);
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
