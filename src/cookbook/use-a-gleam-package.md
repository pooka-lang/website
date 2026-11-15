---
title: Use a Gleam package
shelf: interop
level: Intermediate
order: 2
uses: [pooka add, external]
card: Add a Gleam package from Hex and give it a typed front door.
summary: "Gleam packages on Hex arrive already compiled to Erlang, so Pooka can add them and call them like any neighbour."
sample: use-a-gleam-package
ingredients:
  - "`pooka add gleam_stdlib`"
  - "`external Name from gleam \"gleam/string\" { … }`"
---

## Run it

Add the package first; it lands in `pooka.toml` and `pooka.lock`:

```text
$ pooka add gleam_stdlib
$ pooka run
Pooka meets gleam
🏮 nretnal
```

## How it works

<ol class="recipe-steps">
  <li><strong>Gleam modules have paths.</strong> In Gleam, <code>gleam/string</code> is a module path, and that is exactly what goes after <code>from gleam</code>.</li>
  <li><strong>The types line up.</strong> Gleam's <code>String</code>, <code>Int</code>, <code>List</code>, <code>Result</code> and <code>Option</code> look the same on the BEAM as Pooka's, so they cross without any translation.</li>
  <li><strong>Graphemes stay whole.</strong> Gleam's <code>reverse</code> works on graphemes, so the lantern emoji comes out in one piece instead of as broken bytes.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Erlang packages</strong> from Hex work the same way: <code>pooka add</code> them and use <code>from erlang</code>. <strong>Elixir packages</strong> that need Mix to build are not supported yet.</p></div>
</div>
