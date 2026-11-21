---
title = "Poke your code"
shelf = "testing"
level = "Beginner"
order = 3
uses = ["poke", "should", "property"]
card = "Small assertions and a repeatable property with Poke."
summary = "A parcel has a price and a name. Check a few examples, then let Poke bring a hundred more."
files = ["src/parcel.pooka", "test/parcel.spec.pooka"]
ingredients = ["Poke as a development dependency", "Actual-first assertions with `should.equal`", "Result unwrapping in a pipeline", "A seeded property with shrinking"]
sample_name = "test-with-poke"
layout = "recipe"
permalink = "/cookbook/test-with-poke/"
---

## Add Poke

```sh
pooka add poke --dev --git https://github.com/peregrinefinch/poke.git --rev 91ef891395ed3308d820bfa22e3b2dba4c39ecc5
pooka test
```

Tests stay in `.spec.pooka` files. `should.equal(actual, expected)` keeps both
values in a failure report. `be_ok` and `be_error` unwrap a result so its value
can continue through the pipeline.

## Ask a wider question

The property checks that combining two orders preserves their total. Poke draws
pairs of counts from a fixed seed; if one fails, it tries smaller counts and
prints the seed and counterexample so the failure can be replayed.

Once the snapshot below has been accepted, `pooka test` reports every check:

```text
  Running tests...

  • test module: parcel_test

  ✓ three parcels at 250 cost 750
  ✓ labels keep a name and explain when it is missing
  ✓ combining orders preserves their total
  ✓ the parcel label stays familiar

  4 tests, 4 passed

  Finished in 0.27s
```

## Keep a small snapshot

The last test stores the rendered label. On its first run, Poke writes a candidate
in `test/snapshots/parcel-label.new` and fails the test so it can be reviewed.

```sh
pooka test
pooka run -m poke review
```

The candidate contains exactly:

```text
To: Owl
```

Accept it in the reviewer. Poke saves `test/snapshots/parcel-label.accepted`;
commit that file beside the test. A later change to the label stages a new
candidate and the reviewer shows the difference. Run `pooka test` again after
accepting the intended result.

## See what changed

Suppose the label changes to `To: Little Owl`. Run the tests to stage the new
result, then open the reviewer again. Its diff puts the accepted text above the
candidate (the terminal width controls the length of the rules):

```snapshot
  Reviewing 1 out of 1

  ── mismatched snapshots ──────────────────────────

  title: parcel-label
  file:  test/snapshots/parcel-label.accepted

  - old snapshot
  + new snapshot

  ───┬─────────────────────────────────────────────
   1 - To: Owl
   1 + To: Little Owl
  ───┴─────────────────────────────────────────────

  a  accept      accept the new snapshot
  r  reject      keep the accepted snapshot
  s  skip        leave this candidate for later
  d  hide diff   toggle the snapshot diff
  ↵  refresh     redraw at the current terminal width
  q  quit        return to the remaining snapshots later

  Choose an action, then Enter  >
```

Accept an intended change, reject an unwanted one, or skip it while you
investigate. Tests always ask for review before replacing an accepted snapshot.

Poke is a development dependency. It is not part of the application you ship.
Read the [Poke guide](https://poke.hexdocs.pm/guide.html) for fixtures, snapshots,
process checks and state models.
