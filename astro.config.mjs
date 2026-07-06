import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const site = process.env.PUBLIC_SITE_URL ?? "https://atlrwt.github.io";
const base = process.env.PUBLIC_SITE_BASE ?? "/";

export default defineConfig({
  site,
  base,
  output: "static",
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
  integrations: [mdx(), sitemap()],
});
