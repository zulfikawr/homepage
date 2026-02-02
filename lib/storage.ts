/**
 * Generates a URL for a file.
 * Now simplified for Cloudflare R2 / D1 migration.
 *
 * @param record - Context record (unused but kept for signature compatibility)
 * @param fileName - The name or URL of the file
 * @returns The full URL to the file
 */
export function getFileUrl(
  record: Record<string, unknown>,
  fileName: string,
): string {
  if (!fileName) return '';

  // If it's already a full URL or absolute path, return it
  if (fileName.startsWith('http') || fileName.startsWith('/')) {
    return fileName;
  }

  return `/api/storage/${fileName}`;
}
