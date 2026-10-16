import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { categories, getAllPosts } from "@/lib/posts";

/**
 * Romassistent / Studio — internal content tool.
 *
 * Only runs in local development (`npm run dev`). In production every studio
 * route returns 404, so nobody can spend the API key or write files on the
 * live site.
 */
export function isStudioEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

export type CatalogProduct = {
  id: string;
  name: string;
  retailer: string;
  category: string;
  tags: string[];
  url: string;
  /** Empty until the affiliate program is approved. */
  affiliateUrl: string;
};

export type Suggestion = {
  title: string;
  why: string;
  placement: string;
  /** id from content/products.json, or null when nothing in the catalog fits */
  productId: string | null;
  /** search phrase to find a product when productId is null */
  searchQuery: string;
};

export type StudioResult = {
  room: {
    roomType: string;
    style: string;
    palette: string[];
    strengths: string[];
    problems: string[];
  };
  suggestions: Suggestion[];
  pin: {
    title: string;
    description: string;
    altText: string;
    board: string;
  };
  post: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    slug: string;
    body: string;
  };
};

const productsPath = path.join(process.cwd(), "content/products.json");

export function getCatalog(): CatalogProduct[] {
  if (!fs.existsSync(productsPath)) return [];
  return JSON.parse(fs.readFileSync(productsPath, "utf8")) as CatalogProduct[];
}

export function productLink(p: CatalogProduct): string {
  return p.affiliateUrl || p.url;
}

const PINTEREST_BOARDS = [
  "Scandinavian Interior",
  "Living Room",
  "Furniture",
  "Wood Working",
  "Kitchen",
  "Bathroom",
];

const resultTool: Anthropic.Tool = {
  name: "save_room_analysis",
  description: "Save the room analysis, product suggestions, Pinterest pin and blog draft.",
  input_schema: {
    type: "object",
    required: ["room", "suggestions", "pin", "post"],
    properties: {
      room: {
        type: "object",
        required: ["roomType", "style", "palette", "strengths", "problems"],
        properties: {
          roomType: { type: "string", description: "e.g. living room, studio apartment, hallway" },
          style: { type: "string", description: "Short style description" },
          palette: { type: "array", items: { type: "string" }, description: "3-6 main colours" },
          strengths: { type: "array", items: { type: "string" } },
          problems: { type: "array", items: { type: "string" }, description: "What holds the room back" },
        },
      },
      suggestions: {
        type: "array",
        minItems: 3,
        maxItems: 6,
        items: {
          type: "object",
          required: ["title", "why", "placement", "productId", "searchQuery"],
          properties: {
            title: { type: "string" },
            why: { type: "string", description: "Why this improves this specific room" },
            placement: { type: "string", description: "Where in the room it goes" },
            productId: {
              type: ["string", "null"],
              description: "id from the product catalog if one genuinely fits, otherwise null",
            },
            searchQuery: { type: "string", description: "Search phrase for finding a matching product" },
          },
        },
      },
      pin: {
        type: "object",
        required: ["title", "description", "altText", "board"],
        properties: {
          title: { type: "string", description: "Max 100 characters" },
          description: { type: "string", description: "Max 450 characters, natural keywords, no hashtags spam" },
          altText: { type: "string", description: "Max 450 characters, describes the image" },
          board: { type: "string", enum: PINTEREST_BOARDS },
        },
      },
      post: {
        type: "object",
        required: ["title", "description", "category", "tags", "slug", "body"],
        properties: {
          title: { type: "string" },
          description: { type: "string", description: "1-2 sentence meta description" },
          category: { type: "string", enum: [...categories] },
          tags: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 8 },
          slug: { type: "string", description: "lowercase-kebab-case, max 8 words" },
          body: {
            type: "string",
            description:
              "Markdown body WITHOUT frontmatter and WITHOUT a shop-the-look section. Use ## headings and finish with '## Interior tips' as a bullet list.",
          },
        },
      },
    },
  },
};

function styleExample(): string {
  const posts = getAllPosts();
  const sample = posts.find((p) => p.slug === "scandinavian-lighting-guide") ?? posts[0];
  if (!sample) return "";
  return `Title: ${sample.title}\n\n${sample.content.slice(0, 2500)}`;
}

