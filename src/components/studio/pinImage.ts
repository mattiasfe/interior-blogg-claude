/**
 * Builds the 2:3 image that gets published to Pinterest.
 *
 * Pinterest ranks tall pins far better than wide ones, and a room photo is
 * almost always landscape. So instead of cropping the room away, the photo
 * keeps its full width at the top and the pin title fills a band underneath —
 * the usual blog-pin layout, and the title is searchable as part of the image.
 *
 * Runs in the browser (canvas), so no image library is needed on the server.
 */

const PIN_W = 1000;
const PIN_H = 1500;
/** Cap so a portrait photo cannot squeeze the title band away. */
const PHOTO_MAX_H = 1050;
const MIN_BAND_H = 380;

const CREAM = "#FBF9F6";
const SAND = "#E8E4DF";
const WOOD = "#C8A97E";
const INK = "#33312E";
const WOOD_DARK = "#B08D5F";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Kunne ikke lese bildet"));
    img.src = src;
  });
}

/**
 * next/font sets --font-heading / --font-body via a class on <body>, so the
 * variables are not defined on <html> — read them from body.
 */
function fontFamily(variable: string, fallback: string): string {
  const value = getComputedStyle(document.body).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

/** Greedy word wrap against the current ctx font. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export type PinImage = { base64: string; preview: string };

export async function buildPinImage(
  photoDataUrl: string,
  title: string,
  site = "skandinaviskbo.com"
): Promise<PinImage> {
  const img = await loadImage(photoDataUrl);
  // next/font loads asynchronously; drawing before it resolves silently falls
  // back to a system font.
  if (document.fonts?.ready) await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = PIN_W;
  canvas.height = PIN_H;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";

  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, PIN_W, PIN_H);

  // Photo: full width, natural height — unless that would leave no room for
  // the title, in which case cover-crop it into the allowed box.
  const naturalH = Math.round((PIN_W * img.height) / img.width);
  const photoH = Math.min(naturalH, PHOTO_MAX_H, PIN_H - MIN_BAND_H);
  if (naturalH <= photoH) {
    ctx.drawImage(img, 0, 0, PIN_W, photoH);
  } else {
    const scale = Math.max(PIN_W / img.width, photoH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (PIN_W - w) / 2, (photoH - h) / 2, w, h);
  }

  // Accent rule between photo and band.
  ctx.fillStyle = WOOD;
  ctx.fillRect(0, photoH, PIN_W, 6);

  const headingFont = fontFamily("--font-heading", "Georgia, serif");
  const bodyFont = fontFamily("--font-body", "system-ui, sans-serif");

  const padX = 104;
  const maxTextW = PIN_W - padX * 2;
  const bandTop = photoH + 6;
  const bandH = PIN_H - bandTop;
  const footerH = 90;

  // Start big and shrink to fit, so the title fills the band instead of
  // floating in it. Starting small would stop at the first size that fits and
  // leave the band mostly empty.
  const textRoom = bandH - footerH - 48;
  let size = 92;
  let lines: string[] = [];
  let lineH = 0;
  for (; size >= 40; size -= 2) {
    ctx.font = `600 ${size}px ${headingFont}`;
    lines = wrap(ctx, title, maxTextW);
    lineH = Math.round(size * 1.18);
    if (lines.length * lineH <= textRoom) break;
  }
  // Still too long at the smallest size: keep what fits and ellipsize.
  const maxLines = Math.max(1, Math.floor(textRoom / lineH));
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[,;:]?$/, "")}…`;
  }

  const textBlockH = lines.length * lineH;
  let y = bandTop + (bandH - footerH - textBlockH) / 2 + size * 0.82;

  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  for (const line of lines) {
    ctx.fillText(line, PIN_W / 2, y);
    y += lineH;
  }

  // Footer: short divider, then the site name.
  ctx.fillStyle = SAND;
  ctx.fillRect(PIN_W / 2 - 60, PIN_H - footerH + 4, 120, 2);

  ctx.fillStyle = WOOD_DARK;
  ctx.font = `500 26px ${bodyFont}`;
  ctx.letterSpacing = "3px";
  ctx.fillText(site.toUpperCase(), PIN_W / 2, PIN_H - 32);
  ctx.letterSpacing = "0px";

  const preview = canvas.toDataURL("image/jpeg", 0.9);
  return { base64: preview.split(",")[1], preview };
}
