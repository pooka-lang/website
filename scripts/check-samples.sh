#!/bin/sh
# Compile and run every program in samples with the installed `pooka`,
# so the code on the site is code that works, without warnings.
#
#   ./scripts/check-samples.sh
#
# - name.pooka            runs as src/main.pooka
# - name.args             arguments to pass, if the program wants some
# - name.deps             packages to `pooka add` first, one per line
# - name/                 a small project (src/…, test/…); runs `pooka test`
#                         when it has tests, `pooka run` otherwise
set -eu

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
samples="$root/samples"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT INT TERM
status=0

fresh() {
  rm -rf "$work/sample"
  (cd "$work" && pooka new sample >/dev/null)
  rm -f "$work/sample/test/main.spec.pooka"
}

report() {
  if [ "$1" -eq 0 ] && ! printf '%s' "$3" | grep -q '^warning:'; then
    printf '  ok    %s\n' "$2"
  else
    printf '  FAIL  %s\n%s\n' "$2" "$3"
    status=1
  fi
}

for sample in "$samples"/*.pooka; do
  name=$(basename "$sample" .pooka)
  fresh
  cd "$work/sample"
  printf 'the owl and the moon\nthe lamp and the owl\nthe end\n' > poem.txt
  cp "$sample" src/main.pooka
  if [ -f "$samples/$name.deps" ]; then
    while read -r dep; do [ -n "$dep" ] && pooka add "$dep" >/dev/null 2>&1; done < "$samples/$name.deps"
  fi
  args=""
  [ -f "$samples/$name.args" ] && args=$(cat "$samples/$name.args")
  set +e
  # shellcheck disable=SC2086
  output=$(NO_COLOR=1 pooka run -- $args 2>&1)
  code=$?
  set -e
  report "$code" "$name" "$output"
done

for dir in "$samples"/*/; do
  name=$(basename "$dir")
  fresh
  cp -R "$dir". "$work/sample/"
  cd "$work/sample"
  if [ -d test ] && [ -n "$(ls test)" ]; then command=test; else command=run; fi
  set +e
  output=$(NO_COLOR=1 pooka $command 2>&1)
  code=$?
  set -e
  report "$code" "$name" "$output"
done

exit $status
