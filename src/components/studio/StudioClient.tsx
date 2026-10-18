"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CatalogProduct, StudioResult } from "@/lib/studio";

type Status = "idle" | "analyzing" | "ready" | "saving" | "saved" | "error";

type PinterestBoard = { id: string; name: string; privacy: string };
type PinterestStatus = {
  connected: boolean;
  env?: "sandbox" | "production";
  username?: string;
  scopes?: string;
  boards?: PinterestBoard[];
  error?: string;
};

const MAX_SIDE = 1600;

/** Downscale to max 1600px and re-encode as JPEG so the upload stays small. */
async function prepareImage(file: File): Promise<{ base64: string; preview: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const preview = canvas.toDataURL("image/jpeg", 0.85);
  return { base64: preview.split(",")[1], preview };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-full border border-sand px-3 py-1 text-xs font-semibold text-ink/70 hover:bg-sand/60"
    >
      {copied ? "Kopiert" : "Kopier"}
    </button>
  );
}

function Counter({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={`text-xs ${over ? "font-semibold text-red-700" : "text-ink/50"}`}>
      {value.length}/{max}
    </span>
  );
}

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink focus:border-sage focus:outline-none";

type StudioClientProps = {
  /** Owners may publish to Pinterest and write drafts into the repo. */
  isOwner: boolean;
  used: number;
  /** null means unlimited */
  quota: number | null;
};

