import { NextRequest } from 'next/server';
import { z } from 'zod';

import {
  apiError,
  apiSuccess,
  handleApiError,
  validateRequest,
  validateSearchParams,
} from '@/lib/api';
import { getBucket } from '@/lib/cloudflare';

const uploadSchema = z.object({
  file: z.instanceof(File),
  key: z.string().min(1),
});

const deleteSchema = z.object({
  key: z.string().min(1),
});

const renameSchema = z.object({
  action: z.literal('rename'),
  oldKey: z.string().min(1),
  newKey: z.string().min(1),
});

const createFolderSchema = z.object({
  action: z.literal('create-folder'),
  key: z.string().min(1),
});

const putSchema = z.union([renameSchema, createFolderSchema]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const key = formData.get('key') as string | null;

    const validation = uploadSchema.safeParse({ file, key });
    if (!validation.success) {
      return apiError('File and key are required', 400);
    }

    const bucket = getBucket();
    if (!bucket) return apiError('Storage configuration missing', 500);

    const arrayBuffer = await validation.data.file.arrayBuffer();
    await bucket.put(validation.data.key, arrayBuffer, {
      httpMetadata: { contentType: validation.data.file.type },
    });

    return apiSuccess({ key: validation.data.key });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const validation = await validateSearchParams(request, deleteSchema);
    if ('error' in validation) return validation.error;

    const { key } = validation.data;

    const bucket = getBucket();
    if (!bucket) return apiError('Storage configuration missing', 500);

    await bucket.delete(key);

    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const validation = await validateRequest(request, putSchema);
    if ('error' in validation) return validation.error;

    const data = validation.data;

    const bucket = getBucket();
    if (!bucket) return apiError('Storage configuration missing', 500);

    if (data.action === 'rename') {
      const object = await bucket.get(data.oldKey);
      if (!object) return apiError('Source file not found', 404);

      await bucket.put(data.newKey, object.body, {
        httpMetadata: object.httpMetadata,
        customMetadata: object.customMetadata,
      });

      await bucket.delete(data.oldKey);

      return apiSuccess({ renamed: true });
    } else {
      const key = data.key.endsWith('/') ? data.key : `${data.key}/`;
      await bucket.put(key, new Uint8Array(0));
      return apiSuccess({ created: true });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
