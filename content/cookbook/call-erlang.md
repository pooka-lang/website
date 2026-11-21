---
title = "Call an Erlang function"
shelf = "interop"
level = "Beginner"
order = 1
uses = ["external"]
card = "Describe it once in an `external` block, call it like Pooka."
summary = "Erlang's standard library is right next door. Describe the functions you need with Pooka types, wrap them in a friendly function, and use them like your own."
ingredients = ["`external Name from erlang \"module\" { … }` with the types of each function", "`crypto:strong_rand_bytes/1` and `binary:encode_hex/1` from OTP", "`BitArray` for Erlang binaries of raw bytes"]
sample_name = "call-erlang"
layout = "recipe"
permalink = "/cookbook/call-erlang/"
---

## Run it

The tokens are random, so yours will differ:

```text
$ pooka run
session: 831e187d36c58349f482be99855d42ae
short:   6b401a61
```

## How it works

<ol class="recipe-steps">
  <li><strong>Name the module, list the functions.</strong> <code>external Crypto from erlang "crypto"</code> gives the Erlang module <code>crypto</code> a Pooka name, and each line inside gives one function its argument and return types.</li>
  <li><strong>Types are a promise you make.</strong> Pooka cannot look inside Erlang, so it trusts what you write. <code>strong_rand_bytes</code> returns a binary of raw bytes, which is a <code>BitArray</code>; <code>encode_hex</code> returns text, which is a <code>String</code>.</li>
  <li><strong>Wrap it once.</strong> <code>token</code> is ordinary Pooka. The rest of the program calls <code>token(16)</code> and never needs to know Erlang was involved.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> for code of your own in Erlang, put a <code>.erl</code> file in the project's <code>ffi/</code> folder and bind it the same way. The <a href="/docs/interop/">BEAM interop guide</a> shows how Pooka values look on the Erlang side.</p></div>
</div>
