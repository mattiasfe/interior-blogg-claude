"use client";

import { useCallback, useRef, useState } from "react";
import type { CatalogProduct, StudioResult } from "@/lib/studio";

type Status = "idle" | "analyzing" | "ready" | "saving" | "saved" | "error";

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

export default function StudioClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [image, setImage] = useState<{ base64: string; preview: string } | null>(null);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<StudioResult | null>(null);
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [savedFiles, setSavedFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setError("");
    setResult(null);
    setSavedFiles([]);
    setStatus("idle");
    setImage(await prepareImage(file));
  }, []);

  async function analyze() {
    if (!image) return;
    setStatus("analyzing");
    setError("");
    try {
      const res = await fetch("/api/studio/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: image.base64, mediaType: "image/jpeg", notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysen feilet");
      setResult(data.result);
      setCatalog(data.catalog);
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
              <p className="mt-1 text-sm">eller klikk for å velge (jpg, png, webp)</p>
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
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
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
          </section>
        </>
      )}
    </div>
  );
}
