---
title: Read command-line arguments
shelf: basics
level: Beginner
order: 2
uses: [pooka/env, match]
card: Match on `env.args()` to build a tiny command.
summary: Read the words typed after your program's name, and let a `match` decide what they mean.
sample: read-arguments
ingredients:
  - "`pooka/env`: `env.args()` returns the arguments as a `List(String)`"
  - "`match` on lists, with pattern alternatives for options in either order"
  - "`pooka/process`: `process.exit(1)` when the arguments make no sense"
---

## Run it

Arguments for your program go after `--`, so `pooka` knows they are not for itself:

```text
$ pooka run -- Ada
Hello, Ada.
$ pooka run -- Ada --shout
HELLO, ADA!
$ pooka run
usage: greet <name> [--shout]
```

## How it works

<ol class="recipe-steps">
  <li><strong>Arguments are a list.</strong> <code>env.args()</code> gives you every word after <code>--</code>, as strings, without the program's own name.</li>
  <li><strong>Each shape is a case.</strong> One name, a name with <code>--shout</code>, nothing at all, or too much. The arm <code>[name, "--shout"] | ["--shout", name]</code> accepts the option before or after the name, and both alternatives bind <code>name</code>.</li>
  <li><strong>Deciding is separate from doing.</strong> <code>greet</code> returns a <code>Result</code> and prints nothing, so it is easy to test. <code>main</code> prints the line, or prints the usage to standard error and exits with status 1, so scripts can tell something went wrong.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> add a <code>--times N</code> option and parse the number with <a href="/cookbook/parse-a-number/">Parse a number safely</a>. For anything bigger, a small argument-parsing library will save you from writing every arm by hand.</p></div>
</div>
