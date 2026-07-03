import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://momentifyapp.com";
  const now = new Date().toISOString();

  const routes = [
    // Core
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/demo", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/pricing", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/what-is-rox", priority: 0.9, changeFrequency: "monthly" as const },

    // Solutions
    { path: "/solutions/trade-shows", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/solutions/technical-recruiting", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/solutions/field-sales", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/solutions/facilities", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/solutions/venues", priority: 0.9, changeFrequency: "monthly" as const },

    // ROX Calculators
    { path: "/rox/trade-shows", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/rox/recruiting", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/rox/field-sales", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/rox/facilities", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/rox/venues", priority: 0.8, changeFrequency: "monthly" as const },

    // Case Studies
    { path: "/case-studies", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/case-studies/mustang-cat", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/case-studies/distributech", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/case-studies/global-dealer-learning", priority: 0.8, changeFrequency: "monthly" as const },

    // Platform
    { path: "/platform/how-it-works", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/platform/integrations", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/platform/security", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
