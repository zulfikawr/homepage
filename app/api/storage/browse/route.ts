import { NextRequest } from 'next/server';
import { z } from 'zod';

import {
  apiError,
  apiSuccess,
  handleApiError,
  validateSearchParams,
} from '@/lib/api';
import { getBucket } from '@/lib/cloudflare';

const querySchema = z.object({
  prefix: z.string().optional().default(''),
});

export async function GET(request: NextRequest) {
  try {
    const validation = await validateSearchParams(request, querySchema);
    if ('error' in validation) return validation.error;

    const { prefix } = validation.data;

    const bucket = getBucket();
    if (!bucket) return apiError('Storage configuration missing', 500);

    const items = new Map<
      string,
      {
        type: 'folder' | 'file';
        key: string;
        size?: number;
        uploaded?: string;
      }
    >();

    let cursor: string | undefined;
    let truncated = true;

    while (truncated) {
      const listed = await bucket.list({
        prefix,
        cursor,
        limit: 1000,
        include: ['httpMetadata', 'customMetadata'],
      });

      for (const obj of listed.objects) {
        const relativePath = obj.key.slice(prefix.length);
        const parts = relativePath.split('/');

        if (parts.length > 1) {
          const folderName = parts[0];
          if (folderName && !items.has(folderName)) {
            items.set(folderName, {
              type: 'folder',
              key: prefix + folderName + '/',
            });
          }
        } else if (parts[0]) {
          items.set(parts[0], {
            type: 'file',
            key: obj.key,
            size: obj.size,
            uploaded:
              obj.uploaded instanceof Date
                ? obj.uploaded.toISOString()
                : obj.uploaded,
          });
        }
      }

      truncated = listed.truncated;
      cursor = listed.truncated ? listed.cursor : undefined;
    }

    return apiSuccess({
      prefix,
      items: Array.from(items.values()),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
