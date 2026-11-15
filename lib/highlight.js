// Syntax highlighting for Pooka and its BEAM neighbours, run at build time.
// Each language is a list of rules (a regular expression and a token kind);
// the first rule that matches wins. Words are then sorted into keywords,
// types, variables, atoms and function names.

function words(list) {
  return new Set(list.split(" "));
}

var LANGUAGES = {
  pooka: {
    rules: [
      [/\/\/.*/, "comment"],
      [/"(?:[^"\\]|\\.)*"/, "string"],
      [/\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?\b/, "number"],
      [/[A-Za-z_][A-Za-z0-9_]*/, "word"],
      [/->|\|>|\.\.|[{}()\[\],:#?=<>+\-*\/!|.]/, "punct"]
    ],
    keywords: words("module import class enum interface actor external from is with be var let new self super match if fn loop in test assert as panic todo echo True False Nil skip"),
    capitals: "type"
  },
  erlang: {
    rules: [
      [/%.*/, "comment"],
      [/"(?:[^"\\]|\\.)*"/, "string"],
      [/'(?:[^'\\]|\\.)*'/, "atom"],
      [/\$\\?./, "string"],
      [/\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/, "number"],
      [/[A-Za-z_][A-Za-z0-9_@]*/, "word"],
      [/->|<<|>>|=:=|=\/=|::|[{}()\[\],:;.=<>+\-*\/|#]/, "punct"]
    ],
    keywords: words("fun end case of when receive after if begin try catch throw and andalso or orelse not div rem band bor bxor bnot bsl bsr"),
    capitals: "variable",
    lowercase: "atom"
  },
  elixir: {
    rules: [
      [/#.*/, "comment"],
      [/"(?:[^"\\]|\\.)*"/, "string"],
      [/:"(?:[^"\\]|\\.)*"/, "atom"],
      [/:[a-z_][A-Za-z0-9_]*[?!]?/, "atom"],
      [/\b\d[\d_]*(?:\.\d+)?\b/, "number"],
      [/[A-Za-z_][A-Za-z0-9_]*[?!]?/, "word"],
      [/->|\|>|<-|=>|[{}()\[\],:.=<>+\-*\/|%]/, "punct"]
    ],
    keywords: words("def defp defmodule defstruct defmacro do end fn if else unless case cond with when for import alias require use true false nil and or not in"),
    capitals: "type"
  },
  gleam: {
    rules: [
      [/\/\/.*/, "comment"],
      [/"(?:[^"\\]|\\.)*"/, "string"],
      [/@[a-z_]+/, "keyword"],
      [/\b\d[\d_]*(?:\.\d+)?\b/, "number"],
      [/[A-Za-z_][A-Za-z0-9_]*/, "word"],
      [/->|\|>|<-|\.\.|[{}()\[\],:.=<>+\-*\/|#]/, "punct"]
    ],
    keywords: words("pub fn let assert case type opaque import const use if as todo panic echo True False Nil"),
    capitals: "type"
  },
  lfe: {
    rules: [
      [/;.*/, "comment"],
      [/#?"(?:[^"\\]|\\.)*"/, "string"],
      [/'[^\s()]+/, "atom"],
      [/\b\d+(?:\.\d+)?\b/, "number"],
      [/[^\s()'"#;]+/, "word"],
      [/[()#]/, "punct"]
    ],
    keywords: words("let let* defun defmodule defmacro lambda match-lambda case if cond receive call funcall progn quote fun"),
    capitals: null
  }
};
LANGUAGES.erl = LANGUAGES.erlang;
LANGUAGES.ex = LANGUAGES.elixir;
LANGUAGES.exs = LANGUAGES.elixir;
LANGUAGES.lisp = LANGUAGES.lfe;

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function wrap(kind, text) {
  return kind ? '<span class="tok-' + kind + '">' + escapeHtml(text) + "</span>" : escapeHtml(text);
}

function highlight(source, name) {
  var language = LANGUAGES[name || "pooka"];
  if (!language) return escapeHtml(source);
  var pattern = new RegExp(language.rules.map(function (rule) {
    return "(" + rule[0].source + ")";
  }).join("|"), "g");
  var out = "";
  var last = 0;
  var match;
  while ((match = pattern.exec(source))) {
    if (match[0] === "") {
      pattern.lastIndex += 1;
      continue;
    }
    out += escapeHtml(source.slice(last, match.index));
    var index = 1;
    while (match[index] === undefined) index += 1;
    var kind = language.rules[index - 1][1];
    var text = match[0];
    if (kind === "word") {
      var next = source.charAt(pattern.lastIndex);
      var before = source.charAt(match.index - 1);
      if (language.keywords.has(text)) kind = "keyword";
      else if (name === "lfe" || name === "lisp") kind = before === "(" ? "function" : "";
      else if (next === "(" || before === ":" && next === "(") kind = "function";
      else if (/^[A-Z]/.test(text)) kind = language.capitals || "";
      else kind = language.lowercase || "";
    }
    out += wrap(kind, text);
    last = pattern.lastIndex;
  }
  return out + escapeHtml(source.slice(last));
}

export const languages = Object.keys(LANGUAGES);

export { escapeHtml, highlight };
