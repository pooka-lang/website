// Terminal output and file trees, coloured the way the `pooka` CLI colours
// them. The colours were read from real output with FORCE_COLOR=1:
//
//   label   Running, Compiled, Finished, •, module names   Lantern Orange
//   pass    ✓, "N passed"                                  green
//   fail    ✗, "N failed", `got` values, error labels       Scarf
//   msg     assertion failed, panic, warning, help         Amber Glow
//   dim     expected/got, locations, durations             grey
//   violet  expected values, diagnostic gutters             Magic Violet
//
// Lines that match no rule are left plain, as the CLI leaves them.

import { escapeHtml as e } from "./highlight.js";

const LABELS =
  "Downloading|Downloaded|Compiling|Compiled|Running|Checking|Checked|Finished|" +
  "Formatted|Exported|Publishing|Published|Added|Removed|Updated|Generated|Cleaned";
const LABEL_LINE = new RegExp(`^(\\s*)(${LABELS})\\b(.*)$`);
const LOCATION = /^(\s*)(\S+\.pooka:\d+)$/;
const SUMMARY = /^(\s*)(\d+ tests?)((?:, \d+ \w+)*)$/;
const DIAGNOSTIC = /^(error|warning)(: .*)$/;
const TREE_LINE = /^(\s*)(\.\.\.|[\w.@\-/]+)(\s{2,}\S.*)?$/;

const span = (kind, text) => (text ? `<span class="t-${kind}">${e(text)}</span>` : "");

export function isTerminal(text) {
  return text.split("\n").some(
    (line) =>
      LABEL_LINE.test(line) ||
      DIAGNOSTIC.test(line) ||
      SUMMARY.test(line) ||
      /^\s*[✓✗•] /.test(line) ||
      line.startsWith("$ ")
  );
}

export function terminal(text) {
  let severity = "fail";
  return text
    .split("\n")
    .map((line) => {
      let m;
      if (line.startsWith("$ ")) return `<span class="cmd">${e(line.slice(2))}</span>`;
      if ((m = LABEL_LINE.exec(line))) {
        const [, indent, label, rest] = m;
        if (label === "Finished") {
          const d = /^(.*\bin )(\S+)$/.exec(rest);
          if (d) return e(indent) + span("label", label) + e(d[1]) + span("dim", d[2]);
        }
        return e(indent) + span("label", label) + e(rest);
      }
      if ((m = /^(\s*)•( test module: )(.*)$/.exec(line)))
        return e(m[1]) + span("label", "•") + e(m[2]) + span("label", m[3]);
      if ((m = /^(\s*)✓(.*)$/.exec(line))) return e(m[1]) + span("pass", "✓") + e(m[2]);
      if ((m = /^(\s*)✗(.*)$/.exec(line))) return e(m[1]) + span("fail", "✗") + e(m[2]);
      if ((m = /^(\s*)-( .*\(skipped\))$/.exec(line)))
        return e(m[1]) + span("label", "-") + span("dim", m[2]);
      if ((m = /^(\s*)((?:assertion failed|panic|todo)\b.*)$/.exec(line)))
        return e(m[1]) + span("msg", m[2]);
      if ((m = /^(\s*)(expected) (.*)$/.exec(line)))
        return e(m[1]) + span("dim", m[2]) + " " + span("violet", m[3]);
      if ((m = /^(\s*)(got) (.*)$/.exec(line)))
        return e(m[1]) + span("dim", m[2]) + " " + span("fail", m[3]);
      if ((m = LOCATION.exec(line))) return e(m[1]) + span("dim", m[2]);
      if ((m = SUMMARY.exec(line))) {
        const kinds = { passed: "pass", failed: "fail", skipped: "label" };
        const parts = (m[3].match(/\d+ \w+/g) || []).map((part) => {
          const kind = kinds[part.split(" ").pop()];
          return kind ? span(kind, part) : e(part);
        });
        return e(m[1]) + e(m[2]) + parts.map((part) => ", " + part).join("");
      }
      if ((m = DIAGNOSTIC.exec(line))) {
        severity = m[1] === "error" ? "fail" : "msg";
        return span(severity, m[1]) + span("bold", m[2]);
      }
      if ((m = /^(\s*)(╭─)( .*)$/.exec(line)))
        return e(m[1]) + span("violet", m[2]) + " " + span("msg", m[3].slice(1));
      if ((m = /^(\s*\d* ?)(│)(.*)$/.exec(line))) {
        const gutter = m[1] + m[2];
        const marks = m[1].trim() ? null : /^(\s*)([─┬╰│ ]*[─┬╰].*)$/.exec(m[3]);
        return marks
          ? span("violet", gutter) + e(marks[1]) + span(severity, marks[2])
          : span("violet", gutter) + e(m[3]);
      }
      if ((m = /^(\s*)(╰─)$/.exec(line))) return e(m[1]) + span("violet", m[2]);
      if ((m = /^(help:)(.*)$/.exec(line))) return span("msg", m[1]) + e(m[2]);
      if (/^Found \d+ (error|warning)/.test(line)) return span("bold", line);
      return e(line);
    })
    .join("\n");
}

// File trees: folders in Amber Glow, notes beside a file in grey.
export function isTree(text) {
  const lines = text.split("\n").filter((line) => line.trim());
  return (
    lines.length > 0 &&
    lines.every((line) => TREE_LINE.test(line)) &&
    lines.some((line) => line.includes("/"))
  );
}

export function tree(text) {
  return text
    .split("\n")
    .map((line) => {
      const m = TREE_LINE.exec(line);
      if (!m) return e(line);
      const [, indent, name, note = ""] = m;
      let shown;
      if (name === "...") shown = span("dim", name);
      else if (name.endsWith("/")) shown = span("dir", name);
      else {
        const cut = name.lastIndexOf("/");
        shown = cut >= 0 ? span("dir", name.slice(0, cut + 1)) + e(name.slice(cut + 1)) : e(name);
      }
      const gap = note.slice(0, note.length - note.trimStart().length);
      return e(indent) + shown + e(gap) + span("dim", note.trim());
    })
    .join("\n");
}
