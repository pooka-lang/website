---
title = "Match on the shape of a list"
shelf = "basics"
level = "Beginner"
order = 4
uses = ["match"]
card = "Empty, one, many: let patterns do the counting."
summary = "A list is empty, has one thing, two things, or a first thing and the rest. `match` can tell them apart without counting."
ingredients = ["List patterns: `[]`, `[only]`, `[first, second]`, `[first, ..rest]`", "`pooka/list`: `list.length` and `list.each`"]
sample_name = "match-list-shapes"
layout = "recipe"
permalink = "/cookbook/match-list-shapes/"
---

## Run it

```text
$ pooka run
Nobody came. More tea for us.
Ada came alone.
Ada and Bo came together.
Ada came with 3 friends.
```

## How it works

<ol class="recipe-steps">
  <li><strong>Patterns describe shapes.</strong> <code>[]</code> is an empty list. <code>[only]</code> is exactly one element. <code>[first, second]</code> is exactly two.</li>
  <li><strong><code>..rest</code> means "and the others".</strong> <code>[first, ..rest]</code> matches any list with at least one element and names the remainder. It comes last, because it would also match the shorter shapes above it.</li>
  <li><strong>Every shape is covered.</strong> Remove the last arm and the compiler refuses, naming the shape you forgot: <code>help: Handle `[_, _, _, ..]` or add a fallback branch.</code></li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> patterns nest. <code>["Ada", ..]</code> matches any list that starts with Ada, and <code>[#(name, age), ..rest]</code> takes apart a list of tuples.</p></div>
</div>
