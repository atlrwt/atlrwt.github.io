import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv.includes("--publish") ? "publish" : "lint";
const publishTargets = new Set(
  process.argv
    .slice(2)
    .filter((arg) => !arg.startsWith("--"))
    .map((arg) => normalizeRelativePath(path.resolve(root, arg))),
);
const contentDirs = ["src/content/blog", "src/content/projects"];
const allowedCategories = new Set([
  "Blog",
  "Data Analysis",
  "Data Processing",
  "Ops",
  "Reading Notes",
  "Testing",
]);
const placeholderPattern = /\bTODO\b|待补充|待完善/i;

const problems = [];
const warnings = [];

for (const target of publishTargets) {
  if (!existsSync(path.join(root, target))) {
    problems.push(`${target}: publish target not found`);
  }
}

for (const dir of contentDirs) {
  const absoluteDir = path.join(root, dir);
  if (!existsSync(absoluteDir)) continue;
  for (const file of walk(absoluteDir)) {
    if (!/\.(md|mdx)$/.test(file)) continue;
    checkFile(file);
  }
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(`Error: ${problem}`);
  }
  process.exit(1);
}

console.log(`${mode === "publish" ? "Publish check" : "Content lint"} passed.`);

function checkFile(file) {
  const relative = path.relative(root, file);
  const normalizedRelative = normalizeRelativePath(file);
  const raw = readFileSync(file, "utf8");
  const parsed = parseFrontmatter(raw);
  const isPublishTarget = publishTargets.has(normalizedRelative);

  if (!parsed) {
    problems.push(`${relative}: missing YAML frontmatter`);
    return;
  }

  const { data, body } = parsed;
  const required = relative.startsWith("src/content/projects/")
    ? ["title", "description", "publishDate", "tags", "status", "draft"]
    : ["title", "description", "publishDate", "categories", "tags", "draft"];

  for (const field of required) {
    if (!(field in data)) problems.push(`${relative}: missing frontmatter field "${field}"`);
  }

  if (typeof data.title !== "string" || data.title.trim() === "") {
    problems.push(`${relative}: title must be a non-empty string`);
  }

  if (typeof data.description !== "string" || data.description.trim() === "") {
    problems.push(`${relative}: description must be a non-empty string`);
  } else if (data.description.length < 20 || data.description.length > 120) {
    warnings.push(`${relative}: description length should be 20-120 characters`);
  }

  if (!isValidDate(data.publishDate)) {
    problems.push(`${relative}: publishDate is invalid`);
  } else if (new Date(data.publishDate) > nextDay()) {
    problems.push(`${relative}: publishDate is in the future`);
  }

  if ("categories" in data) {
    if (!Array.isArray(data.categories)) {
      problems.push(`${relative}: categories must be an array`);
    } else {
      for (const category of data.categories) {
        if (!allowedCategories.has(category)) {
          problems.push(`${relative}: unknown category "${category}"`);
        }
      }
    }
  }

  if ("tags" in data && !Array.isArray(data.tags)) {
    problems.push(`${relative}: tags must be an array`);
  }

  if (typeof data.draft !== "boolean") {
    problems.push(`${relative}: draft must be true or false`);
  }

  if (mode === "publish" && isPublishTarget && data.draft === true) {
    problems.push(`${relative}: draft is true`);
  }

  if (mode === "publish" && shouldRunPublishOnlyChecks(data, isPublishTarget) && placeholderPattern.test(raw)) {
    problems.push(`${relative}: contains placeholder text`);
  }

  if (body.trim().length === 0) {
    problems.push(`${relative}: body is empty`);
  }

  checkLocalImages(relative, file, body);
  checkInternalLinks(relative, file, body);
  checkAbsoluteLocalPaths(relative, body);
}

function shouldRunPublishOnlyChecks(data, isPublishTarget) {
  return isPublishTarget || data.draft === false;
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return null;
  const end = raw.indexOf("\n---", 4);
  if (end === -1) return null;
  const yaml = raw.slice(4, end);
  const body = raw.slice(end + 4);
  return { data: parseSimpleYaml(yaml), body };
}

function parseSimpleYaml(yaml) {
  const data = {};
  let currentKey = null;

  for (const line of yaml.split("\n")) {
    if (!line.trim()) continue;
    const listItem = line.match(/^\s+-\s*(.*)$/);
    if (listItem && currentKey) {
      data[currentKey].push(parseValue(listItem[1]));
      continue;
    }

    const pair = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!pair) continue;

    const [, key, value] = pair;
    currentKey = key;
    if (value === "") {
      data[key] = [];
    } else {
      data[key] = parseValue(value);
      currentKey = null;
    }
  }

  return data;
}

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "[]") return [];
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    return inner ? inner.split(",").map((item) => parseValue(item.trim())) : [];
  }
  return trimmed.replace(/^["']|["']$/g, "");
}

function checkLocalImages(relative, file, body) {
  for (const match of body.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)) {
    const target = cleanLinkTarget(match[1]);
    if (isExternal(target)) continue;
    const resolved = target.startsWith("/")
      ? path.join(root, "public", target)
      : path.resolve(path.dirname(file), target);
    if (!existsSync(resolved)) {
      problems.push(`${relative}: image not found "${target}"`);
    }
  }
}

function checkInternalLinks(relative, file, body) {
  for (const match of body.matchAll(/(?<!!)\[[^\]]+]\(([^)]+)\)/g)) {
    const target = cleanLinkTarget(match[1]);
    if (!target || isExternal(target) || target.startsWith("#") || target.startsWith("mailto:")) continue;
    if (target.startsWith("/")) continue;

    const resolved = path.resolve(path.dirname(file), target);
    if (!existsSync(resolved)) {
      problems.push(`${relative}: internal link not found "${target}"`);
    }
  }
}

function checkAbsoluteLocalPaths(relative, body) {
  const matches = body.match(/\/Users\/[^\s`)]+|\/private\/[^\s`)]+/g) ?? [];
  for (const match of matches) {
    problems.push(`${relative}: contains local absolute path "${match}"`);
  }
}

function cleanLinkTarget(target) {
  return target.trim().replace(/^<|>$/g, "").split("#")[0].split("?")[0];
}

function isExternal(target) {
  return /^[a-z][a-z0-9+.-]*:/i.test(target);
}

function isValidDate(value) {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

function nextDay() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) {
      files.push(...walk(file));
    } else {
      files.push(file);
    }
  }
  return files;
}

function normalizeRelativePath(file) {
  return path.relative(root, file).split(path.sep).join("/");
}
