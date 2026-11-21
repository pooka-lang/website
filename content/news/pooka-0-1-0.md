---
title = "Hello, BEAM: Pooka 0.1.0"
date = "2026-11-10"
summary = "A small, typed language for the BEAM, and a compiler you can carry in a coat pocket."
listSummary = "The first release of the compiler and its one-file toolchain, under the Apache License 2.0."
readingTime = "2 min read"
author = "Peregrine Finch"
authorRole = "Release notes"
download = { "url" = "https://github.com/pooka-lang/pooka/releases/tag/v0.1.0", "label" = "Download 0.1.0" }
news_kind = "release"
layout = "post"
permalink = "/news/pooka-0-1-0/"
---

In the old stories, a pooka is a shape-shifter. A horse at midnight, a goat by the river, a black dog on the road home. Never quite one thing, and rarely unkind to people who are polite to it.

Today one of them has learned to compile.

Pooka 0.1.0 is the first release of a small, statically typed language for the BEAM, the patient machine underneath Erlang, Elixir and Gleam. It has immutable classes, interfaces, enums, pattern matching, actors with mailboxes, and errors you can hold in your hand as `Result` values.

## One file, one coat pocket

The whole toolchain is a single file called `pooka`. It asks for one thing in return: Erlang/OTP 29, a warm place to run.

From there it does the usual chores of a house:

- `pooka new` makes a project, with a first test and a workflow for GitHub
- `pooka run`, `pooka test`, `pooka check` and `pooka build` do what their names promise
- `pooka format` keeps everyone's code wearing the same coat
- `pooka docs` and `pooka publish` share your work with the rest of the BEAM on Hex
- `pooka add`, `pooka deps` and `pooka export` look after dependencies and releases

```sh
pooka new lantern
cd lantern
pooka run
```

> A first release is a front door. It is not finished, but it is open.

## Where to start

Begin with [Getting started](/docs/getting-started/), then take [the tour](/tour/). It reads like a short book, and you can wander in and out of its rooms as you like.

Pooka is free and open source, under the Apache License 2.0. It is young, and it will change. If you find a loose plank, [tell us where](https://github.com/pooka-lang/pooka/issues).

— Peregrine Finch
