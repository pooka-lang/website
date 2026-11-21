---
title = "Write a tiny lexer"
shelf = "text"
level = "Intermediate"
order = 3
uses = ["lexie", "locations", "poke"]
card = "Generate a typed lexer from a private TOML specification."
summary = "A little language begins with a few words. Give Lexie their spellings; it writes the scanner and remembers where each token came from."
files = ["src/main.pooka", "test/lexer.spec.pooka"]
ingredients = ["Lexie as a development dependency", "An ignored `.lexie/lexie.toml` specification", "Generated token classes and half-open source spans", "Poke assertions against the generated lexer"]
sample_name = "tiny-lexer"
layout = "recipe"
permalink = "/cookbook/tiny-lexer/"
---

## Give the language its words

```sh
pooka add lexie --dev
pooka add poke --dev --git https://github.com/peregrinefinch/poke.git --rev 91ef891395ed3308d820bfa22e3b2dba4c39ecc5
pooka run -m lexie init
```

In a project named `tiny_lexer`, edit `.lexie/lexie.toml`:

```toml
location-info = true

[output]
dir = "src"

[module]
name = "tiny_lexer/scanner"

[keywords]
items = ["let"]

[operators]
items = ["="]
```

Identifiers and numbers have defaults, so this is enough for `let answer = 42`.
The file is ignored by Git. Change `module.name` to choose the generated folder;
commit the generated Pooka modules, rather than the local specification.

## Generate and ask it to read

```sh
pooka run -m lexie
pooka run
pooka test
```

Lexie writes `location.pooka`, `token.pooka` and `lexer.pooka` under
`src/tiny_lexer/scanner`. The program prints the token and its source address.
`answer` begins at line 1, column 5, byte 4. Its span ends just after its last
character; the final `End` token marks the end of the source.

## Look at the tokens

For `let answer = 42`, the program prints these token/address pairs (wrapped here
so each token is easy to follow):

```text
[
  #(Let(), "input.tiny:1:1"),
  #(Ident("answer"), "input.tiny:1:5"),
  #(Equal(), "input.tiny:1:12"),
  #(IntLiteral("42"), "input.tiny:1:14"),
  #(End(), "input.tiny:1:16")
]
```

`let` is a keyword, `answer` is an identifier, and the integer keeps its source
spelling. The final token makes end-of-input explicit for a parser. The test
checks both the token sequence and the identifier's start and end positions.

Use `location-info = false` when only token values are needed. The explicit
`lex_with_locations` entry point remains available for tools that need spans.
See the [Lexie guide](https://lexie.hexdocs.pm/guide.html) for strings, comments,
number formats and semantic highlighting.
