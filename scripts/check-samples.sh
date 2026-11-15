#!/bin/sh
# Compile and run every program in src/samples with the installed `pooka`,
# so the code on the site is code that works, without warnings. Run before a release:
#
#   npm run check:samples
set -eu

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT INT TERM

cd "$work"
pooka new samples >/dev/null
cd samples
printf 'the owl and the moon\nthe lamp and the owl\nthe end\n' > poem.txt

status=0
for sample in "$root"/src/samples/*.pooka; do
  name=$(basename "$sample" .pooka)
  cp "$sample" src/main.pooka
  if output=$(NO_COLOR=1 pooka run 2>&1) && ! printf '%s' "$output" | grep -q '^warning:'; then
    printf '  ok    %s\n' "$name"
  else
    printf '  FAIL  %s\n%s\n' "$name" "$output"
    status=1
  fi
done
exit $status
