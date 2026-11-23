# Maintaining pooka.run

Install Pooka 0.4.0 and Erlang/OTP 29, then run these commands from the site
checkout:

```sh
pooka deps download
pooka run -- serve
pooka test
pooka run -- check --environment production
pooka run -- build --environment production
```

The preview runs on port 4175 and production files go to `public/`. The
small entry point in `src/main.pooka` registers the Hex package catalogue
provider. The rest of the site is built by the pinned Jinks dependency.

## Content and templates

- `content/docs/` holds the guides. Set their group and display order in TOML
  front matter. The templates read the guide collection to build navigation.
- `content/tour.md` is the language tour.
- `content/cookbook/` holds recipes, with recipe shelves and levels defined
  under `data/`. Entries listed as coming soon live in `data/coming_soon.json`.
- `content/news/` holds release notes and articles. Published articles appear
  in the RSS feed.
- `themes/pooka/` contains the Tuck layouts, and `config.toml` holds site
  settings, including the compiler version and release link.
- `samples/` contains runnable code. Sidecar `.args` and `.deps` files supply
  arguments and dependencies. Run `./scripts/check-samples.sh` with the
  installed compiler after changing them.
- `static/` holds the installer, images, stylesheets, and browser JavaScript.

## Packages and deployment

The build fetches the package catalogue from Hex through `src/catalogue.pooka`.
It bounds requests, caches results for one hour, and leaves the page usable
if Hex is unavailable. The browser can refresh the catalogue independently.

GitHub Actions checks and builds pull requests. It deploys `public/` to
GitHub Pages from `main`, every six hours, and on manual runs. Pooka's custom
domain remains `pooka.run`. Analytics is enabled only for production builds.
