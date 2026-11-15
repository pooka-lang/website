---
title: Count words in a file
shelf: text
level: Beginner
order: 1
uses: [pooka/file, pooka/dict]
summary: Read a text file, split it into words, tally them in a `Dict` and print the three most common.
card: Read a file, split it into words and print the most common ones.
sample: words
ingredients:
  - "`pooka/file`: `file.read` returns `Result(String, FileError)`"
  - "`pooka/string`: `lowercase`, `replace`, `split`"
  - "`pooka/dict`: `dict.empty` and the `upsert` method"
  - "`pooka/list`: `fold`, `filter`, `sort_by`, `take`, `each`"
---

## Run it

Put a few lines in `poem.txt` next to `pooka.toml` and run it:

```text
$ printf 'the owl and the moon\nthe lamp and the owl\nthe end\n' > poem.txt
$ pooka run
the: 5
and: 2
owl: 2
```

## How it works

<ol class="recipe-steps">
  <li><strong>Read the file.</strong> <code>file.read</code> never throws: a missing file comes back as <code>Error(FileError)</code>, carrying the path and a message. The <code>match</code> makes both outcomes explicit.</li>
  <li><strong>Make words.</strong> Lowercase the text so “The” and “the” count together, turn newlines into spaces, split on spaces, and drop the empty strings left by double spaces.</li>
  <li><strong>Tally.</strong> <code>count</code> folds over the words with a <code>Dict(String, Int)</code>. <code>upsert</code> hands you the current count as an <code>Option</code>: <code>None</code> the first time, <code>Some(n)</code> after.</li>
  <li><strong>Rank and print.</strong> Turn the dict into pairs, sort by the count (<code>b.1</code> before <code>a.1</code> for descending order), take three and print each. <code>io.println</code> returns a <code>Result</code>, so it's discarded with <code>let _ =</code>.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> read the file name from <code>env.args()</code> instead of hard-coding <code>poem.txt</code>, or strip punctuation with a few more <code>string.replace</code> calls.</p></div>
</div>