export default function StudioClient({ isOwner, used, quota }: StudioClientProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [usage, setUsage] = useState({ used, quota });
  const [image, setImage] = useState<{ base64: string; preview: string } | null>(null);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<StudioResult | null>(null);
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [savedFiles, setSavedFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const [pinterest, setPinterest] = useState<PinterestStatus>({ connected: false });
  const [boardId, setBoardId] = useState("");
  const [boardUnmatched, setBoardUnmatched] = useState(false);
  const [boardNote, setBoardNote] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [pinError, setPinError] = useState("");

  const loadFile = useCallback(async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setError("");
    setResult(null);
    setSavedFiles([]);
    setStatus("idle");
    setImage(await prepareImage(file));
  }, []);

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (file) {
        e.preventDefault();
        loadFile(file);
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [loadFile]);

  useEffect(() => {
    fetch("/api/pinterest/status")
      .then((r) => r.json())
      .then(setPinterest)
      .catch(() => setPinterest({ connected: false }));
  }, []);

  // Preselect the board Claude suggested, matching on name. If the suggestion
  // matches nothing, leave the selection empty and say so rather than quietly
  // defaulting to the first board — that publishes to the wrong place.
  useEffect(() => {
    if (!result || !pinterest.boards) return;
    const match = pinterest.boards.find(
      (b) => b.name.toLowerCase() === result.pin.board.toLowerCase()
    );
    setBoardId(match?.id ?? "");
    setBoardUnmatched(!match);
  }, [result, pinterest.boards]);

  async function publishPin() {
    if (!result || !image || !boardId) return;
    setPublishing(true);
    setPinError("");
    setPublishedUrl("");
    try {
      const res = await fetch("/api/pinterest/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId,
          title: result.pin.title,
          description: result.pin.description,
          altText: result.pin.altText,
          link: `https://skandinaviskbo.com/blogg/${result.post.slug}`,
          image: image.base64,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publisering feilet");
      setPublishedUrl(data.url);
    } catch (e) {
      setPinError(e instanceof Error ? e.message : "Noe gikk galt");
    } finally {
      setPublishing(false);
    }
  }

  async function createSuggestedBoard() {
    if (!result) return;
    setPinError("");
    try {
      const res = await fetch("/api/pinterest/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: result.pin.board }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunne ikke opprette tavla");
      setPinterest((p) => ({ ...p, boards: [...(p.boards ?? []), data.board] }));
      setBoardId(data.board.id);
      setBoardUnmatched(false);
      setBoardNote(
        data.renamedFrom
          ? `«${data.renamedFrom}» er opptatt på den ekte kontoen, så sandbox-tavla heter «${data.board.name}». Navnet spiller ingen rolle her — ingen ser den.`
          : ""
      );
    } catch (e) {
      setPinError(e instanceof Error ? e.message : "Noe gikk galt");
    }
  }

  async function disconnectPinterest() {
    await fetch("/api/pinterest/status", { method: "DELETE" });
    setPinterest({ connected: false });
    setBoardId("");
  }

  async function analyze() {
    if (!image) return;
    setStatus("analyzing");
    setError("");
    setErrorCode("");
    try {
      const res = await fetch("/api/studio/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: image.base64, mediaType: "image/jpeg", notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorCode(data.code ?? "");
        if (typeof data.used === "number") setUsage({ used: data.used, quota: data.quota ?? null });
        throw new Error(data.error || "Analysen feilet");
      }
      setResult(data.result);
      setCatalog(data.catalog);
      if (data.usage) setUsage(data.usage);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Noe gikk galt");
      setStatus("error");
    }
  }

  async function save() {
    if (!result || !image) return;
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/studio/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, image: image.base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lagring feilet");
      setSavedFiles(data.files);
      setStatus("saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Noe gikk galt");
      setStatus("ready");
    }
  }

  function updatePost<K extends keyof StudioResult["post"]>(key: K, value: StudioResult["post"][K]) {
    setResult((r) => (r ? { ...r, post: { ...r.post, [key]: value } } : r));
  }
  function updatePin<K extends keyof StudioResult["pin"]>(key: K, value: string) {
    setResult((r) => (r ? { ...r, pin: { ...r.pin, [key]: value } } : r));
  }

  const productById = new Map(catalog.map((p) => [p.id, p]));

  return (
    <div className="mt-8 space-y-8">
      {/* Upload */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div
          onClick={() => fileInput.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            loadFile(e.dataTransfer.files[0]);
          }}
          className={`flex min-h-[260px] cursor-pointer items-center justify-center overflow-hidden rounded-xl2 border-2 border-dashed transition-colors ${
            dragging ? "border-sage bg-sage/10" : "border-sand bg-white hover:border-wood"
          }`}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.preview} alt="Valgt rombilde" className="max-h-[420px] w-full object-contain" />
          ) : (
            <div className="p-6 text-center text-ink/60">
              <p className="font-semibold text-ink">Dra et rombilde hit</p>
              <p className="mt-1 text-sm">eller klikk for å velge, eller lim inn (Ctrl+V) et skjermbilde</p>
            </div>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0])}
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-ink">
            Notater til Claude (valgfritt)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="F.eks. «18 kvm studioleilighet, vil ha mer oppbevaring», «Fokuser på belysning», «Pinterest-pin til tavla Living Room»"
              className={`${inputClass} mt-2 font-normal`}
            />
          </label>
          <button
            type="button"
            onClick={analyze}
            disabled={!image || status === "analyzing"}
            className="rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "analyzing" ? "Analyserer rommet … (20–60 sek)" : "Analyser rommet"}
          </button>
          {usage.quota !== null && (
            <p className="text-xs text-ink/50">
              {usage.used} av {usage.quota} analyser brukt denne måneden ·{" "}
              <a href="/konto" className="underline hover:text-ink">
                konto
              </a>
            </p>
          )}
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              <p>{error}</p>
              {(errorCode === "needs-plan" || errorCode === "quota") && (
                <a href="/priser" className="mt-1 inline-block font-semibold underline">
                  Se abonnement
                </a>
              )}
              {errorCode === "signed-out" && (
                <a href="/logg-inn" className="mt-1 inline-block font-semibold underline">
                  Logg inn
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {result && (
        <>
          {/* Analysis */}
          <section className="rounded-xl2 border border-sand bg-white p-6">
            <h2 className="font-serif text-2xl font-semibold text-ink">Analyse</h2>
            <p className="mt-2 text-ink/80">
              <span className="font-semibold">{result.room.roomType}</span> · {result.room.style}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.room.palette.map((c) => (
                <span key={c} className="rounded-full bg-sand/60 px-3 py-1 text-xs text-ink/70">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-sage-dark">Fungerer</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
                  {result.room.strengths.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-wood-dark">Holder rommet tilbake</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
                  {result.room.problems.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* Suggestions */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-ink">Møbelforslag</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.suggestions.map((s, i) => {
                const product = s.productId ? productById.get(s.productId) : undefined;
                return (
                  <div key={i} className="flex flex-col rounded-xl2 border border-sand bg-white p-5">
                    <h3 className="font-serif text-lg font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-xs text-ink/50">{s.placement}</p>
                    <p className="mt-2 flex-1 text-sm text-ink/80">{s.why}</p>
                    {product ? (
                      <div className="mt-4 rounded-xl bg-cream p-3 text-sm">
                        <p className="font-semibold text-ink">
                          {product.name} <span className="font-normal text-ink/50">· {product.retailer}</span>
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <a href={product.affiliateUrl || product.url} target="_blank" rel="noopener noreferrer" className="text-sage-dark underline">
                            Åpne
                          </a>
                          {product.affiliateUrl ? (
                            <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[11px] font-semibold text-sage-dark">Affiliate</span>
                          ) : (
                            <span className="rounded-full bg-wood/20 px-2 py-0.5 text-[11px] font-semibold text-wood-dark">Mangler affiliate-lenke</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl bg-cream p-3 text-sm text-ink/70">
                        Ikke i katalogen. Søk: <span className="font-semibold text-ink">{s.searchQuery}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Pinterest */}
          <section className="rounded-xl2 border border-sand bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold text-ink">Pinterest-pin</h2>
              <span className="rounded-full bg-[#E60023]/10 px-3 py-1 text-xs font-semibold text-[#E60023]">
                Tavle: {result.pin.board}
              </span>
            </div>
            {(["title", "description", "altText"] as const).map((key) => {
              const max = key === "title" ? 100 : 500;
              const label = key === "title" ? "Tittel" : key === "description" ? "Beskrivelse" : "Alt-tekst";
              return (
                <div key={key} className="mt-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{label}</span>
                    <div className="flex items-center gap-3">
                      <Counter value={result.pin[key]} max={max} />
                      <CopyButton text={result.pin[key]} />
                    </div>
                  </div>
                  {key === "title" ? (
                    <input value={result.pin[key]} onChange={(e) => updatePin(key, e.target.value)} className={inputClass} />
                  ) : (
                    <textarea value={result.pin[key]} onChange={(e) => updatePin(key, e.target.value)} rows={3} className={inputClass} />
                  )}
                </div>
              );
            })}

            {isOwner ? (
            <div className="mt-6 border-t border-sand pt-5">
              {!pinterest.connected ? (
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="/api/pinterest/connect"
                    className="rounded-full bg-[#E60023] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c5001d]"
                  >
                    Koble til Pinterest
                  </a>
                  <p className="text-sm text-ink/60">
                    {pinterest.error
                      ? pinterest.error
                      : "Logg inn for å publisere pinnen direkte i stedet for å kopiere teksten."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-ink/70">
                      Tilkoblet som <span className="font-semibold text-ink">@{pinterest.username}</span>
                      {pinterest.env === "sandbox" && (
                        <span className="ml-2 rounded-full bg-wood/20 px-2 py-0.5 text-[11px] font-semibold text-wood-dark">
                          Sandbox — pinnene blir ikke synlige offentlig
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={disconnectPinterest}
                      className="rounded-full border border-sand px-3 py-1 text-xs font-semibold text-ink/70 hover:bg-sand/60"
                    >
                      Koble fra
                    </button>
                  </div>
                  <label className="block text-sm font-semibold text-ink">
                    Publiser til tavle
                    <select
                      value={boardId}
                      onChange={(e) => setBoardId(e.target.value)}
                      className={`${inputClass} mt-1 font-normal`}
                    >
                      <option value="">— velg tavle —</option>
                      {pinterest.boards?.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                          {b.privacy !== "PUBLIC" ? ` (${b.privacy.toLowerCase()})` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  {boardNote && (
                    <p className="rounded-xl bg-sage/10 px-4 py-3 text-sm text-sage-dark">{boardNote}</p>
                  )}
                  {boardUnmatched && (
                    <div className="rounded-xl bg-wood/15 px-4 py-3 text-sm text-wood-dark">
                      <p>
                        Claude foreslo tavla «{result.pin.board}», men den finnes ikke
                        {pinterest.env === "sandbox"
                          ? " i sandbox (der starter tavlelista tom)."
                          : " på kontoen din."}{" "}
                        Velg en annen tavle, eller opprett den.
                      </p>
                      <button
                        type="button"
                        onClick={createSuggestedBoard}
                        className="mt-2 rounded-full border border-wood-dark/40 px-3 py-1 text-xs font-semibold hover:bg-wood/20"
                      >
                        Opprett «{result.pin.board}»
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={publishPin}
                      disabled={publishing || !boardId}
                      className="rounded-full bg-[#E60023] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c5001d] disabled:opacity-50"
                    >
                      {publishing ? "Publiserer …" : "Publiser pin"}
                    </button>
                    {publishedUrl &&
                      (pinterest.env === "sandbox" ? (
                        <p className="text-sm font-semibold text-sage-dark">
                          Pin opprettet i sandbox — den finnes ikke på pinterest.com, så det er
                          ingen lenke å åpne.
                        </p>
                      ) : (
                        <a
                          href={publishedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-sage-dark underline"
                        >
                          Pin publisert — åpne på Pinterest
                        </a>
                      ))}
                  </div>
                  {pinError && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{pinError}</p>
                  )}
                </div>
              )}
            </div>
            ) : (
              <p className="mt-6 border-t border-sand pt-5 text-sm text-ink/60">
                Kopier tittel, beskrivelse og alt-tekst inn i Pinterest når du laster opp bildet.
              </p>
            )}
          </section>

          {/* Blog draft */}
          <section className="rounded-xl2 border border-sand bg-white p-6">
            <h2 className="font-serif text-2xl font-semibold text-ink">Bloggutkast</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-ink sm:col-span-2">
                Tittel
                <input value={result.post.title} onChange={(e) => updatePost("title", e.target.value)} className={`${inputClass} mt-1 font-normal`} />
              </label>
              <label className="text-sm font-semibold text-ink sm:col-span-2">
                Meta-beskrivelse
                <textarea value={result.post.description} onChange={(e) => updatePost("description", e.target.value)} rows={2} className={`${inputClass} mt-1 font-normal`} />
              </label>
              <label className="text-sm font-semibold text-ink">
                Slug
                <input value={result.post.slug} onChange={(e) => updatePost("slug", e.target.value)} className={`${inputClass} mt-1 font-normal`} />
              </label>
              <label className="text-sm font-semibold text-ink">
                Kategori
                <input value={result.post.category} readOnly className={`${inputClass} mt-1 bg-cream font-normal`} />
              </label>
              <label className="text-sm font-semibold text-ink sm:col-span-2">
                Tags (kommaseparert)
                <input
                  value={result.post.tags.join(", ")}
                  onChange={(e) => updatePost("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                  className={`${inputClass} mt-1 font-normal`}
                />
              </label>
              <label className="text-sm font-semibold text-ink sm:col-span-2">
                Innhold (markdown) · «Shop the look» legges til automatisk ved lagring
                <textarea
                  value={result.post.body}
                  onChange={(e) => updatePost("body", e.target.value)}
                  rows={22}
                  className={`${inputClass} mt-1 font-mono text-[13px] font-normal leading-relaxed`}
                />
              </label>
            </div>

            {isOwner ? (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={save}
                disabled={status === "saving"}
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/85 disabled:opacity-50"
              >
                {status === "saving" ? "Lagrer …" : "Lagre utkast i repoet"}
              </button>
              {status === "saved" && savedFiles.length > 0 && (
                <div className="text-sm text-ink/80">
                  <p className="font-semibold text-sage-dark">Lagret. Se over, så commit:</p>
                  <ul className="mt-1 font-mono text-xs">
                    {savedFiles.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
              )}
            </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-sand pt-5">
                <CopyButton text={result.post.body} />
                <p className="text-sm text-ink/60">Kopier utkastet og bruk det der du vil.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
