---
title: Count things with a Dict
shelf: collections
level: Beginner
order: 2
uses: [pooka/dict, list.group]
card: Tally values with `get_or` and `insert`, then read them back sorted.
summary: "A `Dict` is a cupboard of labelled jars. Count votes into it, read the counts back in order, and let `list.group` sort things into jars for you."
sample: count-with-a-dict
ingredients:
  - "`pooka/dict`: `dict.empty()`, and the methods `get_or`, `insert`, `keys`, `get`"
  - "`pooka/list`: `fold`, `sort_by`, `group`"
  - "`pooka/string`: `string.compare` for alphabetical order"
---

## Run it

```text
$ pooka run
cocoa: 2
coffee: 1
tea: 3
src/main.pooka:33
Some(["fox", "finch"])
```

## How it works

<ol class="recipe-steps">
  <li><strong>Dicts never change.</strong> <code>counts.insert(vote, …)</code> returns a new <code>Dict</code> with one more entry; the old one is untouched. That is why the tally is a <code>fold</code>: each step hands the newer dict to the next.</li>
  <li><strong><code>get_or</code> saves a <code>match</code>.</strong> <code>counts.get_or(vote, 0)</code> is the count so far, or <code>0</code> for a drink nobody has asked for yet.</li>
  <li><strong>Order is up to you.</strong> A <code>Dict</code> keeps no particular order, so sort its keys before printing anything a person will read.</li>
  <li><strong><code>list.group</code> builds a dict of lists.</strong> Give it a function that names each item's jar (here, the first letter) and it returns <code>Dict(String, List(String))</code>. <code>get</code> returns an <code>Option</code>, because the jar might not exist.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> <code>upsert</code> does the read and the write in one call; <a href="/cookbook/count-words/">Count words in a file</a> uses it. <code>dict.from_list</code> builds a dict from pairs in one go.</p></div>
</div>
