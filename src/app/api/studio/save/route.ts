import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  buildMarkdown,
  isStudioEnabled,
  slugify,
  uniqueSlug,
  type StudioResult,
} from "@/lib/studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Writes the reviewed draft into the repo:
 *  - public/images/studio/<slug>.jpg      (cover image)
 *  - content/posts/<slug>.md              (blog post, ready for git)
 *  - content/studio/pins/<slug>.json      (Pinterest text to copy into Pinterest)
 */
export async function POST(request: Request) {
  if (!isStudioEnabled()) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const { result, image } = (await request.json()) as {
      result?: StudioResult;
      image?: string;
    };
    if (!result || !image) {
      return NextResponse.json({ error: "Mangler resultat eller bilde." }, { status: 400 });
    }

    const root = process.cwd();
    const slug = uniqueSlug(slugify(result.post.slug || result.post.title));
    const date = new Date().toISOString().slice(0, 10);

    const imageDir = path.join(root, "public/images/studio");
    fs.mkdirSync(imageDir, { recursive: true });
    fs.writeFileSync(path.join(imageDir, `${slug}.jpg`), Buffer.from(image, "base64"));
    const coverImage = `/images/studio/${slug}.jpg`;

    const postPath = path.join(root, "content/posts", `${slug}.md`);
    fs.writeFileSync(postPath, buildMarkdown(result, coverImage, date), "utf8");

    const pinDir = path.join(root, "content/studio/pins");
    fs.mkdirSync(pinDir, { recursive: true });
    const pin = {
      ...result.pin,
      link: `https://skandinaviskbo.com/blogg/${slug}`,
      image: coverImage,
      createdAt: date,
    };
    fs.writeFileSync(path.join(pinDir, `${slug}.json`), JSON.stringify(pin, null, 2), "utf8");

    return NextResponse.json({
      slug,
      files: [
        `content/posts/${slug}.md`,
        `public/images/studio/${slug}.jpg`,
        `content/studio/pins/${slug}.json`,
      ],
    });
  } catch (error) {
    console.error("[studio/save]", error);
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
