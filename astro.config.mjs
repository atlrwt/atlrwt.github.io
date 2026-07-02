import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_URL ?? "https://atlrwt.github.io";
const base = process.env.PUBLIC_SITE_BASE ?? "/";

export default defineConfig({
  site,
  base,
  output: "static",
  integrations: [mdx(), sitemap()],
});
