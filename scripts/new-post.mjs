import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "src/content/blog");

const args = process.argv.slice(2);
const title = args.find((arg) => !arg.startsWith("--"));
const slugArg = readOption(args, "--slug");
const templateArg = readOption(args, "--template") ?? "technical-concept";

if (!title) {
  fail('Usage: npm run new:post -- "Post title" [-- --slug custom-slug] [-- --template technical-concept]');
}

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const slug = slugify(slugArg ?? title) || "post";
const filePath = nextAvailablePath(path.join(postsDir, `${today}-${slug}.mdx`));
const templatePath = path.join(root, "templates/posts", `${templateArg}.md`);

if (!existsSync(templatePath)) {
  fail(`Template not found: templates/posts/${templateArg}.md`);
}

mkdirSync(postsDir, { recursive: true });

const template = readFileSync(templatePath, "utf8");
const templateBody = template.replace(/^---\n[\s\S]*?\n---\n?/, "").trimStart();
const content = `---\ntitle: "${escapeYaml(title)}"\ndescription: ""\npublishDate: ${today}\ncategories: []\ntags: []\ndraft: true\n---\n\n${templateBody}`;

writeFileSync(filePath, content, "utf8");
console.log(path.relative(root, filePath));

function readOption(values, name) {
  const index = values.indexOf(name);
  if (index === -1) return undefined;
  return values[index + 1];
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function nextAvailablePath(initialPath) {
  if (!existsSync(initialPath)) return initialPath;
  const parsed = path.parse(initialPath);
  for (let index = 2; ; index += 1) {
    const candidate = path.join(parsed.dir, `${parsed.name}-${index}${parsed.ext}`);
    if (!existsSync(candidate)) return candidate;
  }
}

function escapeYaml(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
