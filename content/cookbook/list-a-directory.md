---
title = "List a directory"
shelf = "files"
level = "Beginner"
order = 2
uses = ["pooka/file", "pooka/path"]
card = "Walk a folder and keep only the files you want."
summary = "Look inside a folder, keep the files with the extension you care about, and print their names in order."
ingredients = ["`pooka/file`: `list_directory`, `create_directories`, `remove_directory`", "`pooka/path`: `path.join`, `path.extension`, `path.stem`"]
sample_name = "list-a-directory"
layout = "recipe"
permalink = "/cookbook/list-a-directory/"
---

## Run it

The program makes a small `shelf` folder, lists it, and removes it again:

```text
$ pooka run
attic
moon
owl
```

## How it works

<ol class="recipe-steps">
  <li><strong>Names, not paths.</strong> <code>file.list_directory("shelf")</code> returns the names inside the folder, like <code>"owl.txt"</code>, in no particular order. Use <code>path.join</code> to turn a name back into a path.</li>
  <li><strong>Extensions keep their dot.</strong> <code>path.extension("owl.txt")</code> is <code>Some(".txt")</code>, and a name without one gives <code>None</code>. Comparing with <code>Some(wanted)</code> handles both.</li>
  <li><strong>Sort before showing.</strong> <code>list.sort_by(string.compare)</code> puts the names in alphabetical order, and <code>path.stem</code> drops the extension for display.</li>
  <li><strong>One <code>?</code>, one <code>Result</code>.</strong> <code>files_with</code> returns <code>Result(List(String), FileError)</code>, so a missing folder is a message, not a crash.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> use <code>file.is_directory</code> to walk into subfolders, calling your function again for each one.</p></div>
</div>
