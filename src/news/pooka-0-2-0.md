---
title: "Pooka 0.2.0: alternatives, spreads and projections"
date: 2026-11-13
kind: release
summary: Three small additions to the language that make everyday code shorter, and a handful of fixes that make the compiler's advice more trustworthy.
listSummary: Match arms can share a body, lists can be built with a spread tail, and tuple fields are one dot away. Plus quieter, more accurate diagnostics.
readingTime: 3 min read
authorRole: Release notes
download:
  url: https://github.com/pooka-lang/pooka/releases/tag/v0.2.0
  label: Download 0.2.0
---

Pooka 0.2.0 is out. Download it from the [release page](https://github.com/pooka-lang/pooka/releases/tag/v0.2.0), or run the installer again:

```sh
curl -fsSL https://pooka.run/install.sh | sh
```

## Pattern alternatives

Match arms that do the same thing can now share one body. Alternatives work with guards, and with bindings as long as every alternative binds the same names with compatible types.

```pooka
match arguments {
  [] | ["--help"] | ["-h"] -> help()
  ["--version"] | ["-V"] -> version()
  _ -> run(arguments)
}
```

## List spreads

Lists can be built with a spread tail. It compiles straight to cons cells, so prepending stays as cheap as it should be.

```pooka
let path = [first, second, ..rest]
```

## Tuple projections

Read tuple elements by position. Projections chain, and reaching past the end is a compile-time error, not a crash.

```pooka
let pair = #("owl", #(3, True))
echo pair.0
echo pair.1.0
```

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p>Positions start at zero: <code>pair.0</code> is the first element.</p></div>
</div>

## Fixes

- Explicit annotations on local bindings are respected during generic inference, including nested containers and destructured patterns.
- An imported module that fails to parse no longer produces a misleading “unknown module” error.
- A function's declared signature stays available after an error in its body, so correct call sites are not blamed.

## Thank you

Every one of these changes started as an issue. If something surprises you, [tell us](https://github.com/pooka-lang/pooka/issues).
