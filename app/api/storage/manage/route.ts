import { NextRequest, NextResponse } from 'next/server';

import { getBucket } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const key = formData.get('key') as string;

    if (!file || !key) {
      return NextResponse.json(
        { error: 'File and key are required' },
        { status: 400 },
      );
    }

    const bucket = getBucket();
    if (!bucket) {
      return NextResponse.json(
        { error: 'Storage configuration missing' },
        { status: 500 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const bucket = getBucket();
    if (!bucket) {
      return NextResponse.json(
        { error: 'Storage configuration missing' },
        { status: 500 },
      );
    }

    // Check if it's a folder (ends with /)
    // If it's a folder, we technically should delete all contents?
    // For safety, let's just delete the specific key for now.
    // The UI should handle recursive delete if needed or we can enhance this later.
    // Actually, for R2, if it's a "folder" it might just be a prefix.
    // If the user wants to delete a folder, they probably want to delete all files with that prefix.

    // For now, simple delete of single object.
    await bucket.delete(key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

interface PutRequestBody {
  action: 'rename' | 'create-folder';
  oldKey?: string;
  newKey?: string;
  key?: string;
}

export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json()) as PutRequestBody;
    const { action, oldKey, newKey } = data;

    const bucket = getBucket();
    if (!bucket) {
      return NextResponse.json(
        { error: 'Storage configuration missing' },
        { status: 500 },
      );
    }

    if (action === 'rename') {
      if (!oldKey || !newKey) {
        return NextResponse.json(
          { error: 'oldKey and newKey are required' },
          { status: 400 },
        );
      }

      const object = await bucket.get(oldKey);
      if (!object) {
        return NextResponse.json(
          { error: 'Source file not found' },
          { status: 404 },
        );
      }

      await bucket.put(newKey, object.body, {
        httpMetadata: object.httpMetadata,
        customMetadata: object.customMetadata,
      });

      await bucket.delete(oldKey);

      return NextResponse.json({ success: true });
    } else if (action === 'create-folder') {
      const { key } = data;
      if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 });
      }
      // Create 0-byte object with trailing slash
      await bucket.put(key.endsWith('/') ? key : `${key}/`, new Uint8Array(0));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Operation error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
