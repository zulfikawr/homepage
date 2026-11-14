import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_STORAGE_DIR = path.join(process.cwd(), 'local', 'storage');

const MIME_TYPES: Record<string, string> = {
  avif: 'image/avif',
  bin: 'application/octet-stream',
  gif: 'image/gif',
  html: 'text/html; charset=utf-8',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  json: 'application/json',
  m4a: 'audio/mp4',
  md: 'text/markdown; charset=utf-8',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  txt: 'text/plain; charset=utf-8',
  webm: 'video/webm',
  webp: 'image/webp',
  woff: 'font/woff',
  woff2: 'font/woff2',
  xml: 'application/xml',
};

let localBucket: LocalR2Bucket | null = null;

export function getLocalStoragePath(): string {
  const configured = process.env.LOCAL_STORAGE_DIR;
  return configured
    ? path.resolve(/* turbopackIgnore: true */ process.cwd(), configured)
    : DEFAULT_STORAGE_DIR;
}

function contentTypeFor(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase() || '';
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function resolveKey(root: string, key: string): string {
  const cleaned = key.replace(/\\/g, '/').replace(/^\/+/, '');
  const segments = cleaned.split('/');
  if (segments.some((segment) => segment === '..')) {
    throw new Error(`Invalid storage key: ${key}`);
  }
  const fullPath = path.resolve(/* turbopackIgnore: true */ root, cleaned);
  if (fullPath !== root && !fullPath.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Invalid storage key: ${key}`);
  }
  return fullPath;
}

async function toBuffer(
  value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob,
): Promise<Buffer> {
  if (value === null) return Buffer.alloc(0);
  if (typeof value === 'string') return Buffer.from(value);
  if (value instanceof Blob) return Buffer.from(await value.arrayBuffer());
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  if (ArrayBuffer.isView(value)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  }

  const reader = value.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value: chunk } = await reader.read();
    if (done) break;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function fileEtag(stat: fs.Stats): string {
  return `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
}

function objectFromStat(
  key: string,
  stat: fs.Stats,
  contentTypeOverride?: string,
): R2Object {
  const contentType = contentTypeOverride || contentTypeFor(key);
  const etag = fileEtag(stat);
  return {
    key,
    version: etag,
    size: stat.size,
    etag: etag.replace(/^W\//, '').replace(/"/g, ''),
    httpEtag: etag,
    checksums: { toJSON: () => ({}) },
    uploaded: stat.mtime,
    httpMetadata: { contentType },
    customMetadata: {},
    storageClass: 'STANDARD',
    writeHttpMetadata(headers: Headers | R2HTTPMetadata) {
      if (headers instanceof Headers) {
        headers.set('Content-Type', contentType);
        headers.set('ETag', etag);
        headers.set('Last-Modified', stat.mtime.toUTCString());
      } else {
        headers.contentType = contentType;
      }
    },
  } as R2Object;
}

export class LocalR2Bucket implements R2Bucket {
  constructor(readonly root: string) {}

  async put(
    key: string,
    value:
      ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob,
    options?: R2PutOptions,
  ): Promise<R2Object> {
    const target = resolveKey(this.root, key);

    if (key.endsWith('/')) {
      await fsp.mkdir(target, { recursive: true });
      const stat = await fsp.stat(target);
      return objectFromStat(key, stat);
    }

    await fsp.mkdir(path.dirname(target), { recursive: true });
    const buffer = await toBuffer(value);
    await fsp.writeFile(target, buffer);

    const stat = await fsp.stat(target);
    const httpMetadata = options?.httpMetadata;
    const contentType =
      httpMetadata instanceof Headers
        ? (httpMetadata.get('content-type') ?? undefined)
        : httpMetadata?.contentType;
    return objectFromStat(key, stat, contentType);
  }

  async get(key: string): Promise<R2ObjectBody | null> {
    const target = resolveKey(this.root, key);

    let stat: fs.Stats;
    try {
      stat = await fsp.stat(target);
    } catch {
      return null;
    }
    if (!stat.isFile()) return null;

    const buffer = await fsp.readFile(target);
    const object = objectFromStat(key, stat);

    return {
      ...object,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(buffer));
          controller.close();
        },
      }),
      arrayBuffer: async () => {
        const bytes = new Uint8Array(buffer);
        return bytes.buffer;
      },
      text: async () => new TextDecoder().decode(buffer),
      json: async () => JSON.parse(new TextDecoder().decode(buffer)),
      blob: async () => new Blob([new Uint8Array(buffer)]),
    } as R2ObjectBody;
  }

  async head(key: string): Promise<R2Object | null> {
    const target = resolveKey(this.root, key);
    try {
      const stat = await fsp.stat(target);
      if (!stat.isFile()) return null;
      return objectFromStat(key, stat);
    } catch {
      return null;
    }
  }

  async delete(keys: string | string[]): Promise<void> {
    const list = Array.isArray(keys) ? keys : [keys];
    await Promise.all(
      list.map(async (key) => {
        const target = resolveKey(this.root, key);
        await fsp.rm(target, { recursive: true, force: true });
      }),
    );
  }

  async list(options: R2ListOptions = {}): Promise<R2Objects> {
    const prefix = options.prefix ?? '';
    const limit = options.limit ?? 1000;
    const start = options.cursor ? Number(options.cursor) : 0;
    const root = this.root;

    const keys: string[] = [];
    async function walk(dir: string, relative: string) {
      let entries: fs.Dirent[];
      try {
        entries = await fsp.readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const childRelative = relative
          ? `${relative}/${entry.name}`
          : entry.name;
        const child = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          // Mirror R2's folder markers so empty folders show up in listings.
          keys.push(`${childRelative}/`);
          await walk(child, childRelative);
        } else if (entry.isFile()) {
          keys.push(childRelative);
        }
      }
    }
    await walk(root, '');

    const filtered = keys.filter((key) => key.startsWith(prefix)).sort();
    const page = filtered.slice(start, start + limit);
    const truncated = start + page.length < filtered.length;

    const objects = await Promise.all(
      page.map(async (key) => {
        const stat = await fsp.stat(resolveKey(root, key));
        return objectFromStat(key, stat);
      }),
    );

    return {
      objects,
      truncated,
      cursor: truncated ? String(start + page.length) : undefined,
      delimitedPrefixes: [],
    } as R2Objects;
  }

  async createMultipartUpload(): Promise<R2MultipartUpload> {
    throw new Error('Multipart uploads are not supported by local storage.');
  }

  resumeMultipartUpload(): R2MultipartUpload {
    throw new Error('Multipart uploads are not supported by local storage.');
  }
}

export function getLocalBucket(): R2Bucket {
  if (!localBucket) {
    const root = getLocalStoragePath();
    fs.mkdirSync(root, { recursive: true });
    console.log(`[Local R2] Using local object storage at ${root}`);
    localBucket = new LocalR2Bucket(root);
  }
  return localBucket;
}
