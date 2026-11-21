---
title = "Fold a list into a summary"
shelf = "collections"
level = "Intermediate"
order = 4
uses = ["list.fold", "Option"]
card = "One pass, many answers: totals, minimums and counts."
summary = "Walk a list once and come back with everything you wanted to know about it, carried in a small class."
ingredients = ["`pooka/list`: `list.fold(values, initial, step)`", "`pooka/float`: `float.min`, `float.max`, `float.to_string`", "A class to carry several running values at once"]
sample_name = "fold-a-summary"
layout = "recipe"
permalink = "/cookbook/fold-a-summary/"
---

## Run it

```text
$ pooka run
readings: 5
coldest:  6.5
warmest:  11.5
average:  8.6
```

## How it works

<ol class="recipe-steps">
  <li><strong>A fold carries a value along.</strong> It starts with <code>initial</code> and calls <code>step(carried, item)</code> for each item. Whatever <code>step</code> returns is carried to the next item.</li>
  <li><strong>Carry a class, not a number.</strong> <code>Summary</code> holds the count, the total, the lowest and the highest, so one walk through the list fills in all four.</li>
  <li><strong>An empty list has no coldest night.</strong> <code>summarise</code> returns <code>Option(Summary)</code>: <code>None</code> for no readings, and <code>Some</code> otherwise. The first reading starts both the lowest and the highest.</li>
  <li><strong><code>/</code> gives a <code>Float</code>.</strong> <code>s.total / s.count</code> mixes a <code>Float</code> and an <code>Int</code>, and the answer is always a <code>Float</code>, here <code>8.6</code>.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> <code>list.reduce</code> folds without a starting value and returns <code>None</code> for an empty list. <code>list.fold_until</code> stops early when the answer is already known.</p></div>
</div>
