---
title = "Parse a number safely"
shelf = "basics"
level = "Beginner"
order = 3
uses = ["pooka/int", "Result"]
card = "Turn text into an `Int` without crashing on bad input."
summary = "Text from a person is a promise, not a number. Check it, and say kindly what was wrong."
ingredients = ["`pooka/int`: `int.parse` returns `Result(Int, ParseError)`", "`pooka/string`: `string.trim` for stray spaces", "Guards (`if`) inside `match` arms"]
sample_name = "parse-a-number"
layout = "recipe"
permalink = "/cookbook/parse-a-number/"
---

## Run it

```text
$ pooka run
ok     42
ok     7
error  an age cannot be negative
error  `forty` is not a whole number
error  that is a very old owl
```

## How it works

<ol class="recipe-steps">
  <li><strong>Parse, never assume.</strong> <code>int.parse</code> does not throw. It returns <code>Ok(number)</code> or <code>Error(_)</code>, and the compiler makes sure you look at both.</li>
  <li><strong>Trim first.</strong> <code>" 7 "</code> is a fine age with some air around it. <code>string.trim</code> lets it through.</li>
  <li><strong>Guards add your own rules.</strong> <code>Ok(age) if age &lt; 0</code> catches numbers that parse but make no sense. Arms are tried top to bottom, so the plain <code>Ok(age)</code> comes after the guarded ones.</li>
  <li><strong>The error is a sentence.</strong> <code>read_age</code> returns <code>Result(Int, String)</code>, with a message a person can act on, not a stack trace.</li>
</ol>

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> <code>float.parse</code> works the same way for decimals. Use <code>?</code> to pass a parse error straight up from a function that reads several numbers.</p></div>
</div>
