import { NextRequest, NextResponse } from 'next/server';

import { getBucket } from '@/lib/cloudflare';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ key: string[] }> },
) {
  try {
    const { key: keyParts } = await context.params;
    // Join the path parts to reconstruct the R2 key (e.g. ["projects", "slug", "img.png"] -> "projects/slug/img.png")
    const key = keyParts.join('/');

    const bucket = getBucket();
    if (!bucket) {
      // Fallback: If no bucket binding, redirect to the public R2 domain
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
      const mimes: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        gif: 'image/gif',
        mp3: 'audio/mpeg',
        pdf: 'application/pdf',
      };
      if (ext && mimes[ext]) headers.set('Content-Type', mimes[ext]);
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
