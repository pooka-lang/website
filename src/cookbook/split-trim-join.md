---
title: Split, trim and join
shelf: text
level: Beginner
order: 2
uses: [pooka/string]
card: The everyday string toolkit, in one pipeline.
summary: "Untidy text comes in, tidy text goes out: split it, trim it, drop the empty bits, and join it back together."
sample: split-trim-join
ingredients:
  - "`pooka/string`: `split`, `trim`, `is_empty`, `uppercase`, `slice`, `drop_start`, `join`"
  - "`string.split_once` for `key = value` lines"
  - "`string.pad_start` for fixed-width numbers"
---

## Run it

```text
$ pooka run
Owl · Fox · Hare · Badger
lamp is lit
007 guests
```

## How it works

<ol class="recipe-steps">
  <li><strong>Split, then clean.</strong> <code>"owl, fox ,  hare,,badger "</code> splits on commas into pieces with spaces and one empty string. <code>list.map(string.trim)</code> tidies each piece, and the filter drops the empty one.</li>
  <li><strong>Capitalise by hand.</strong> Take the first character with <code>string.slice(word, 0, 1)</code>, upper-case it, and add back the rest with <code>string.drop_start(word, 1)</code>.</li>
  <li><strong>Split once for settings.</strong> <code>string.split_once</code> returns <code>Some(#(before, after))</code> at the first <code>=</code>, or <code>None</code> if there is none, so values may contain more <code>=</code> signs safely.</li>
  <li><strong>Pad for tables.</strong> <code>string.pad_start("7", 3, "0")</code> gives <code>"007"</code>. <code>pad_end</code> pads on the right, which lines up text columns.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> Pooka strings are UTF-8. <code>string.length</code> counts characters, <code>string.byte_size</code> counts bytes, and <code>string.graphemes</code> keeps emoji and accents in one piece.</p></div>
</div>
