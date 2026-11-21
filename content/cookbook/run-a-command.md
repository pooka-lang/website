---
title = "Run a shell command"
shelf = "files"
level = "Intermediate"
order = 3
uses = ["pooka/process"]
card = "Call another program and read its output and exit status."
summary = "Ask another program a question, read what it printed, and notice when it is unhappy."
ingredients = ["`pooka/process`: `process.run(command, args)`", "`Output`, with `status`, `stdout` and `stderr`", "Guards to treat a non-zero status as a failure"]
sample_name = "run-a-command"
layout = "recipe"
permalink = "/cookbook/run-a-command/"
---

## Run it

```text
$ pooka run
Erlang/OTP 29
halt(3) exits with 3
no-such-command: command not found
```

## How it works

<ol class="recipe-steps">
  <li><strong>A command and its arguments.</strong> <code>process.run("erl", ["-noshell", "-eval", script])</code> runs <code>erl</code> with those arguments. They are passed along as they are, never interpreted by a shell, so spaces, quotes and <code>*</code> arrive exactly as written.</li>
  <li><strong>Two kinds of trouble.</strong> If the program cannot be started at all, you get <code>Error(ProcessError)</code>. If it starts and fails, you get <code>Ok(output)</code> with a non-zero <code>output.status</code>.</li>
  <li><strong>Decide what success means.</strong> The guard <code>Ok(output) if output.status == 0</code> accepts only a clean exit; the next arm turns any other status into an error message.</li>
  <li><strong>Output is text.</strong> <code>stdout</code> and <code>stderr</code> are strings, ready for <code>string.trim</code> and <code>string.split</code>.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> <code>process.run_in(command, args, folder)</code> runs a command in another folder, and <code>process.run_with_timeout</code> gives up after a while.</p></div>
</div>
