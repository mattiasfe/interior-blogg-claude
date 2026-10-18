import { NextResponse } from "next/server";
import { getStudioSession } from "@/lib/access";
import { exchangeCode } from "@/lib/pinterest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await getStudioSession()).isOwner) {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const studio = new URL("/studio", url.origin);

  const error = url.searchParams.get("error");
  if (error) {
    studio.searchParams.set("pinterest", `feil: ${error}`);
    return NextResponse.redirect(studio);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = request.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("pinterest_oauth_state="))
    ?.slice("pinterest_oauth_state=".length);

  if (!code || !state || state !== expectedState) {
    studio.searchParams.set("pinterest", "feil: ugyldig state eller manglende kode");
    return NextResponse.redirect(studio);
  }

  try {
    await exchangeCode(code);
    studio.searchParams.set("pinterest", "tilkoblet");
  } catch (err) {
    studio.searchParams.set("pinterest", `feil: ${err instanceof Error ? err.message : "ukjent"}`);
  }

  const response = NextResponse.redirect(studio);
  response.cookies.delete("pinterest_oauth_state");
  return response;
}
