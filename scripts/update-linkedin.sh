#!/usr/bin/env bash
# Regenerates src/content/twin/linkedin.ts from a LinkedIn PDF export.
# Usage (from the repo root): scripts/update-linkedin.sh path/to/linkedin.pdf
set -euo pipefail

pdf="${1:?Usage: scripts/update-linkedin.sh path/to/linkedin.pdf}"
out="src/content/twin/linkedin.ts"

text=$(uv run --with pypdf python -c \
  "import sys; from pypdf import PdfReader; print(''.join(p.extract_text() or '' for p in PdfReader(sys.argv[1]).pages))" \
  "$pdf")

{
  echo "// David's LinkedIn profile, generated from the LinkedIn PDF export."
  echo "// Don't edit by hand: fix LinkedIn, export the PDF again, then run"
  echo "// scripts/update-linkedin.sh path/to/linkedin.pdf"
  echo 'export const linkedinProfile = `'
  # Drop page footers, decode &amp;, and neutralise characters that would break the template string
  printf '%s\n' "$text" |
        sed -e '/Page [0-9]* of [0-9]*/d' -e 's/&amp;/\&/g' -e "s/\`/'/g" -e 's/\${/$ {/g' \
      -e '/^Summary$/,/^Experience$/{/^Experience$/!d;}'
  echo '`;'
} >"$out"

echo "Updated $out. Check the diff before committing."
