---
title = "Pooka 0.4.0: the editor knows the way"
date = "2026-11-23"
summary = "Pooka's first language server brings live diagnostics, formatting, an outline, and go-to-definition to your editor."
listSummary = "The first Pooka language server, plus clearer diagnostics and less work in repeat builds."
readingTime = "3 min read"
author = "Peregrine Finch"
authorRole = "Release notes"
download = { "url" = "https://github.com/pooka-lang/pooka/releases/tag/v0.4.0", "label" = "Download 0.4.0" }
news_kind = "release"
layout = "post"
permalink = "/news/pooka-0-4-0/"
---

Pooka can now tell your editor where a name came from. It can also point out several mistakes in an unsaved file, which is handy when you have made several.

The language server ships with Pooka 0.4.0. The editor starts it with `pooka lsp`. The [editor support guide](/docs/editor-support/) covers Zed and VS Code, with setup links for Neovim and Emacs.

## Follow a name

Put the cursor on `read` in `item.read()` and use **Go to Definition**.

```pooka
module main

class Book {
  read() -> Int {
    42
  }
}

pages(item: Book) -> Int {
  item.read()
}
```

The jump lands on `Book.read`. For an inherited method it lands on the class that declares it. The same command follows local bindings through shadowing and imports into available dependency source. You can move a declaration in another open buffer and jump to its new line before saving either file.

## While you type

The server shows errors and warnings from unsaved edits, gives the editor a document outline, and uses the Pooka formatter. Enable format on save in your editor if you want it to tidy up as you go.

The server checks dependencies offline. If it asks for a package, run `pooka deps download` at the project root. There are improvements at the terminal too. The compiler gathers more recoverable diagnostics in a failed build and reuses more work between builds.

[Download Pooka 0.4.0](https://github.com/pooka-lang/pooka/releases/tag/v0.4.0) · [Editor setup](/docs/editor-support/)
