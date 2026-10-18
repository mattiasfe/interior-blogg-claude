import { MetadataRoute } from "next";

const siteUrl = "https://skandinaviskbo.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/konto", "/logg-inn", "/registrer"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
