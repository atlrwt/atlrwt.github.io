const site = normalizeSite(process.env.PUBLIC_SITE_URL ?? "https://atlrwt.github.io/");

const urls = [
  "/",
  "/blog/",
  "/projects/",
  "/about/",
  "/rss.xml",
  "/sitemap-index.xml",
  "/sitemap-0.xml",
  "/blog/sql-distinct/",
  "/blog/nps/",
  "/blog/personal-blog-from-scrach-hexo-x-github/",
  "/images/blog/Personal-Blog-From-Scrach-Hexo-X-GitHub/Configuration.png",
];

const htmlChecks = [
  {
    path: "/blog/sql-distinct/",
    patterns: ["<table", "canonical", "og:url", "description"],
  },
  {
    path: "/blog/nps/",
    patterns: ["katex", "canonical", "og:url", "description"],
  },
  {
    path: "/blog/personal-blog-from-scrach-hexo-x-github/",
    patterns: ["/images/blog/Personal-Blog-From-Scrach-Hexo-X-GitHub/", "canonical"],
  },
];

const sensitivePattern = /43\.167\.247\.180|password=123|\/Users\/|github_pat_|ghp_|sk-[A-Za-z0-9]|BEGIN (RSA|OPENSSH|PRIVATE) KEY/i;
const problems = [];

for (const path of urls) {
  await checkUrl(path);
}

for (const check of htmlChecks) {
  await checkHtml(check.path, check.patterns);
}

await checkXml("/rss.xml", ["https://atlrwt.github.io/", "<item"]);
await checkXml("/sitemap-0.xml", ["https://atlrwt.github.io/blog/"]);

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(`Error: ${problem}`);
  }
  process.exit(1);
}

console.log(`Deploy check passed: ${site}`);

async function checkUrl(path) {
  const response = await fetchUrl(path, { method: "HEAD" });
  if (!response.ok) {
    problems.push(`${path}: expected HTTP 200, got ${response.status}`);
  }
}

async function checkHtml(path, patterns) {
  const response = await fetchUrl(path);
  const body = await response.text();

  if (!response.ok) {
    problems.push(`${path}: expected HTTP 200, got ${response.status}`);
    return;
  }

  for (const pattern of patterns) {
    if (!body.includes(pattern)) {
      problems.push(`${path}: missing "${pattern}"`);
    }
  }

  if (sensitivePattern.test(body)) {
    problems.push(`${path}: contains sensitive-looking content`);
  }
}

async function checkXml(path, patterns) {
  const response = await fetchUrl(path);
  const body = await response.text();

  if (!response.ok) {
    problems.push(`${path}: expected HTTP 200, got ${response.status}`);
    return;
  }

  for (const pattern of patterns) {
    if (!body.includes(pattern)) {
      problems.push(`${path}: missing "${pattern}"`);
    }
  }

  if (/localhost|127\.0\.0\.1|\/Users\//.test(body)) {
    problems.push(`${path}: contains local URL or path`);
  }
}

async function fetchUrl(path, options = {}) {
  const url = new URL(path, site);
  try {
    return await fetch(url, {
      redirect: "follow",
      ...options,
    });
  } catch (error) {
    problems.push(`${path}: request failed: ${error.message}`);
    return new Response("", { status: 599 });
  }
}

function normalizeSite(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
