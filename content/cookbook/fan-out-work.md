---
title = "Fan work out to actors"
shelf = "actors"
level = "Intermediate"
order = 2
uses = ["actor", "list.map"]
card = "Start several workers and gather their answers."
summary = "Split a big sum into four parts, give each to its own actor so they work at the same time, then collect the answers."
ingredients = ["An `actor` with a `be` behaviour for the work and a method for the result", "`pooka/list`: `range`, `map`, `fold`"]
sample_name = "fan-out-work"
layout = "recipe"
permalink = "/cookbook/fan-out-work/"
---

## Run it

```text
$ pooka run
parts: 4
total: 333333833333500000
```

That is the sum of the squares of every number from one to a million, which the formula `n(n+1)(2n+1)/6` agrees with.

## How it works

<ol class="recipe-steps">
  <li><strong>Hand out the work.</strong> The first <code>list.map</code> creates a <code>Worker</code> for each range and sends it <code>sum_squares</code>. Because that is a <code>be</code> behaviour, sending returns at once, and all four workers start computing side by side, on as many cores as the BEAM has.</li>
  <li><strong>Collect the answers.</strong> The second <code>list.map</code> asks each worker for <code>result()</code>. A request waits until the worker has handled the messages sent before it, so each answer is the finished sum.</li>
  <li><strong>Add them up.</strong> A <code>fold</code> combines the four parts into the total.</li>
  <li><strong>Mind the range.</strong> <code>list.range(from, to)</code> stops before <code>to</code>, so the worker asks for <code>to + 1</code> to include its last number.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> time it with <code>time.monotonic_now()</code> and <code>time.duration_between</code>, then compare with one worker doing the whole range.</p></div>
</div>
