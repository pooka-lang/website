---
title: Write your first test
shelf: testing
level: Beginner
order: 1
uses: [test, assert, let assert]
card: "`test` blocks, `assert` and `pooka test`."
summary: "A small module about a kettle, and four tests that keep it honest. Then break it on purpose, to see what a failure looks like."
sample: first-test
files: [src/kettle.pooka, test/kettle.spec.pooka]
ingredients:
  - "Spec files in `test/`, ending in `.spec.pooka`"
  - "`test \"name\" { … }` and `assert`"
  - "`let assert` to unwrap a value you expect"
---

## Run it

```text
$ pooka test
  Running tests...

  • test module: kettle_test

  ✓ a litre makes four cups
  ✓ half a cup is not a cup
  ✓ pouring says how many
  ✓ an empty kettle explains itself

  4 tests, 4 passed
```

Now change `250` to `200` in `kettle.cups` and run the tests again. One of them notices straight away:

```text
$ pooka test
  ✗ a litre makes four cups
      expected 4
      got 5
      test/kettle.spec.pooka:6

  4 tests, 3 passed, 1 failed
```

## How it works

<ol class="recipe-steps">
  <li><strong>A spec file is a module.</strong> <code>test/kettle.spec.pooka</code> imports <code>kettle</code> like any other module. Spec files never end up in what you ship.</li>
  <li><strong>A test passes if its block finishes.</strong> <code>assert</code> stops it when the condition is <code>False</code>. For an <code>==</code> comparison, the report shows both sides: what you expected and what you got.</li>
  <li><strong><code>let assert</code> unwraps.</strong> <code>let assert Error(reason) = kettle.pour(0)</code> fails the test if the result is not an <code>Error</code>, and otherwise names the reason so the next line can check it.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> run <code>pooka test --compact</code> for a one-line summary, and read <a href="/docs/testing/">Testing</a> for skipping tests and writing your own helpers.</p></div>
</div>
