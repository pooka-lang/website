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

All four recognise `.pooka` and `.spec.pooka` files. Zed and Visual Studio Code can start the Pooka language server. Neovim and Emacs can connect through their built-in LSP clients. Run `pooka check`, `pooka test` and `pooka format` from any terminal.

| Editor | Package | Highlights |
| --- | --- | --- |
| Zed | [pooka-zed](https://github.com/pooka-lang/pooka-zed) | Tree-sitter highlighting, language server, brackets, indentation, outlines and file icons |
| Visual Studio Code | [pooka-vscode](https://github.com/pooka-lang/pooka-vscode) | TextMate highlighting, language server, brackets and file icons |
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

### Language server

Install a compiler build that includes `pooka lsp` and use a Pooka Zed extension that includes the language server adapter. Open the folder containing `pooka.toml` in Zed. The adapter finds `pooka` on Zed's PATH and starts it automatically when you open a Pooka source or spec file.

The server checks unsaved edits, formats documents, provides an outline, and supports **Go to Definition**. Place the cursor on a name and press **F12**, or run `editor: go to definition` from the command palette.

To format on save, add this to your Zed settings:

```json
{
  "languages": {
    "Pooka": {
      "formatter": "language_server",
      "format_on_save": "on"
    }
  }
}
```

If Zed cannot find the compiler, set `lsp.pooka.binary.path` in Zed's settings to the absolute path of your `pooka` executable.

The server checks projects offline. Run `pooka deps download` from the project root to fetch missing dependencies, then save an open Pooka file to refresh diagnostics. After upgrading the compiler or changing its path, run `editor: restart language server` from the command palette with a Pooka file open.

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

For the language server, install a compiler that includes `pooka lsp` and open a trusted workspace with a Pooka file. VS Code starts the server automatically. Set `pooka.languageServer.path` in User Settings if VS Code cannot find the executable, then reload the window. The extension README shows format-on-save settings. [VS Code language server setup](https://github.com/pooka-lang/pooka-vscode#language-server)

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

On Neovim 0.11 or newer, register `pooka lsp` with the built-in client. [Neovim language server setup](https://github.com/pooka-lang/pooka-nvim#language-server)

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

Use Eglot to connect to `pooka lsp`. [Emacs language server setup](https://github.com/pooka-lang/pooka-emacs#language-server)

## Using another editor

The [Tree-sitter grammar](https://github.com/pooka-lang/tree-sitter-pooka) is available separately, with highlighting queries and a generated parser. It can provide the starting point for another editor package.

Editor support does not change how a project builds. The [CLI reference](/docs/cli/) covers checking, formatting, testing and running your code from any terminal.
