#!/usr/bin/env bash
# Run a Lighthouse performance audit against a running production server.
# Usage: bun run perf [url]
set -euo pipefail

URL="${1:-http://localhost:3000}"
OUT="/tmp/homepage-lighthouse.json"
CHROME_PATH="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

CHROME_PATH="$CHROME_PATH" bunx lighthouse "$URL" \
  --output=json \
  --output-path="$OUT" \
  --only-categories=performance \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --quiet

node - "$OUT" <<'NODE'
const fs = require('node:fs');
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const a = r.audits;
const show = (key) => a[key]?.displayValue ?? '-';
console.log('\nPerformance score:', Math.round(r.categories.performance.score * 100));
for (const key of [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
  'interactive',
  'total-byte-weight',
]) {
  console.log(`${key}: ${show(key)}`);
}
NODE
