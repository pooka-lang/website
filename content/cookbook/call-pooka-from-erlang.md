---
title = "Call Pooka from Erlang"
shelf = "interop"
level = "Intermediate"
order = 4
uses = ["erlang", "BEAM"]
card = "Build a Pooka module and call it from the Erlang shell."
summary = "Pass a UTF-8 binary from Erlang to a Pooka function and get a greeting back."
ingredients = ["A Pooka module with a public function", "`pooka build --target prod` to compile it", "The Erlang shell with the compiled apps on its code path"]
sample_name = "call-pooka-from-erlang"
layout = "recipe"
permalink = "/cookbook/call-pooka-from-erlang/"
---

## Build the package

```sh
pooka new greeting
cd greeting
```

Replace `src/main.pooka` with the program above, then build and launch Erlang
from the project directory.

```sh
pooka build --target prod
ERL_LIBS="$PWD/build/prod/erlang" erl
```

## Call the function

```erlang
1> 'pooka@greeting@main':greet(<<"Ada">>).
<<"Hello, Ada!">>
2> q().
ok
```

The generated module name includes the Pooka package (`greeting`) and
module (`main`). Quote the full name so Erlang reads it as an atom.
Pooka uses UTF-8 binaries for `String`, so the argument uses Erlang's
`<<"…">>` syntax.

The [interop guide](/docs/interop/) lists the BEAM representations for
more Pooka types, including classes, enums, and results.
