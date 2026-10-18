import fs from "fs";
import path from "path";

/**
 * Pinterest API v5 client for the studio.
 *
 * Runs only in local development (same gate as the rest of the studio). The
 * token is kept in a gitignored file at the repo root rather than a database,
 * because this is a single-user local tool.
 */

const AUTH_URL = "https://www.pinterest.com/oauth/";

/**
 * Apps on Trial access cannot create Pins against the production host — the
 * API answers 403 code 29 and points at the sandbox. Sandbox is a separate
 * world: its own token, and its own boards (the list starts empty; sandbox
 * boards never become real ones). Default to sandbox until the app is approved
 * for Standard access, then set PINTEREST_ENV=production.
 */
export type PinterestEnv = "sandbox" | "production";

export function pinterestEnv(): PinterestEnv {
  return process.env.PINTEREST_ENV === "production" ? "production" : "sandbox";
}

function apiBase(): string {
  return pinterestEnv() === "production"
    ? "https://api.pinterest.com/v5"
    : "https://api-sandbox.pinterest.com/v5";
}

export const SCOPES = [
  "user_accounts:read",
  "boards:read",
  "boards:write",
  "pins:read",
  "pins:write",
];

/** Separate file per environment so the two tokens never overwrite each other. */
function tokenFile(): string {
  return path.join(process.cwd(), `.pinterest-token.${pinterestEnv()}.json`);
}

type StoredToken = {
  accessToken: string;
  refreshToken: string;
  /** epoch ms */
  expiresAt: number;
  scope: string;
};

export function pinterestConfig() {
  const appId = process.env.PINTEREST_APP_ID;
  const appSecret = process.env.PINTEREST_APP_SECRET;
  const redirectUri =
    process.env.PINTEREST_REDIRECT_URI || "http://localhost:3000/api/pinterest/callback";
  if (!appId || !appSecret) {
    throw new Error(
      "PINTEREST_APP_ID og PINTEREST_APP_SECRET mangler i .env.local. Opprett en app på developers.pinterest.com."
    );
  }
  return { appId, appSecret, redirectUri };
}

export function authorizeUrl(state: string): string {
  const { appId, redirectUri } = pinterestConfig();
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES.join(","),
    state,
  });
  return `${AUTH_URL}?${params}`;
}

function basicAuth(): string {
  const { appId, appSecret } = pinterestConfig();
  return `Basic ${Buffer.from(`${appId}:${appSecret}`).toString("base64")}`;
}

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
};

async function requestToken(body: Record<string, string>): Promise<StoredToken> {
  const response = await fetch(`${apiBase()}/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: basicAuth(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Pinterest token-feil ${response.status}: ${text}`);
  }
  const data = JSON.parse(text) as TokenResponse;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    scope: data.scope,
  };
}

function saveToken(token: StoredToken) {
  fs.writeFileSync(tokenFile(), JSON.stringify(token, null, 2), "utf8");
}

function readToken(): StoredToken | null {
  const file = tokenFile();
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as StoredToken;
}

export async function exchangeCode(code: string): Promise<void> {
  const { redirectUri } = pinterestConfig();
  saveToken(
    await requestToken({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    })
  );
}

