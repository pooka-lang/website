---
aliases = ["/cookbook/use-a-gleam-package/"]
title = "Use an Elixir or Gleam package"
shelf = "interop"
level = "Intermediate"
order = 2
uses = ["pooka add", "external"]
card = "Add an Elixir or Gleam package from Hex and give it a typed front door."
summary = "Hex is shared by the whole BEAM. Add an Elixir package and a Gleam one, describe the functions you need, and call them like neighbours."
ingredients = ["`pooka add slugify` (Elixir) and `pooka add gleam_stdlib` (Gleam)", "`external Name from elixir \"Module\" { … }`", "`external Name from gleam \"gleam/string\" { … }`"]
sample_name = "use-elixir-or-gleam"
layout = "recipe"
permalink = "/cookbook/use-elixir-or-gleam/"
---

## Run it

Add both packages first; they land in `pooka.toml` and `pooka.lock`:

```text
$ pooka add slugify
$ pooka add gleam_stdlib
$ pooka run
a-lantern-in-the-night-library
Pooka meets gleam
🏮 nretnal
```

## How it works

<ol class="recipe-steps">
  <li><strong>Elixir modules have capitalised names.</strong> Elixir's <code>Slug</code> is what goes after <code>from elixir</code>. Pooka builds Elixir packages with Mix, so Elixir needs to be installed; if it is not, Pooka says so.</li>
  <li><strong>Gleam modules have paths.</strong> In Gleam, <code>gleam/string</code> is a module path, and that is exactly what goes after <code>from gleam</code>. Gleam packages arrive already compiled to Erlang, so they need nothing extra.</li>
  <li><strong>The types line up.</strong> Strings are UTF-8 binaries in all three languages, so a Pooka <code>String</code> crosses into Elixir and Gleam and back without any translation. Gleam's <code>Result</code> and <code>Option</code> even look exactly like Pooka's.</li>
  <li><strong>Wrap what you use.</strong> <code>slug</code> is an ordinary Pooka function. The rest of the program calls it and never needs to know which language did the work.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Erlang packages</strong> from Hex work the same way: <code>pooka add</code> them and use <code>from erlang</code>, as in <a href="/cookbook/call-erlang/">Call an Erlang function</a>. The <a href="/docs/interop/">BEAM interop guide</a> shows how each Pooka value looks on the other side.</p></div>
</div>
