import type { MetadataRoute } from "next";
import { navigation, seoServiceDetails } from "@/data/site-data";
import { siteUrl } from "@/lib/site-meta";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = Array.from(new Set([
    ...navigation.map(([path]) => path),
    ...Object.keys(seoServiceDetails).map((slug) => `/${slug}`),
  ]));

  return paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/contact" ? 0.8 : 0.7,
  }));
}
