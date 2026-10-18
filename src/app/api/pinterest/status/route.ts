import { NextResponse } from "next/server";
import { getStudioSession } from "@/lib/access";
import {
  PinterestApiError,
  createBoard,
  disconnect,
  getAccount,
  grantedScopes,
  isConnected,
  listBoards,
  pinterestEnv,
} from "@/lib/pinterest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getStudioSession()).isOwner) {
    return NextResponse.json({ connected: false });
  }

  if (!isConnected()) {
    return NextResponse.json({ connected: false, env: pinterestEnv() });
  }

  try {
    const [account, boards] = await Promise.all([getAccount(), listBoards()]);
    return NextResponse.json({
      connected: true,
      env: pinterestEnv(),
      username: account.username,
      scopes: grantedScopes(),
      boards: boards.map((b) => ({ id: b.id, name: b.name, privacy: b.privacy })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ connected: false, env: pinterestEnv(), error: message });
  }
}

/** Creates a board — needed in the sandbox, where the board list starts empty. */
export async function PUT(request: Request) {
  if (!(await getStudioSession()).isOwner) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const { name } = (await request.json()) as { name?: string };
    if (!name?.trim()) {
      return NextResponse.json({ error: "Mangler tavlenavn." }, { status: 400 });
    }
    const created = await createBoard(name.trim());
    return NextResponse.json(created);
  } catch (error) {
    // Code 58 survives only in production, where the board genuinely is on the
    // account and will show up in the list.
    if (error instanceof PinterestApiError && error.code === 58) {
      return NextResponse.json(
        { error: "Tavla finnes allerede på kontoen din — velg den i lista.", code: 58 },
        { status: 409 }
      );
    }
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  if (!(await getStudioSession()).isOwner) {
    return new NextResponse("Not found", { status: 404 });
  }
  disconnect();
  return NextResponse.json({ connected: false });
}
