---
title = "Sort by a key"
shelf = "collections"
level = "Beginner"
order = 3
uses = ["pooka/list", "pooka/order"]
card = "Order classes by any field with `list.sort_by`."
summary = "Sort a shelf of books by year, backwards by year, or by author and then title. You only ever say how two books compare."
ingredients = ["`pooka/list`: `list.sort_by(values, compare)`", "`int.compare` and `string.compare`, which return an `Order`", "`pooka/order`: `order.reverse`, and the `Order.Equal` variant for tie-breaks"]
sample_name = "sort-by-a-key"
layout = "recipe"
permalink = "/cookbook/sort-by-a-key/"
---

## Run it

```text
$ pooka run
Oldest first:
1937  The Hobbit
1946  Comet in Moominland
1954  Moominsummer Madness
1968  A Wizard of Earthsea

Newest first:
1968  A Wizard of Earthsea
1954  Moominsummer Madness
1946  Comet in Moominland
1937  The Hobbit

By author, then title:
1946  Comet in Moominland
1954  Moominsummer Madness
1968  A Wizard of Earthsea
1937  The Hobbit
```

## How it works

<ol class="recipe-steps">
  <li><strong>Compare two at a time.</strong> <code>list.sort_by</code> asks one question over and over: given two books, which comes first? Answer with an <code>Order</code>: <code>Less</code>, <code>Equal</code> or <code>Greater</code>.</li>
  <li><strong>Borrow a comparison.</strong> <code>int.compare(a.year, b.year)</code> already answers the question for numbers, and <code>string.compare</code> for text.</li>
  <li><strong>Backwards is one word.</strong> <code>order.reverse</code> swaps <code>Less</code> and <code>Greater</code>, so the newest book comes first.</li>
  <li><strong>Break ties with a match.</strong> When the authors are <code>order.Order.Equal</code>, compare the titles instead; otherwise keep the authors' answer. The two Jansson books end up side by side, in title order.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> <code>list.sort</code> sorts lists of numbers or strings directly. Sorting is stable, so books that compare equal keep their original order.</p></div>
</div>