export async function analyzeRoom(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp",
  notes: string
): Promise<StudioResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY mangler i .env.local");
  }

  const client = new Anthropic();
  const catalog = getCatalog().map(({ id, name, retailer, category, tags }) => ({
    id,
    name,
    retailer,
    category,
    tags,
  }));

  const system = `You are the content assistant for SkandinaviskBo (skandinaviskbo.com), an English-language blog about Scandinavian interiors, small apartments, furniture solutions and DIY. Its Pinterest profile is @diyferger.

You analyse a photo of a room and produce:
1. An honest analysis of the room.
2. 3-6 concrete furniture/decor suggestions that would make it more Scandinavian, functional or cosy. Prefer products from the catalog when they genuinely fit (use their exact id); otherwise set productId to null and give a good searchQuery. Never invent catalog ids.
3. A Pinterest pin (English) that would perform well in search.
4. A blog post draft (English, 500-800 words) in the same voice as the existing blog.

Writing rules for the blog post:
- Describe what is actually visible in the photo concretely: materials, colours, placement, light.
- Calm, practical, specific. No hype or templated superlatives ("stunning", "breathtaking", "the ultimate", "game-changer", "stops you dead in your tracks").
- Use ## headings. End with "## Interior tips" as a bullet list with **bold lead-ins**.
- Do not include frontmatter or a product list; those are added automatically.

Product catalog (JSON):
${JSON.stringify(catalog)}

Example of an existing post, for voice and structure:
---
${styleExample()}
---`;

  const response = await client.messages.create({
    model: process.env.STUDIO_MODEL || "claude-sonnet-5-5",
    max_tokens: 8000,
    system,
    tools: [resultTool],
    tool_choice: { type: "tool", name: resultTool.name },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
          {
            type: "text",
            text: notes.trim()
              ? `Notes from Mattis about this room/photo:\n${notes.trim()}`
              : "Analyse this room.",
          },
        ],
      },
    ],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error(`Claude svarte uten strukturert resultat (stop_reason: ${response.stop_reason})`);
  }

  const result = toolUse.input as StudioResult;
  const validIds = new Set(getCatalog().map((p) => p.id));
  result.suggestions = result.suggestions.map((s) => ({
    ...s,
    productId: s.productId && validIds.has(s.productId) ? s.productId : null,
  }));
  result.post.slug = slugify(result.post.slug || result.post.title);
  return result;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 10)
    .join("-");
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

export function buildMarkdown(
  result: StudioResult,
  coverImage: string,
  date: string
): string {
  const catalog = new Map(getCatalog().map((p) => [p.id, p]));
  const shopLines = result.suggestions
    .filter((s) => s.productId && catalog.has(s.productId))
    .map((s) => {
      const p = catalog.get(s.productId!)!;
      return `- **[${p.name}](${productLink(p)})** (${p.retailer}): ${s.why}`;
    });

  const frontmatter = [
    "---",
    `title: ${yamlString(result.post.title)}`,
    `description: ${yamlString(result.post.description)}`,
    `category: ${yamlString(result.post.category)}`,
    `tags: [${result.post.tags.map(yamlString).join(", ")}]`,
    `date: ${yamlString(date)}`,
    `coverImage: '${coverImage}'`,
    `affiliate: ${shopLines.length > 0}`,
    "featured: false",
    "---",
  ].join("\n");

  const shop = shopLines.length
    ? `\n\n## Shop the look\n\n${shopLines.join("\n")}\n\n*Some links may be affiliate links. If you buy through them, SkandinaviskBo may earn a small commission at no extra cost to you.*`
    : "";

  return `${frontmatter}\n\n${result.post.body.trim()}${shop}\n`;
}

export function uniqueSlug(slug: string): string {
  const dir = path.join(process.cwd(), "content/posts");
  let candidate = slug;
  let n = 2;
  while (fs.existsSync(path.join(dir, `${candidate}.md`))) {
    candidate = `${slug}-${n++}`;
  }
  return candidate;
}
