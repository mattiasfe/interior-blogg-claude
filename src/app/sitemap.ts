import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const siteUrl = "https://www.skandinaviskbo.no";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/blogg", "/om-meg", "/samarbeid", "/kontakt"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${siteUrl}/blogg/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...postRoutes];
}
