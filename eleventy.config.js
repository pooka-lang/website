import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { slug } from "github-slugger";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

import { escapeHtml, highlight, languages } from "./lib/highlight.js";
import { isTerminal, isTree, terminal, tree } from "./lib/terminal.js";

/** A fenced code block, coloured at build time. */
function codeBlock(source, lang = "") {
  const code = source.replace(/\n$/, "");
  if (lang === "text" || lang === "") {
    if (isTerminal(code)) return `<pre class="code terminal-output"><code>${terminal(code)}</code></pre>\n`;
    if (isTree(code)) return `<pre class="code file-tree"><code>${tree(code)}</code></pre>\n`;
  }
  const body = languages.includes(lang) ? highlight(code, lang) : escapeHtml(code);
  const attrs = lang ? ` data-lang="${lang}"` : "";
  const cls = lang ? ` class="language-${lang}"` : "";
  return `<pre class="code"${attrs}><code${cls}>${body}</code></pre>\n`;
}

const stripTags = (html = "") => html.replace(/<[^>]+>/g, "");

export default function (eleventyConfig) {
  // --- Markdown ------------------------------------------------------------
  const md = markdownIt({ html: true, typographer: false, highlight: codeBlock });
  // GitHub-style heading ids, so links such as #1-install-erlang keep working.
  md.use(markdownItAnchor, { slugify: (s) => slug(s), tabIndex: false });
  md.renderer.rules.table_open = () => '<div class="table-wrap"><table>\n';
  md.renderer.rules.table_close = () => "</table></div>\n";
  eleventyConfig.setLibrary("md", md);

  // --- Files copied as they are ------------------------------------------------
  for (const path of ["src/assets", "src/css", "src/js", "src/install.sh", "src/CNAME"]) {
    eleventyConfig.addPassthroughCopy(path);
  }

  // --- Shortcodes ----------------------------------------------------------------
  // {% sample "words" %} reads src/samples/words.pooka; a sample with several
  // files is a folder: {% sample "first-test", "test/kettle.spec.pooka" %}.
  eleventyConfig.addShortcode("sample", (name, file) => {
    const path = file ? `src/samples/${name}/${file}` : `src/samples/${name}.pooka`;
    return highlight(readFileSync(path, "utf8").replace(/\n$/, ""), "pooka");
  });
  // {% terminal %}…{% endterminal %}: CLI output, coloured like the CLI.
  eleventyConfig.addPairedShortcode("terminal", (content) =>
    terminal(content.replace(/^\n/, "").replace(/\n\s*$/, ""))
  );

  // {{ "/js/site.js" | asset }} adds a stamp of the file's content, so a
  // browser never keeps running an old script or stylesheet after a change.
  eleventyConfig.addFilter("asset", (path) => {
    const hash = createHash("sha256").update(readFileSync(`src${path}`)).digest("hex").slice(0, 10);
    return `${path}?v=${hash}`;
  });

  // --- Filters -----------------------------------------------------------------
  eleventyConfig.addFilter("inlineCode", (text = "") =>
    escapeHtml(text).replace(/`([^`]+)`/g, "<code>$1</code>")
  );
  eleventyConfig.addFilter("stripTags", stripTags);
  eleventyConfig.addFilter("longDate", (date) =>
    new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("shortDate", (date) =>
    new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));
  // Second-level headings of rendered content, for "On this page".
  eleventyConfig.addFilter("outline", (html = "") =>
    [...html.matchAll(/<h2 id="([^"]+)"[^>]*>(.*?)<\/h2>/g)].map(([, id, text]) => ({ id, text: stripTags(text) }))
  );
  // The tour: "Chapter 1: The front door" becomes a label and a title.
  eleventyConfig.addFilter("chapters", (html = "") =>
    [...html.matchAll(/<h2 id="([^"]+)"[^>]*>(.*?)<\/h2>/g)].map(([, id, text]) => {
      const found = /^Chapter (\d+): (.*)$/.exec(stripTags(text));
      return { id, number: found ? found[1] : "✦", title: found ? found[2] : stripTags(text) };
    })
  );
  eleventyConfig.addFilter("chapterHeadings", (html = "") =>
    html.replace(/<h2 id="([^"]+)"([^>]*)>Chapter (\d+): (.*?)<\/h2>/g,
      '<h2 id="$1"$2><span class="chapter-num">Chapter $3</span>$4</h2>')
  );
  eleventyConfig.addFilter("groupBy", (items = [], key) => {
    const groups = new Map();
    for (const item of items) {
      const value = item.data ? item.data[key] : item[key];
      if (!groups.has(value)) groups.set(value, []);
      groups.get(value).push(item);
    }
    return [...groups].map(([name, entries]) => ({ name, entries }));
  });

  // The docs menu: guides from src/docs, plus pages that live elsewhere (the
  // tour, the cookbook), grouped and ordered as _data/docs.json says.
  eleventyConfig.addFilter("docsMenu", (guides = [], docs) => {
    const entries = [
      ...guides.map((g) => ({ title: g.data.navTitle || g.data.title, url: g.url, group: g.data.group, order: g.data.order, summary: g.data.summary })),
      ...docs.outside
    ];
    return docs.groups.map((name) => ({
      name,
      entries: entries.filter((e) => e.group === name).sort((a, b) => a.order - b.order)
    }));
  });
  // Previous and next guide, skipping pages outside docs/.
  eleventyConfig.addFilter("neighbours", (guides = [], url) => {
    const index = guides.findIndex((g) => g.url === url);
    return { previous: guides[index - 1], next: guides[index + 1] };
  });

  // Items whose front matter `key` equals `value`.
  eleventyConfig.addFilter("where", (items = [], key, value) => items.filter((item) => item.data[key] === value));
  // The distinct values of a front-matter field, in first-seen order.
  eleventyConfig.addFilter("distinct", (items = [], key) => [...new Set(items.map((item) => item.data[key]))]);

  // --- Collections -------------------------------------------------------------
  // Oldest first, as Eleventy and the RSS plugin expect; pages reverse it.
  const published = (item) => !item.data.draft;
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/news/*.md").filter(published).sort((a, b) => a.date - b.date)
  );
  eleventyConfig.addCollection("recipes", (api) =>
    api.getFilteredByGlob("src/cookbook/*.md").sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  );
  eleventyConfig.addCollection("guides", (api) =>
    api.getFilteredByGlob("src/docs/*.md").sort((a, b) => a.data.order - b.data.order)
  );

  // --- RSS ---------------------------------------------------------------------
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/feed.xml",
    collection: { name: "posts", limit: 20 },
    metadata: {
      language: "en",
      title: "Pooka news",
      subtitle: "Releases, guides and stories from the Pooka community.",
      base: "https://pooka.run/",
      author: { name: "The Pooka team" }
    }
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    // Markdown is only Markdown: Pooka code is full of braces and `{#`.
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md"]
  };
}
