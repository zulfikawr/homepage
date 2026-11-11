#!/usr/bin/env bash
# Export remote Cloudflare D1 + R2 into local/data and local/storage.
# Requires an authenticated wrangler session (`wrangler login`).
set -euo pipefail
cd "$(dirname "$0")/.."

set -a
# shellcheck disable=SC1091
. ./.env
set +a

D1_NAME="${D1_NAME:-homepage-db}"
DB_PATH="${LOCAL_DB_PATH:-./local/data/homepage.db}"
STORAGE_DIR="${LOCAL_STORAGE_DIR:-./local/storage}"
STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p local/backups "$(dirname "$DB_PATH")" "$STORAGE_DIR"

SQL_FILE="local/backups/d1-$STAMP.sql"
echo "Exporting D1 database '$D1_NAME' to $SQL_FILE"
wrangler d1 export "$D1_NAME" --remote --output "$SQL_FILE" --skip-confirmation

TMP_DB="${DB_PATH}.tmp"
rm -f "$TMP_DB"
echo "Importing $SQL_FILE into $DB_PATH"
sqlite3 "$TMP_DB" < "$SQL_FILE"
sqlite3 "$TMP_DB" "PRAGMA integrity_check;" | grep -qx "ok"
rm -f "$DB_PATH" "$DB_PATH-wal" "$DB_PATH-shm"
mv "$TMP_DB" "$DB_PATH"

echo "Downloading R2 objects from '$CLOUDFLARE_BUCKET_NAME' to $STORAGE_DIR"
node - "$STORAGE_DIR" <<'NODE'
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

const outDir = process.argv[2];
const acct = process.env.CLOUDFLARE_ACCOUNT_ID;
const bucket = process.env.CLOUDFLARE_BUCKET_NAME;
const token = process.env.CLOUDFLARE_R2_API_TOKEN;

if (!acct || !bucket || !token) {
  throw new Error('Missing CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_BUCKET_NAME or CLOUDFLARE_R2_API_TOKEN');
}

const base = `https://api.cloudflare.com/client/v4/accounts/${acct}/r2/buckets/${bucket}/objects`;
const encodeKey = (key) => key.split('/').map(encodeURIComponent).join('/');

(async () => {
  let cursor;
  const objects = [];
  do {
    const url = new URL(base);
    url.searchParams.set('per_page', '1000');
    if (cursor) url.searchParams.set('cursor', cursor);
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!data.success) throw new Error(JSON.stringify(data));
    objects.push(...(data.result || []));
    cursor = data.result_info?.cursor;
  } while (cursor);

  let done = 0;
  let bytes = 0;
  const failures = [];

  async function download(object) {
    const dest = path.join(outDir, object.key);
    if (object.key.endsWith('/')) {
      await fsp.mkdir(dest, { recursive: true });
      done++;
      return;
    }
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    const response = await fetch(`${base}/${encodeKey(object.key)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await fsp.writeFile(dest, buffer);
    done++;
    bytes += buffer.length;
    if (done % 10 === 0 || done === objects.length) {
      console.log(`downloaded ${done}/${objects.length} (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
    }
  }

  const queue = [...objects];
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const object = queue.shift();
      try {
        await download(object);
      } catch (error) {
        failures.push({ key: object.key, error: String(error) });
      }
    }
  }));

  fs.writeFileSync(
    path.join('local', 'backups', 'r2-manifest.json'),
    JSON.stringify({ exportedAt: new Date().toISOString(), bucket, objects }, null, 2),
  );

  console.log(`R2 export finished: ${done}/${objects.length} objects, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
  if (failures.length) {
    console.error(failures);
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
NODE

echo "Done."
echo "  SQLite: $DB_PATH"
echo "  Files:  $STORAGE_DIR"
echo "  Backup: $SQL_FILE"
