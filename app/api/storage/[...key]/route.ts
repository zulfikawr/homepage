import { NextRequest, NextResponse } from 'next/server';

import { getBucket } from '@/lib/cloudflare';

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  mp3: 'audio/mpeg',
  pdf: 'application/pdf',
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ key: string[] }> },
) {
  try {
    const { key: keyParts } = await context.params;
    const key = keyParts.join('/');

    const bucket = getBucket();
    if (!bucket) {
      const r2Domain = process.env.NEXT_PUBLIC_R2_DOMAIN || 'r2.zulfikar.site';
      const publicUrl = `https://${r2Domain}/${key}`;
      return NextResponse.redirect(publicUrl);
    }

    const object = await bucket.get(key);

    if (!object) {
      return new Response('File not found', { status: 404 });
    }

    const headers = new Headers();
    try {
      object.writeHttpMetadata(headers);
    } catch {
      // Ignore
    }

    if (!headers.has('Content-Type')) {
      const ext = key.split('.').pop()?.toLowerCase();
      if (ext && MIME_TYPES[ext]) {
        headers.set('Content-Type', MIME_TYPES[ext]);
      }
    }

    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[Storage API Error]:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
