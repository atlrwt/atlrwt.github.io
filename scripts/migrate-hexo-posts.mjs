import fs from "node:fs";
import path from "node:path";

const sourceDir = "hexo/Blog/source/_posts";
const blogDir = "src/content/blog";
const imageDir = "public/images/blog";

const descriptions = {
  "A-Brief-Analysis-of-Linux-Scheduled-Task-Scheduling":
    "梳理 Linux crontab 的基本命令、时间表达式和周期性任务调度的核心用法。",
  "A-Deep-Dive-into-the-df-Command-Output":
    "围绕 df -hT 的实际输出解释 Linux 文件系统、挂载点和 LVM 存储结构。",
  "ClashX-Proxy-Port-0-Solution":
    "记录 ClashX 升级或重装后代理端口变为 0 时，通过手动配置端口恢复代理的方法。",
  "Docker-Offline-Upgrade":
    "说明在内网生产环境中通过静态二进制包离线升级 Docker 的完整操作流程。",
  "Guide-to-Offline-Installation-of-Python-Third-Party-Libraries":
    "演示如何在外网环境下载 Python 依赖包，并在内网服务器离线安装第三方库。",
  "Hexo-Migration":
    "记录将 Hexo 博客迁移到新服务器时需要完成的 Node.js、Git、Hexo 安装和文件迁移步骤。",
  "Install-Python-on-Linux-via-Source-Tarball":
    "讲解在 Linux 上通过源码编译安装 Python，并清理手动安装版本的操作方法。",
  "Personal-Blog-From-Scrach-Hexo-X-GitHub":
    "复盘从零使用 Hexo 和 GitHub Pages 搭建免费个人博客的环境准备、配置和发布流程。",
  "Python-Colorful-Print":
    "介绍如何使用 ANSI 转义序列和 colorama 在 Python 终端输出彩色文本。",
  "Python-unittest-from-beginning":
    "从测试用例、测试套件到断言方法，系统整理 Python unittest 模块的基础用法。",
  "Reading-Note-of-The-Almanack-of-Naval-part-I":
    "整理《纳瓦尔宝典》财富篇中关于产品化自己、杠杆、判断力和长期复利的阅读笔记。",
  "Reading-Note-of-The-Almanack-of-Naval-part-II":
    "整理《纳瓦尔宝典》幸福篇中关于平和、习惯、自我塑造和人生哲学的阅读笔记。",
  "SQL-Server-Data-Analysis-Easily-Calculate-Month-over-Month-Sales-Growth":
    "通过 SQL Server 窗口函数示例说明如何计算销售数据的月环比增长率。",
  "SQLServer-String-Manipulating":
    "汇总 SQL Server 中常见字符串截取、定位和组合函数的使用方式。",
  "SQLServer-Table-Columns-Query":
    "整理 SQL Server 查询表结构、字段信息和元数据的常用 SQL 写法。",
  "SQlServer-Usage-Of-DATEADD-DATEDIFF":
    "说明如何结合 DATEADD 和 DATEDIFF 获取 SQL Server 中某月月初与月末日期。",
  "Solution-on-Hexo-EACCES-Error":
    "记录 macOS 安装 Hexo 遇到 npm EACCES 权限错误时的推荐修复方案。",
  "blog-writing-guideline":
    "沉淀本站写作规范，覆盖文章结构、语言风格、排版细节和技术文档表达要求。",
  "common-git-commands":
    "按配置、提交、远程、分支和排查场景整理常用 Git 命令速查表。",
  "curl-command-usage":
    "整理 curl 在接口访问、请求参数、文件下载和调试中的常见用法。",
  "excel-doesnot-recognize-the-data-until-double-click":
    "记录 Excel 日期格式修改后仍需双击才生效的问题原因和批量处理办法。",
  "jupyter-magic-command":
    "系统说明 Jupyter Notebook 中系统命令、行魔法和单元格魔法的使用方式。",
  "macOS-terminal-proxy":
    "说明如何为 macOS 终端配置 HTTP 和 SOCKS5 代理，让命令行流量走代理。",
  nps: "介绍净推荐值 NPS 的计算方法、结果解读和在用户满意度评估中的使用边界。",
  "openssl-x509":
    "说明如何使用 openssl x509 命令查看 Linux SSL 证书的有效期信息。",
  "pathlib-vs-os":
    "对比 Python pathlib 和 os 模块在文件路径处理中的写法、优势和适用场景。",
  "python-json-module":
    "梳理 Python json 模块的序列化、反序列化、自定义对象处理和常见参数用法。",
  "regular-expression-cheatsheet":
    "整理常用正则表达式元字符、匹配规则和示例，作为快速查询参考。",
  "sql-coalesce":
    "说明 SQL 中 COALESCE 函数的空值处理逻辑、典型用法和注意事项。",
  "sql-collect-list":
    "介绍 Spark SQL 中 COLLECT_LIST 函数的聚合行为、排序处理和常见使用限制。",
  "sql-collect-set":
    "介绍 Spark SQL 中 COLLECT_SET 函数的去重聚合行为、排序问题和使用注意点。",
  "sql-distinct":
    "系统说明 DISTINCT 的去重逻辑、多列组合去重和在 SQL 查询中的常见误区。",
  "sql-query-order-of-execution":
    "对比 SQL 语句书写顺序和实际执行顺序，帮助理解查询结果的生成过程。",
  "sql-row-number":
    "说明 ROW_NUMBER 窗口函数的排序编号逻辑、分组用法和典型分析场景。",
  "string-replacement-in-vim":
    "整理 Vim 中 substitute 命令的字符串替换范围、模式匹配和常见替换技巧。",
  vimdiff:
    "介绍如何使用 vimdiff 查看文件差异，并通过 do、dp 等命令完成差异合并。",
};

