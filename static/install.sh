#!/bin/sh
# Install Pooka on macOS or Linux.
#
#   curl -fsSL https://pooka.run/install.sh | sh
#
# Downloads the latest `pooka` from GitHub releases, checks it against the
# published SHA-256 checksum, puts it in ~/.local/bin and makes sure that
# folder is on your PATH.
#
# Settings, all optional:
#   POOKA_VERSION=v0.3.0         a release tag instead of the latest
#   POOKA_INSTALL_DIR=/some/bin  where to put `pooka` (default ~/.local/bin)
#   POOKA_NO_MODIFY_PATH=1       never edit shell startup files
#
# Windows: follow the installation guide, https://pooka.run/docs/install/#3-install-pooka-on-windows

set -eu

REPO="pooka-lang/pooka"
VERSION="${POOKA_VERSION:-latest}"
INSTALL_DIR="${POOKA_INSTALL_DIR:-$HOME/.local/bin}"

if [ -t 1 ]; then
  ORANGE=$(printf '\033[1;38;2;255;137;31m')
  GREEN=$(printf '\033[1;38;2;97;175;111m')
  RED=$(printf '\033[1;38;2;217;91;23m')
  DIM=$(printf '\033[38;2;139;148;168m')
  RESET=$(printf '\033[0m')
else
  ORANGE="" GREEN="" RED="" DIM="" RESET=""
fi

say() { printf '%s%12s%s %s\n' "$ORANGE" "$1" "$RESET" "$2"; }
fail() {
  printf '%serror%s: %s\n' "$RED" "$RESET" "$1" >&2
  exit 1
}

case "$(uname -s)" in
  Darwin | Linux) ;;
  *) fail "this script is for macOS and Linux. On Windows, follow https://pooka.run/docs/install/#3-install-pooka-on-windows" ;;
esac

# --- Tools ---------------------------------------------------------------

if command -v curl >/dev/null 2>&1; then
  fetch() { curl -fsSL --retry 3 -o "$2" "$1"; }
elif command -v wget >/dev/null 2>&1; then
  fetch() { wget -q -O "$2" "$1"; }
else
  fail "curl or wget is needed to download Pooka"
fi

if command -v sha256sum >/dev/null 2>&1; then
  sha256() { sha256sum "$1" | cut -d ' ' -f 1; }
elif command -v shasum >/dev/null 2>&1; then
  sha256() { shasum -a 256 "$1" | cut -d ' ' -f 1; }
else
  fail "sha256sum or shasum is needed to check the download"
fi

# --- Download and check ----------------------------------------------------

if [ "$VERSION" = "latest" ]; then
  BASE="https://github.com/$REPO/releases/latest/download"
else
  BASE="https://github.com/$REPO/releases/download/$VERSION"
fi

TMP=$(mktemp -d 2>/dev/null || mktemp -d -t pooka)
trap 'rm -rf "$TMP"' EXIT INT TERM

say "Downloading" "pooka ($VERSION)"
fetch "$BASE/pooka" "$TMP/pooka" || fail "could not download $BASE/pooka"
fetch "$BASE/pooka.sha256" "$TMP/pooka.sha256" || fail "could not download $BASE/pooka.sha256"

EXPECTED=$(cut -d ' ' -f 1 <"$TMP/pooka.sha256")
ACTUAL=$(sha256 "$TMP/pooka")
[ -n "$EXPECTED" ] && [ "$EXPECTED" = "$ACTUAL" ] ||
  fail "checksum mismatch: expected $EXPECTED, got $ACTUAL. Nothing was installed."
say "Verified" "SHA-256 $DIM$ACTUAL$RESET"

# --- Install ---------------------------------------------------------------

mkdir -p "$INSTALL_DIR"
chmod +x "$TMP/pooka"
mv "$TMP/pooka" "$INSTALL_DIR/pooka"
say "Installed" "$INSTALL_DIR/pooka"

# --- PATH ------------------------------------------------------------------

on_path() {
  case ":$PATH:" in
    *":$1:"*) return 0 ;;
    *) return 1 ;;
  esac
}

NEW_SHELL=""
if ! on_path "$INSTALL_DIR"; then
  case "$(basename "${SHELL:-sh}")" in
    zsh) RC="${ZDOTDIR:-$HOME}/.zshrc"; LINE="export PATH=\"$INSTALL_DIR:\$PATH\"" ;;
    bash)
      if [ "$(uname -s)" = "Darwin" ]; then RC="$HOME/.bash_profile"; else RC="$HOME/.bashrc"; fi
      LINE="export PATH=\"$INSTALL_DIR:\$PATH\"" ;;
    fish) RC="$HOME/.config/fish/config.fish"; LINE="fish_add_path \"$INSTALL_DIR\"" ;;
    *) RC="$HOME/.profile"; LINE="export PATH=\"$INSTALL_DIR:\$PATH\"" ;;
  esac
  if [ "${POOKA_NO_MODIFY_PATH:-}" = "1" ]; then
    printf '\nAdd %s to your PATH:\n  %s\n' "$INSTALL_DIR" "$LINE"
  elif [ -f "$RC" ] && grep -qsF "$LINE" "$RC"; then
    NEW_SHELL=1
  else
    mkdir -p "$(dirname "$RC")"
    printf '\n# Pooka\n%s\n' "$LINE" >>"$RC"
    say "Updated" "$RC"
    NEW_SHELL=1
  fi
fi

# --- Erlang ----------------------------------------------------------------

if command -v erl >/dev/null 2>&1; then
  OTP=$(erl -noshell -eval 'io:format("~s", [erlang:system_info(otp_release)]), halt().' 2>/dev/null || echo "?")
  case "$OTP" in
    '' | *[!0-9]*) printf '\n%sNote:%s could not tell which Erlang/OTP is installed. Pooka needs 29.\n' "$ORANGE" "$RESET" ;;
    *) [ "$OTP" -ge 29 ] ||
      printf '\n%sNote:%s Pooka needs Erlang/OTP 29, and this machine has %s. Update Erlang before running it.\n' "$ORANGE" "$RESET" "$OTP" ;;
  esac
else
  printf '\n%sNote:%s Pooka runs on Erlang/OTP 29, which is not installed yet.\n' "$ORANGE" "$RESET"
  if [ "$(uname -s)" = "Darwin" ]; then
    printf '  brew install erlang\n'
  else
    printf '  Use your package manager, or mise or asdf if its Erlang is older than 29.\n'
  fi
fi

printf '\n%s✓%s Pooka is ready.' "$GREEN" "$RESET"
if [ -n "$NEW_SHELL" ]; then
  printf ' Open a new terminal, then run:\n'
else
  printf ' Try:\n'
fi
printf '  pooka new lantern && cd lantern && pooka run\n'
