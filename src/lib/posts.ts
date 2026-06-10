import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostFrontmatter = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  coverImage: string;
  affiliate: boolean;
  featured: boolean;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingTime: string;
};

export const categories = [
  "Scandinavian Style",
  "Small Apartments",
  "Furniture Solutions",
  "Inspiration",
] as const;

function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();

  const posts = slugs.map((fileName) => {
    const slug = fileName.replace(/\.mdx?$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      readingTime: readingTime(content).text,
      ...(data as PostFrontmatter),
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, limit);
}