export function disconnect(): void {
  const file = tokenFile();
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

async function accessToken(): Promise<string | null> {
  const stored = readToken();
  if (!stored) return null;
  // Refresh a minute early so a long request cannot straddle the expiry.
  if (stored.expiresAt - 60_000 > Date.now()) return stored.accessToken;

  const refreshed = await requestToken({
    grant_type: "refresh_token",
    refresh_token: stored.refreshToken,
  });
  // Pinterest omits a new refresh token unless rotation is on; keep the old one.
  saveToken({ ...refreshed, refreshToken: refreshed.refreshToken || stored.refreshToken });
  return refreshed.accessToken;
}

/** Carries Pinterest's own error code so callers can handle specific cases. */
export class PinterestApiError extends Error {
  constructor(
    readonly status: number,
    /** Pinterest error code, e.g. 58 for a duplicate board name. */
    readonly code: number | null,
    message: string
  ) {
    super(message);
    this.name = "PinterestApiError";
  }
}

async function call<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const token = await accessToken();
  if (!token) throw new Error("Ikke koblet til Pinterest.");
  const response = await fetch(`${apiBase()}${endpoint}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const text = await response.text();
  if (!response.ok) {
    let code: number | null = null;
    try {
      code = (JSON.parse(text) as { code?: number }).code ?? null;
    } catch {
      // Not JSON; the raw text in the message is all we have.
    }
    throw new PinterestApiError(
      response.status,
      code,
      `Pinterest ${endpoint} ${response.status}: ${text}`
    );
  }
  return JSON.parse(text) as T;
}

export function isConnected(): boolean {
  return readToken() !== null;
}

export function grantedScopes(): string {
  return readToken()?.scope ?? "";
}

export type PinterestAccount = {
  username: string;
  account_type: string;
  profile_image: string;
};

export function getAccount(): Promise<PinterestAccount> {
  return call<PinterestAccount>("/user_account");
}

export type Board = { id: string; name: string; privacy: string };

/**
 * Sandbox quirk, verified against the API on 2026-10-18: `GET /boards` always
 * answers `{"items":[],"bookmark":null}` there, even straight after a board was
 * created successfully (201 with a usable id). Meanwhile `POST /boards`
 * validates the name against the *real* account, so a name that is in use on
 * pinterest.com is rejected with code 58 while remaining invisible in the list.
 *
 * So boards we create are remembered in a local file, the same way the token
 * is. In production the API lists boards properly and the cache is only
 * additive.
 */
function boardsCacheFile(): string {
  return path.join(process.cwd(), `.pinterest-boards.${pinterestEnv()}.json`);
}

function readCachedBoards(): Board[] {
  const file = boardsCacheFile();
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as Board[];
  } catch {
    return [];
  }
}

function cacheBoard(board: Board): void {
  const trimmed = { id: board.id, name: board.name, privacy: board.privacy };
  const boards = readCachedBoards().filter((b) => b.id !== trimmed.id);
  boards.push(trimmed);
  fs.writeFileSync(boardsCacheFile(), JSON.stringify(boards, null, 2), "utf8");
}

export async function listBoards(): Promise<Board[]> {
  const data = await call<{ items: Board[] }>("/boards?page_size=100");
  const fromApi = data.items;

  // The API is authoritative; cached entries only fill in what it omits.
  const seen = new Set(fromApi.map((b) => b.id));
  return [...fromApi, ...readCachedBoards().filter((b) => !seen.has(b.id))];
}

export type CreatedBoard = { board: Board; renamedFrom?: string };

/**
 * Creates a board and remembers it locally.
 *
 * In the sandbox a name already taken on the real account cannot be reused and
 * cannot be looked up either, so the board is created under a suffixed name —
 * sandbox board names are never seen by anyone. In production a duplicate name
 * means the board really is on the account, so the error is passed on and the
 * caller can tell the user to pick it from the list.
 */
export async function createBoard(name: string, description = ""): Promise<CreatedBoard> {
  const attempt = (boardName: string) =>
    call<Board>("/boards", {
      method: "POST",
      body: JSON.stringify({ name: boardName, description, privacy: "PUBLIC" }),
    });

  // Reuse a board we already made for this name, so pressing the button twice
  // does not leave two near-identical boards behind.
  const known = await listBoards();
  const existing = known.find((b) => b.name === name || b.name.startsWith(`${name} (sandbox`));
  if (existing) {
    return { board: existing, renamedFrom: existing.name === name ? undefined : name };
  }

  try {
    const board = await attempt(name);
    cacheBoard(board);
    return { board };
  } catch (error) {
    const nameTaken = error instanceof PinterestApiError && error.code === 58;
    if (!nameTaken || pinterestEnv() === "production") throw error;

    // Suffix until the sandbox accepts it; a couple of tries is plenty.
    for (const suffix of [" (sandbox)", ` (sandbox ${Date.now().toString().slice(-4)})`]) {
      try {
        const board = await attempt(`${name}${suffix}`);
        cacheBoard(board);
        return { board, renamedFrom: name };
      } catch (retryError) {
        if (!(retryError instanceof PinterestApiError) || retryError.code !== 58) throw retryError;
      }
    }
    throw error;
  }
}

export type CreatePinInput = {
  boardId: string;
  title: string;
  description: string;
  altText: string;
  link: string;
  imageBase64: string;
  contentType: "image/jpeg" | "image/png";
};

export async function createPin(input: CreatePinInput): Promise<{ id: string }> {
  return call<{ id: string }>("/pins", {
    method: "POST",
    body: JSON.stringify({
      board_id: input.boardId,
      title: input.title.slice(0, 100),
      description: input.description.slice(0, 800),
      alt_text: input.altText.slice(0, 500),
      link: input.link,
      media_source: {
        source_type: "image_base64",
        content_type: input.contentType,
        data: input.imageBase64,
      },
    }),
  });
}
