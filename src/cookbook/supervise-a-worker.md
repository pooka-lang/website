---
title: Supervise a worker
shelf: actors
level: Advanced
order: 3
uses: [pooka_otp, supervisor]
card: Let a supervisor start a crashed actor again, with `pooka_otp`.
summary: "Things break. A supervisor's only job is to notice, sweep up, and put a fresh one in its place, so the rest of the program can carry on."
sample: supervise-a-worker
ingredients:
  - "`pooka add pooka_otp`"
  - "`pooka/otp/supervisor`: `actor_child`, `spec`, `start`, `shutdown`"
  - "`pooka/otp`: a `Key` to find the newest actor after a restart"
---

## Run it

Add the package first:

```text
$ pooka add pooka_otp
$ pooka run
poured 3 cups
a new kettle has poured 0 cups
and now 1
```

## How it works

<ol class="recipe-steps">
  <li><strong>Describe the child.</strong> <code>supervisor.actor_child("kettle", kettles, fn() { Kettle() })</code> tells the supervisor how to make a kettle, and where to keep it: under the key <code>kettles</code>.</li>
  <li><strong>Start the tree.</strong> <code>supervisor.start</code> starts a real OTP supervisor with the <code>OneForOne</code> strategy: when a child crashes, start that child again and leave any others alone.</li>
  <li><strong>Crash on purpose.</strong> <code>crack()</code> panics inside the actor. The actor's process dies; the supervisor sees it and starts a new kettle.</li>
  <li><strong>Find the newest one.</strong> The old kettle is gone, so ask the key again: <code>otp.get(kettles)</code> returns the replacement. It starts with fresh state, which is why it has poured 0 cups.</li>
  <li><strong>Quiet, for the example.</strong> OTP logs every crash in detail, which is what you want in a real program. <code>otp.set_log_level(LogLevel.Critical)</code> keeps this example's output short.</li>
</ol>

> A supervisor does not prevent the fall. It just makes sure someone gets back up.

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> crash the kettle in a loop. After too many restarts in a short time, the supervisor gives up too; <code>spec(…).with_intensity(restarts, seconds)</code> sets the limit. The <a href="https://pooka-otp.hexdocs.pm/">pooka_otp documentation</a> covers servers, nested trees and applications.</p></div>
</div>
