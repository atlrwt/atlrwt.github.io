import rss from "@astrojs/rss";
import { siteConfig } from "../config/site";
import { getBlogPosts } from "../lib/content";
import { withBase } from "../lib/url";

export async function GET(context: { site: URL }) {
  const posts = await getBlogPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: withBase(`/blog/${post.id}/`),
      categories: post.data.tags,
    })),
  });
}
