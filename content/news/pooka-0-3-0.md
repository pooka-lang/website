---
title = "Pooka 0.3.0: a few rough edges, put to rest"
date = "2026-11-15"
summary = "Publishing with someone holding the door, tools that live in your dependencies, warnings for letters left unopened, and panics that finally remember where they happened."
listSummary = "Guided Hex publishing, `pooka run -m` for dependency tools, a warning for discarded Results, panics with their source location, and quieter, faster builds."
readingTime = "5 min read"
author = "Peregrine Finch"
authorRole = "Release notes"
download = { "url" = "https://github.com/pooka-lang/pooka/releases/tag/v0.3.0", "label" = "Download 0.3.0" }
news_kind = "release"
layout = "post"
permalink = "/news/pooka-0-3-0/"
---

Some releases arrive with fireworks. This one arrives with a broom.

Nothing in 0.3.0 changes what Pooka is. It changes how Pooka behaves when you are tired: when you publish at midnight, when a crash happens three functions away, when a `Result` slips quietly under the rug.

The lantern is the same lantern. We trimmed the wick.

To update, run the installer again. It fetches the newest release and checks it before anything is replaced:

```sh
curl -fsSL https://pooka.run/install.sh | sh
```

*Yes, that is new too. The documentation moved here as well. Pooka has a house now.*

## Publishing, with someone holding the door

Publishing used to feel like posting a letter through a slot you could not see. You set an environment variable, said a small prayer, and pressed Enter.

Now `pooka publish` walks you through it.

If no Hex key is configured, Pooka tells you where to make one and asks for it with hidden input. The key is used for this one invocation. It is not printed, not saved, not tucked into your shell for later. If Hex turns it away, you get one more try. If Hex asks for a verification code, Pooka asks you, quietly, once.

```text
Upload the prepared files? [y/N] y

No Hex API key is configured.
Create a Hex API key with API Read and Publish permissions.
https://hex.pm/docs/keys

Hex API key (hidden; Enter cancels):
```

Scripts and CI keep their manners: `--yes` never asks for anything, and reads `HEX_API_KEY` from the environment instead.

And before anything leaves your machine, Pooka now points at every `echo` left in your production code. It does not stop you. Sometimes debug output is exactly what you meant to ship. It just clears its throat.

## Tools that live in your dependencies

A code generator, a linter, a little helper that writes files for you: these belong in your project, pinned in `pooka.lock` like everything else. Until now they could not run from there, because every package's `main` module tried to be the only one in the house.

Each package now keeps its own `main`, privately. Pick one with `-m`:

```sh
pooka add tool --dev
pooka run -m tool -- init
```

Arguments after `--` arrive untouched. When names overlap, `package:module` chooses exactly: `tool:main`, or `app:tools/check`. The [CLI reference](/docs/cli/#running-dependency-tools) has the details.

## Letters left unopened

A `Result` is a letter. It might contain good news. It might contain a bill. Pooka now notices when you drop one in the bin without opening it:

```pooka
module main

import pooka/file

main() {
  file.write("notes.txt", "remember the kettle")
  echo "saved"
}
```

```text
warning: discarded Result
  ╭─ src/main.pooka:6:3
  │
6 │   file.write("notes.txt", "remember the kettle")
  │   ───────────────────────┬──────────────────────
  │                          ╰─ this Result is discarded, so its error will go unnoticed
  ╰─

help: Handle the Result with match or ?, or write `let _ =` to discard it explicitly.
```

If ignoring it is really what you want, say so with `let _ =`, and the compiler nods and moves on. A value you return is never warned about. It is being handed to someone, after all.

> A warning is only a lantern held up to something you were already carrying.

## Panics that remember where they happened

A `panic` used to forget where it was written. The BEAM tidies away the frames of calls in tail position, so the crash report pointed at whoever called the function, never at the function itself. Like finding a broken cup and being told only which room it was in.

```pooka
module main

pour(cups: Int) -> Int {
  match cups > 0 {
    True -> cups
    False -> panic as "the kettle is empty"
  }
}

main() {
  echo pour(0)
}
```

```text
$ pooka run
panic: the kettle is empty (src/main.pooka:6)
```

Line 6, where the kettle actually ran dry. The same location appears in test failures, and the runtime's own private frames no longer clutter the trace. Tools can read it too: the error is now `{pooka_panic, Message, Path, Line}`, documented in [BEAM interop](/docs/interop/#panic-locations).

## Families that get along

When two members of one family met the same type parameter, the parameter used to choose whichever arrived first and turn the other away. A `Circle` and a `Square` could not share a list without an annotation to vouch for them.

```pooka
module main

class Shape {}

class Circle is Shape {}

class Square is Shape {}

pair(first: a, second: a) -> List(a) {
  [first, second]
}

main() {
  echo pair(Circle(), Square())
}
```

```text
$ pooka run
src/main.pooka:14
[Circle(), Square()]
```

Now the parameter settles on their nearest common base, here `Shape`. The same is true for callbacks, which is where it mattered most: an actor that sends itself a `Tick` during `init` can keep a handler that accepts any `Clock`.

## Small courtesies

- **`echo` shows who is really there.** A value travelling as its parent is shown as the class it actually is, with its inherited fields in order: `Owl("Ada", 3)`, not a `Creature` in a borrowed coat.
- **`new` can be an ordinary function.** A module may now offer `new(room: String) -> Lantern`, call it locally, import it and pass it around. Class and actor constructors are unchanged.
- **Built-in names stay built in.** Declaring a class called `Int` or an enum called `Result` is refused at the declaration, before it can cause stranger errors elsewhere.
- **Documentation is only yours.** `pooka docs` no longer wanders into your dependencies' modules.

## Quieter, faster builds

Most of this release happened where nobody looks.

- Native Erlang sources compile in batches, with a bounded set of workers, instead of starting a fresh compiler for every module. Diagnostics still come out in source order.
- Unrelated shell variables no longer invalidate your build. Changing your editor does not rebuild your dependencies anymore.
- Unchanged native dependencies are reused after you edit your application, and incremental builds stay usable while dependency headers are still on their way.
- `rebar.config.script` runs in an isolated VM, and a dependency's development-only plugins and hooks are left at its own door.
- Published native packages without an `.app.src` file keep their application metadata.

## Thank you

Almost every item above began as an issue: a small note left beside a broken bridge by someone who stepped on the loose plank first. The [full changelog](https://github.com/pooka-lang/pooka/blob/v0.3.0/CHANGELOG.md) lists them all.

If something still creaks, [tell us](https://github.com/pooka-lang/pooka/issues). We will bring the broom.

— Peregrine Finch
