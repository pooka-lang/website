---
title: Read and write files
shelf: files
level: Beginner
order: 1
uses: [pooka/file, "?"]
card: Load, change and save a file, handling every `FileError`.
summary: "Write a file, add to it, read it back and tidy up, with one `?` per step and one place to handle every failure."
sample: read-and-write-files
ingredients:
  - "`pooka/file`: `write`, `append`, `read`, `delete`, each returning a `Result`"
  - "`FileError`, with the `path` and a `message`"
  - "`?` to stop at the first error"
---

## Run it

```text
$ pooka run
Remember the kettle.
Feed the owl.
Could not read missing.txt: enoent
```

## How it works

<ol class="recipe-steps">
  <li><strong>Every file operation can fail.</strong> Disks fill up, files go missing, permissions say no. So every function in <code>pooka/file</code> returns a <code>Result</code> with a <code>FileError</code>.</li>
  <li><strong><code>?</code> keeps the happy path straight.</strong> In <code>keep_notes</code>, each <code>?</code> either unwraps the <code>Ok</code> or returns the <code>Error</code> straight away. Four steps, no nesting.</li>
  <li><strong>Handle it once, at the top.</strong> <code>main</code> matches on the whole result and prints the path and message if anything went wrong.</li>
  <li><strong>Messages come from the BEAM.</strong> A missing file says <code>enoent</code> ("error, no entry"), the name Erlang gives it. You can match on it to say something gentler.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> <code>file.read_bytes</code> and <code>file.write_bytes</code> work with <code>BitArray</code> for images and other binary files. <code>file.exists</code> asks before you touch.</p></div>
</div>
