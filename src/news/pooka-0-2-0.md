---
title: "Pooka 0.2.0: alternatives, spreads and projections"
date: 2026-11-13
kind: release
summary: Three small doors in the language, and a compiler that is more careful about whom it blames.
listSummary: Match arms can share a body, lists can be built with a spread tail, and tuple fields are one dot away. Plus quieter, more accurate diagnostics.
readingTime: 3 min read
author: Peregrine Finch
authorRole: Release notes
download:
  url: https://github.com/pooka-lang/pooka/releases/tag/v0.2.0
  label: Download 0.2.0
---

Three days after the first release, the house already had opinions about its doors.

Some rooms wanted to share one. Some lists wanted to be built from the front. Some tuples were tired of being taken apart just to read a single thing inside.

So 0.2.0 adds three small doors, and teaches the compiler to be more careful about whom it blames.

## Doors that open onto the same room

Match arms that do the same thing can now share a body:

```pooka
match arguments {
  [] | ["--help"] | ["-h"] -> help()
  ["--version"] | ["-V"] -> version()
  _ -> run(arguments)
}
```

Alternatives work with guards. They work with bindings too, as long as every alternative binds the same names with compatible types. The compiler checks; nobody sneaks into the room under the wrong name.

## Lists, built from the front

A list can now end in a spread:

```pooka
let path = [first, second, ..rest]
```

It becomes plain cons cells, so putting things at the front stays as cheap as it always was on the BEAM. Nothing is copied. Nothing is rearranged behind your back.

## One dot away

Tuple elements can be read by position:

```pooka
let pair = #("owl", #(3, True))
echo pair.0
echo pair.1.0
```

Counting starts at zero, so `pair.0` is the first thing in the pair. Projections chain, and reaching past the end is a compile-time error, not a crash at three in the morning.

> The best shortcut is the one the compiler can still check.

## Blaming the right function

Compilers, like people, sometimes blame whoever is standing nearest. This release is better at not doing that.

- When you annotate a local binding, generic inference now listens, including inside nested containers and destructured patterns.
- When an imported module fails to parse, you hear about the parse error, not a misleading "unknown module".
- When a function body has an error, its declared signature still stands, so the places that call it correctly are left in peace.

## Thank you

Every change here began as an issue someone took the time to write. If anything surprises you, [leave a note](https://github.com/pooka-lang/pooka/issues). It will be read.

— Peregrine Finch