const tagNames = new Map([
  ["docker", "Docker"],
  ["excel", "Excel"],
  ["git", "Git"],
  ["github", "GitHub"],
  ["hexo", "Hexo"],
  ["linux", "Linux"],
  ["other", "Other"],
  ["others", "Other"],
  ["python", "Python"],
  ["sql", "SQL"],
  ["vim", "Vim"],
  ["vpn", "VPN"],
  ["writing", "Writing"],
]);

function parseFrontmatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) {
    throw new Error("Missing frontmatter");
  }

  return {
    data: parseSimpleYaml(match[1]),
    body: source.slice(match[0].length),
  };
}

function parseSimpleYaml(yaml) {
  const data = {};
  const lines = yaml.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const pair = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!pair) {
      continue;
    }

    const key = pair[1];
    const rawValue = pair[2].trim();

    if (rawValue) {
      data[key] = unquote(rawValue);
      continue;
    }

    const values = [];
    while (index + 1 < lines.length) {
      const nextLine = lines[index + 1];
      const item = nextLine.match(/^\s*-\s*(.*)$/);
      if (!item) {
        break;
      }
      values.push(unquote(item[1].trim()));
      index += 1;
    }
    data[key] = values;
  }

  return data;
}

function unquote(value) {
  return value.replace(/^["']|["']$/g, "");
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return value ? [value] : [];
}

function normalizeTags(tags) {
  return tags.map((tag) => tagNames.get(tag.toLowerCase()) ?? tag);
}

function toPublishDate(date) {
  return `${date.replace(" ", "T")}+08:00`;
}

function yamlString(value) {
  return JSON.stringify(value);
}

function yamlArray(key, values) {
  if (values.length === 0) {
    return `${key}: []`;
  }
  return [`${key}:`, ...values.map((value) => `  - ${yamlString(value)}`)].join(
    "\n",
  );
}

function findAssetFolder(slug) {
  const exact = path.join(sourceDir, slug);
  if (fs.existsSync(exact)) {
    return exact;
  }

  const lowerSlug = slug.toLowerCase();
  return fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(sourceDir, entry.name))
    .find((folderPath) => path.basename(folderPath).toLowerCase() === lowerSlug);
}

function copyAsset(slug, filename) {
  const assetFolder = findAssetFolder(slug);
  if (!assetFolder) {
    throw new Error(`Missing asset folder for ${slug}: ${filename}`);
  }

  const sourcePath = path.join(assetFolder, filename);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing asset ${sourcePath}`);
  }

  const targetFolder = path.join(imageDir, slug);
  fs.mkdirSync(targetFolder, { recursive: true });
  fs.copyFileSync(sourcePath, path.join(targetFolder, filename));
}

function isLocalAsset(src) {
  return (
    /\.(png|jpe?g|gif|webp|svg)$/i.test(src) &&
    !src.startsWith("/") &&
    !/^https?:\/\//i.test(src)
  );
}

function rewriteImages(body, slug, copiedAssets) {
  let rewritten = body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    const cleanSrc = src.trim();
    if (!isLocalAsset(cleanSrc)) {
      return match;
    }
    const filename = path.basename(cleanSrc);
    copiedAssets.add(filename);
    return `![${alt}](/images/blog/${slug}/${filename})`;
  });

  rewritten = rewritten.replace(
    /<img([^>]*?)\s+src=["']([^"']+)["']([^>]*)>/g,
    (match, before, src, after) => {
      const cleanSrc = src.trim();
      if (!isLocalAsset(cleanSrc)) {
        return match;
      }
      const filename = path.basename(cleanSrc);
      copiedAssets.add(filename);
      return `<img${before} src="/images/blog/${slug}/${filename}"${after}>`;
    },
  );

  return rewritten;
}

function rewritePostLinks(body) {
  return body.replace(
    /\{%\s*post_link\s+([^\s]+)\s+([^%]+?)\s*%\}/g,
    (_match, slug, label) => `[${label.trim()}](/blog/${slug.toLowerCase()}/)`,
  );
}

function rewriteBody(body, slug) {
  const copiedAssets = new Set();
  let rewritten = body.replace(/<!--\s*more\s*-->/gi, "");
  if (slug === "nps") {
    rewritten = rewritten.replace(
      "**NPS（Net Promoter Score，净推荐值）**",
      "<strong>NPS（Net Promoter Score，净推荐值）</strong>",
    );
  }
  rewritten = rewritePostLinks(rewritten);
  rewritten = rewriteImages(rewritten, slug, copiedAssets);

  for (const filename of copiedAssets) {
    copyAsset(slug, filename);
  }

  return rewritten.trimStart();
}

function buildPost(slug, data, body) {
  const description = descriptions[slug];
  if (!description) {
    throw new Error(`Missing description for ${slug}`);
  }

  const categories = toArray(data.categories);
  const tags = normalizeTags(toArray(data.tags));
  const lines = [
    "---",
    `title: ${yamlString(data.title)}`,
    `description: ${yamlString(description)}`,
    `publishDate: ${yamlString(toPublishDate(data.date))}`,
    yamlArray("categories", categories),
    yamlArray("tags", tags),
    "draft: false",
    "---",
    "",
    body,
  ];

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

fs.mkdirSync(blogDir, { recursive: true });
fs.mkdirSync(imageDir, { recursive: true });

for (const file of fs.readdirSync(sourceDir).sort()) {
  if (!file.endsWith(".md")) {
    continue;
  }

  const slug = path.basename(file, ".md");
  const source = fs.readFileSync(path.join(sourceDir, file), "utf8");
  const { data, body } = parseFrontmatter(source);
  const rewrittenBody = rewriteBody(body, slug);
  const target = buildPost(slug, data, rewrittenBody);

  fs.writeFileSync(path.join(blogDir, `${slug}.md`), target);
}
