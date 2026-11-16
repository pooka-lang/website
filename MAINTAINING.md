# Maintaining pooka.run

How the site is built, where each kind of content lives, and how it is
deployed.

```sh
npm install
npm start          # http://localhost:8080, rebuilds as you edit
npm run build      # writes the site to _site/
```

## Where things live

Each section is a folder of Markdown files. A data file in the folder gives
every file in it the same layout and URL, so adding a page means adding one
file.

| Folder | Becomes | Front matter |
| --- | --- | --- |
| `src/docs/*.md` | `/docs/<file>/` | `title`, `group`, `order`, `summary`, `description`, optional `navTitle` |
| `src/news/*.md` | `/news/<file>/` and `/feed.xml` | `title`, `date`, `kind`, `summary`, optional `listSummary`, `readingTime`, `download` |
| `src/cookbook/*.md` | `/cookbook/<file>/` | `title`, `shelf`, `level`, `order`, `uses`, `card`, optional `summary`, `sample`, `files`, `ingredients`, `draft` |
| `src/tour.md` | `/tour/` | `title`, `heading`, `lede` |

- **Docs:** groups and their order are in `src/_data/docs.json`, which also
  lists the pages that sit in the docs menu but live elsewhere (the tour and
  the cookbook). Link between guides with site paths: `/docs/faq/#where-is-if`.
- **News:** `kind` is one of `src/_data/kinds.json` (release, guide, library,
  community). `draft: true` keeps a post off the site and out of the feed.
- **Cookbook:** `shelf` is a key of `src/_data/shelves.json`. A recipe with
  `draft: true` is listed as "coming soon" without a page; write it, then
  remove the line. `sample: words` shows `src/samples/words.pooka` as the
  recipe's program. A recipe with several files uses a folder,
  `src/samples/first-test/`, and lists them: `files: [src/kettle.pooka,
  test/kettle.spec.pooka]`.
- **Pages:** `src/index.njk`, `src/news.njk`, `src/cookbook.njk`,
  `src/packages.njk` and `src/docs/index.njk`. Layouts and the header and
  footer are in `src/_includes/`.
- **Site settings:** `src/_data/site.json` holds the current version, the
  release notes link, the install command and the navigation.

Markdown is plain Markdown here: it is not run through Nunjucks, because
Pooka code is full of braces.

## Code, output and file trees

Stylesheet and script links carry a stamp of the file's content (`?v=…`), so
browsers pick up a change straight away.

Everything is coloured when the site is built, so pages need no JavaScript to
show code.

- Fenced `pooka`, `erlang`, `elixir`, `gleam` and `lfe` (or `lisp`) blocks are
  highlighted by `lib/highlight.js`.
- Fenced `text` blocks that look like `pooka` output (build, run, test, check,
  errors and warnings) are coloured the way the CLI colours them, by
  `lib/terminal.js`. Lines starting with `$ ` are commands.
- Fenced `text` blocks that look like a file tree get folders in amber and
  notes in grey.
- In templates, `{% sample "hero" %}` inserts a program from `src/samples`, and
  `{% terminal %}…{% endterminal %}` colours output.

The programs in `src/samples` are complete and tested. A program that wants
arguments has a `name.args` file; one that needs packages has a `name.deps`
file, one package per line. A folder is a small project, run with
`pooka test` when it has tests. After a language change, check them all with
the installed compiler; a warning counts as a failure:

```sh
npm run check:samples
```

## Packages

`src/_data/packages.js` asks Hex for every package with the build tool
`pooka` while the site builds, most recently updated first. The deploy workflow rebuilds the
site every six hours, so new packages appear without a commit. In the browser,
`src/js/packages.js` asks Hex again and adds anything published since the last
build. If Hex cannot be reached at build time, the page links to hex.pm and
the build still succeeds.

## Installer

`src/install.sh` is served at `https://pooka.run/install.sh`:

```sh
curl -fsSL https://pooka.run/install.sh | sh
```

It downloads the latest `pooka` and its checksum from GitHub releases,
refuses to install if they differ, puts `pooka` in `~/.local/bin` and adds
that folder to PATH (zsh, bash, fish or `~/.profile`). Optional settings:
`POOKA_VERSION=v0.3.0`, `POOKA_INSTALL_DIR=…`, `POOKA_NO_MODIFY_PATH=1`.

## Analytics

[GoatCounter](https://pooka.goatcounter.com): no cookies and no personal
data, so no consent banner. The script is added only to deployed builds
(`npm run build`), never to `npm start`, and GoatCounter ignores localhost
anyway. `src/js/site.js` also counts two events: copying the install command
(`copy/install`) and copying `pooka add <package>` (`copy/pooka-add/<package>`).
The address is `analytics` in `src/_data/site.json`; remove it to turn
analytics off.

Installs via `curl … | sh` run no JavaScript, so they never appear here.
GitHub counts release downloads instead:

```sh
gh api repos/pooka-lang/pooka/releases --jq '.[] | "\(.tag_name): \(.assets[] | select(.name=="pooka") | .download_count)"'
```

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`, every six hours, and on demand from the Actions tab.
`src/CNAME` sets the domain, `pooka.run`.

GitHub pauses scheduled workflows in repositories with no activity for 60
days; a push, or re-enabling the workflow, starts them again.

## Brand

Colours come from `Pooka-branding/pooka_banner_5x.png` and are CSS variables
at the top of `src/css/style.css`: Midnight `#211C1B`, Lantern Orange
`#FF891F`, Amber Glow `#FFB64B`, Scarf `#D95B17`, Cream `#FFF6E9`, Ember Brown
`#79452F`, Forest `#30463D` and Magic Violet `#75618E`.
