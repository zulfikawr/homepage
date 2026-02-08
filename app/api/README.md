# API Route Structure

This document describes the standardized API route structure and utilities used throughout the application.

## Directory Structure

```
app/api/
├── [resource]/
│   ├── route.ts              # GET, POST, etc.
│   ├── [id]/route.ts         # Dynamic routes
│   └── utils.ts              # Helper functions (if needed)
```

## Standardized Utilities

All API utilities are located in `lib/api/`:

### Response Wrapper (`lib/api/response.ts`)

Provides consistent response formatting:

```typescript
import { apiSuccess, apiError } from '@/lib/api';

// Success response
return apiSuccess({ user: { id: '123', name: 'John' } });
// Returns: { success: true, data: { user: { ... } } }

// Error response
return apiError('User not found', 404);
// Returns: { success: false, error: 'User not found' }

// Error with additional message
return apiError('Validation failed', 400, 'Email is required');
// Returns: { success: false, error: 'Validation failed', message: 'Email is required' }
```

### Request Validation (`lib/api/validation.ts`)

Uses Zod for type-safe request validation:

```typescript
import { z } from 'zod';
import { validateRequest, validateSearchParams } from '@/lib/api';

// Validate request body
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const validation = await validateRequest(request, schema);
if ('error' in validation) return validation.error;

const { email, password } = validation.data;

// Validate query parameters
const querySchema = z.object({
  limit: z.string().optional().default('10'),
  page: z.string().optional().default('1'),
});

const validation = await validateSearchParams(request, querySchema);
if ('error' in validation) return validation.error;
```

### Error Handling (`lib/api/error.ts`)

Centralized error handling:

```typescript
import { handleApiError } from '@/lib/api';

export async function GET() {
  try {
    // ... your code
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Example Route Implementation

### Basic GET Route

```typescript
import { apiSuccess, handleApiError } from '@/lib/api';

export async function GET() {
  try {
    const data = await fetchData();
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}
```

### POST Route with Validation

```typescript
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiSuccess, handleApiError, validateRequest } from '@/lib/api';

const createSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequest(request, createSchema);
    if ('error' in validation) return validation.error;

    const result = await createItem(validation.data);
    return apiSuccess(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Dynamic Route with Query Parameters

```typescript
import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  apiError,
  apiSuccess,
  handleApiError,
  validateSearchParams,
} from '@/lib/api';

const querySchema = z.object({
  id: z.string().min(1),
});

export async function DELETE(request: NextRequest) {
  try {
    const validation = await validateSearchParams(request, querySchema);
    if ('error' in validation) return validation.error;

    const { id } = validation.data;
    await deleteItem(id);

    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
```
