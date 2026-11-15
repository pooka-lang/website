---
title: "Hello, BEAM: Pooka 0.1.0"
date: 2026-11-10
kind: release
summary: The first release of the Pooka compiler and its one-file toolchain.
listSummary: The first release of the compiler and its one-file toolchain, licensed under Apache 2.0.
readingTime: 1 min read
authorRole: Release notes
download:
  url: https://github.com/pooka-lang/pooka/releases/tag/v0.1.0
  label: Download 0.1.0
---

Pooka 0.1.0 is the first release of the compiler and its command-line toolchain, licensed under the Apache License, Version 2.0.

The whole toolchain is one file, `pooka`. It creates projects, builds, runs, tests, formats, documents and publishes them, and it only asks for Erlang/OTP 29 in return.

```sh
pooka new lantern
cd lantern
pooka run
```

New here? Start with [Getting started](/docs/getting-started/), then take [the tour](/tour/).
