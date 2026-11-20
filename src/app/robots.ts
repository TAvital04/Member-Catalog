import { MetadataRoute } from "next";

/**
 * @file robots.ts — Anti-Scraping & Search Engine Directives
 * @description Protects candidate catalog queries, recruiter endpoints, and private boards from
 * automated scraping, web crawlers, and AI data harvesters.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/projects", "/events", "/u/"],
        disallow: [
          "/api/",
          "/jobs",
          "/sponsors",
          "/*?*member=*",
          "/*?*search=*",
          "/*?*q=*",
          "/*?*skills=*",
          "/*?*majors=*",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "Bytespider",
          "Google-Extended",
          "PerplexityBot",
        ],
        disallow: ["/"],
      },
    ],
  };
}
