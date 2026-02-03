import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || '';

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const bucketName = process.env.CLOUDFLARE_BUCKET_NAME || 'zulfikar-storage';
    const apiToken = process.env.CLOUDFLARE_R2_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 500 },
      );
    }

    let allObjects: Array<{ key: string; size: number; uploaded: string }> = [];
    let cursor: string | undefined = undefined;
    let truncated = true;

    while (truncated) {
      const url = new URL(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects`,
      );
      if (prefix) url.searchParams.set('prefix', prefix);
      if (cursor) url.searchParams.set('cursor', cursor);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        return NextResponse.json(
          { error: `R2 API Error: ${text}` },
          { status: response.status },
        );
      }

      const data = (await response.json()) as {
        result?: Array<{ key: string; size: number; uploaded: string }>;
        result_info?: { cursor?: string };
        success: boolean;
      };

      if (data.result) {
        allObjects = allObjects.concat(data.result);
      }

      cursor = data.result_info?.cursor;
      truncated = !!cursor;
    }

    const objects = allObjects;

    // Filter by prefix and organize into folders/files
    const filtered = objects.filter((obj) => obj.key.startsWith(prefix));

    // Group by immediate subfolder or file
    const items = new Map<
      string,
      {
        type: 'folder' | 'file';
        key: string;
        size?: number;
        uploaded?: string;
      }
    >();

    for (const obj of filtered) {
      const relativePath = obj.key.slice(prefix.length);
      const parts = relativePath.split('/');

      if (parts.length > 1) {
        // It's in a subfolder
        const folderName = parts[0];
        if (!items.has(folderName)) {
          items.set(folderName, {
            type: 'folder',
            key: prefix + folderName + '/',
          });
        }
      } else if (parts[0]) {
        // It's a file in current directory
        items.set(parts[0], {
          type: 'file',
          key: obj.key,
          size: obj.size,
          uploaded: obj.uploaded,
        });
      }
    }

    return NextResponse.json({
      prefix,
      items: Array.from(items.values()),
    });
  } catch (error) {
    console.error('Browse error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
