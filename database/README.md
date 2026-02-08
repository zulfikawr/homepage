# Database Layer Documentation

## Standardized CRUD Naming Convention

All database operations follow a consistent naming pattern:

### Naming Rules

- **`get[Resource]()`** - Fetch a single resource by ID
- **`get[Resources]()`** - Fetch multiple resources (list/all)
- **`create[Resource]()`** - Create a new resource
- **`update[Resource]()`** - Update an existing resource
- **`delete[Resource]()`** - Delete a resource

### Examples

```typescript
// Single resource
getPost(id: string): Promise<Post | null>
getProject(id: string): Promise<Project | null>

// Multiple resources
getPosts(): Promise<Post[]>
getProjects(): Promise<Project[]>

// Create
createPost(data: PostData): Promise<{ success: boolean; data?: Post; error?: string }>
createProject(data: ProjectData): Promise<{ success: boolean; data?: Project; error?: string }>

// Update
updatePost(id: string, data: Partial<PostData>): Promise<{ success: boolean; data?: Post; error?: string }>
updateProject(id: string, data: Partial<ProjectData>): Promise<{ success: boolean; data?: Project; error?: string }>

// Delete
deletePost(id: string): Promise<{ success: boolean; error?: string }>
deleteProject(id: string): Promise<{ success: boolean; error?: string }>
```

## Base Database Utilities

Located in `database/base.ts`, these utilities provide:

### Error Handling

```typescript
import { DatabaseError, handleDatabaseError } from './base';

try {
  // database operation
} catch (error) {
  handleDatabaseError(error, 'operation name');
}
```

### Database Access

```typescript
import { requireDatabase } from './base';

const db = requireDatabase(); // Throws if database not available
```

### Query Execution

```typescript
import { executeQuery, executeQueryFirst, executeUpdate } from './base';

// Fetch multiple rows
const posts = await executeQuery<PostRow>('SELECT * FROM posts');

// Fetch single row
const post = await executeQueryFirst<PostRow>(
  'SELECT * FROM posts WHERE id = ?',
  [id],
);

// Execute update/insert/delete
await executeUpdate('UPDATE posts SET title = ? WHERE id = ?', [title, id]);
```

## Standard Response Format

All create/update/delete operations return a consistent format:

```typescript
{
  success: boolean;
  data?: T;        // For create/update operations
  error?: string;  // Error message if success is false
}
```

## Error Handling Pattern

```typescript
export async function createResource(data: ResourceData) {
  try {
    await executeUpdate('INSERT INTO ...', [params]);
    revalidatePath('/path');
    return { success: true };
  } catch (error) {
    handleDatabaseError(error, 'create resource');
  }
}
```

## Transaction Handling

For operations requiring multiple queries:

```typescript
export async function complexOperation() {
  const db = requireDatabase();

  try {
    // D1 doesn't support explicit transactions yet
    // Perform operations in sequence
    await executeUpdate('INSERT INTO table1 ...', [params1]);
    await executeUpdate('INSERT INTO table2 ...', [params2]);

    revalidatePath('/path');
    return { success: true };
  } catch (error) {
    handleDatabaseError(error, 'complex operation');
  }
}
```

## File Upload Pattern

For resources with file uploads:

```typescript
async function uploadFile(
  file: File,
  slug: string,
  fieldName: string,
): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage not available');

  const fileExt = file.name.split('.').pop() || 'bin';
  const key = `resource/${slug}/${fieldName}.${fileExt}`;
  const arrayBuffer = await file.arrayBuffer();

  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  return key;
}
```

## Cache Revalidation

Always revalidate relevant paths after mutations:

```typescript
import { revalidatePath, revalidateTag } from 'next/cache';

// Revalidate specific paths
revalidatePath('/posts');
revalidatePath('/database/posts');

// Revalidate by tag
revalidateTag('posts');
```
