import crypto from "crypto";
import { NextResponse } from "next/server";
import { getStudioSession } from "@/lib/access";
import { authorizeUrl } from "@/lib/pinterest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getStudioSession()).isOwner) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const state = crypto.randomBytes(16).toString("hex");
    const response = NextResponse.redirect(authorizeUrl(state));
    response.cookies.set("pinterest_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
