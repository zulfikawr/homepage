import { NextRequest } from 'next/server';
import { z } from 'zod';

import {
  apiError,
  apiSuccess,
  handleApiError,
  validateSearchParams,
} from '@/lib/api';

const querySchema = z.object({
  prefix: z.string().optional().default(''),
});

interface R2Object {
  key: string;
  size: number;
  uploaded: string;
}

interface R2Response {
  result?: R2Object[];
  result_info?: { cursor?: string };
  success: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const validation = await validateSearchParams(request, querySchema);
    if ('error' in validation) return validation.error;

    const { prefix } = validation.data;

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const bucketName = process.env.CLOUDFLARE_BUCKET_NAME || 'zulfikar-storage';
    const apiToken = process.env.CLOUDFLARE_R2_API_TOKEN;

    if (!accountId || !apiToken) {
      return apiError('Missing credentials', 500);
    }

    let allObjects: R2Object[] = [];
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
        return apiError(`R2 API Error: ${text}`, response.status);
      }

      const data = (await response.json()) as R2Response;

      if (data.result) {
        allObjects = allObjects.concat(data.result);
      }

      cursor = data.result_info?.cursor;
      truncated = !!cursor;
    }

    const filtered = allObjects.filter((obj) => obj.key.startsWith(prefix));

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
        const folderName = parts[0];
        if (!items.has(folderName)) {
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
          uploaded: obj.uploaded,
        });
      }
    }

    return apiSuccess({
      prefix,
      items: Array.from(items.values()),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
