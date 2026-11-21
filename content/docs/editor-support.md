---
title = "Editor support"
group = "Start here"
order = 3
summary = "Give Pooka a home in Zed, VS Code, Neovim or Emacs."
description = "Install Pooka highlighting and file support in Zed, Visual Studio Code, Neovim and Emacs."
layout = "doc"
permalink = "/docs/editor-support/"
---
A little colour makes a new language feel at home. Pooka has independent packages for Zed, Visual Studio Code, Neovim and Emacs.

All four recognise `.pooka` and `.spec.pooka` files. These packages provide syntax highlighting and editor conveniences; they do not start a compiler or language server. Run `pooka check`, `pooka test` and `pooka format` in your terminal.

| Editor | Package | Highlights |
| --- | --- | --- |
| Zed | [pooka-zed](https://github.com/pooka-lang/pooka-zed) | Tree-sitter highlighting, brackets, indentation, outlines and file icons |
| Visual Studio Code | [pooka-vscode](https://github.com/pooka-lang/pooka-vscode) | TextMate highlighting, brackets and file icons |
| Neovim | [pooka-nvim](https://github.com/pooka-lang/pooka-nvim) | Tree-sitter highlighting with a regex fallback |
| Emacs | [pooka-emacs](https://github.com/pooka-lang/pooka-emacs) | Tree-sitter font-lock with a regex fallback |

`pooka.toml` is TOML. Keep your editor's usual TOML support for the project file.

## Zed

Clone the extension:

```sh
git clone https://github.com/pooka-lang/pooka-zed.git
```

In Zed, open the Extensions panel, choose **Install Dev Extension**, and select the cloned `pooka-zed` directory. Zed builds the pinned Pooka grammar. Open a `.pooka` file and check that the language selector says **Pooka**.

For the Pooka file icon, open the icon theme selector and choose **Pooka** or **Pooka Light**. The extension includes both variants.

The package also has a standalone builder for checking queries and preparing the grammar before installation. See its [build instructions](https://github.com/pooka-lang/pooka-zed#install-locally) for the Tree-sitter CLI and WASI SDK requirements.

## Visual Studio Code

Build an installable extension from source. You need Git, Node.js 22 or newer, and npm:

```sh
git clone https://github.com/pooka-lang/pooka-vscode.git
cd pooka-vscode
npm ci
npm test
npm run package
code --install-extension pooka-0.1.0.vsix
```

If the `code` command is unavailable, open the command palette, choose **Extensions: Install from VSIX**, and select the generated `.vsix` file. Later versions may produce a different filename; use the one printed by `npm run package`.

Open a Pooka source or spec file. VS Code should select **Pooka** automatically. This extension uses a TextMate grammar, so no Tree-sitter installation is needed.

## Neovim

Install the plugin as a native Neovim package:

```sh
git clone https://github.com/pooka-lang/pooka-nvim.git \
  ~/.local/share/nvim/site/pack/plugins/start/pooka-nvim
```

This is the usual Unix data directory. If you customise `XDG_DATA_HOME`, or use Windows, find your data directory with `:echo stdpath('data')` and put the plugin under `site/pack/plugins/start/pooka-nvim` there. A plugin manager can also load `pooka-lang/pooka-nvim`.

Enable filetype plugins and syntax in your configuration:

```lua
vim.cmd("filetype plugin indent on")
vim.cmd("syntax enable")
```

Regex highlighting works immediately. For Tree-sitter highlighting, use Neovim 0.10 or newer and install Git, the Tree-sitter CLI and a C compiler. Then run:

```vim
:PookaInstallGrammar
```

The command fetches and compiles the pinned grammar in Neovim's own data directory. Restart Neovim afterwards. The plugin keeps its regex fallback when the parser is unavailable.

## Emacs

Use Emacs 29.1 or newer. Clone the mode into your Emacs configuration directory:

```sh
git clone https://github.com/pooka-lang/pooka-emacs.git \
  ~/.emacs.d/site-lisp/pooka-emacs
```

If you use a different configuration directory, place `site-lisp/pooka-emacs` under your `user-emacs-directory` instead. Add this to your init file:

```elisp
(add-to-list 'load-path
             (expand-file-name "site-lisp/pooka-emacs" user-emacs-directory))
(require 'pooka-mode)
```

The mode selects Pooka source and spec files automatically. Regex font-lock works without a parser.

For Tree-sitter highlighting, your Emacs build must support Tree-sitter. Install Git, the Tree-sitter CLI and a C compiler, then run `M-x pooka-install-grammar` or press `C-c C-i` in a Pooka buffer. The mode downloads its own pinned grammar and generates an ABI-compatible parser. Reopen your Pooka buffers afterwards.

## Using another editor

The [Tree-sitter grammar](https://github.com/pooka-lang/tree-sitter-pooka) is available separately, with highlighting queries and a generated parser. It can provide the starting point for another editor package.

Editor support does not change how a project builds. The [CLI reference](/docs/cli/) covers checking, formatting, testing and running your code from any terminal.
