import { MetadataRoute } from "next";

const siteUrl = "https://www.skandinaviskbo.no";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
