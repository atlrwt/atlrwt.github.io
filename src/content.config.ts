import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const shared = {
  title: z.string(),
  description: z.string(),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
};

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    ...shared,
    series: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    ...shared,
    status: z.enum(["active", "paused", "archived"]).default("active"),
    repoUrl: z.url().optional(),
    demoUrl: z.url().optional(),
  }),
});

export const collections = { blog, projects };

