---
title: Test many cases in a loop
shelf: testing
level: Beginner
order: 2
uses: [loop, "assert … as", test skip]
card: Table-driven tests with `loop` and labelled assertions.
summary: "Ten cases, one assertion. Put the inputs and answers in a table, loop over it, and label each check so a failure says which row it was."
sample: table-driven-tests
files: [src/roman.pooka, test/roman.spec.pooka]
ingredients:
  - "A list of tuples as a table of cases"
  - "`loop … in …` inside a test"
  - "`assert … as \"…\"` to label each check, and `test skip` for later"
---

## Run it

```text
$ pooka test
  Running tests...

  • test module: roman_test

  ✓ numbers become numerals
  ✓ nothing has no numeral
  - numbers past 3999 need a bar over them (skipped)

  3 tests, 2 passed, 1 skipped
```

Get one row wrong, say `#(1987, "MCMLXXXVI")`, and the label tells you which:

```text
$ pooka test
  ✗ numbers become numerals
      assertion failed: 1987 should be MCMLXXXVI
      expected "MCMLXXXVI"
      got "MCMLXXXVII"
      test/roman.spec.pooka:21

  3 tests, 1 passed, 1 failed, 1 skipped
```

## How it works

<ol class="recipe-steps">
  <li><strong>The table is data.</strong> Each <code>#(number, expected)</code> is a row. Adding a case means adding a line, not writing a test.</li>
  <li><strong>Label every check.</strong> Every row runs the same <code>assert</code>, on the same line, so a line number alone cannot say which row failed. The label can.</li>
  <li><strong>The first failure stops the test.</strong> Later rows are not checked once one fails, so fix from the top.</li>
  <li><strong><code>test skip</code> waits patiently.</strong> A skipped test is still type-checked, so it cannot rot while it waits for numerals with bars over them.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> add the reverse, <code>from_roman</code>, and test that every number from 1 to 3999 survives the round trip with one <code>loop</code> over <code>list.range(1, 4000)</code>.</p></div>
</div>
