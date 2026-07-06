import { getCollection } from "astro:content";

export function isPublished(data: { draft?: boolean }) {
  return import.meta.env.PROD ? data.draft !== true : true;
}

export async function getBlogPosts() {
  const posts = await getCollection("blog", ({ data }) => isPublished(data));
  return posts.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}

export async function getProjects() {
  const projects = await getCollection("projects", ({ data }) =>
    isPublished(data),
  );
  return projects.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}

export function getAllTags<T extends { data: { tags: string[] } }>(
  entries: T[],
) {
  return Array.from(new Set(entries.flatMap((entry) => entry.data.tags))).sort();
}

export function getAllCategories<T extends { data: { categories: string[] } }>(
  entries: T[],
) {
  return Array.from(
    new Set(entries.flatMap((entry) => entry.data.categories)),
  ).sort();
}

export function tagToSlug(tag: string) {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

export const categoryToSlug = tagToSlug;
