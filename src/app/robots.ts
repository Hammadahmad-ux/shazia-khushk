import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/cart", "/checkout", "/order-confirmation"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
