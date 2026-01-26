# Codebase Redundancy and DRY Analysis Report

This report identifies areas in the portfolio codebase where logic is duplicated and "Don't Repeat Yourself" (DRY) principles are violated. Refactoring these areas will improve maintainability, reduce the risk of bugs, and make adding new features significantly faster.

---

## 1. Database Service Layer (Highest Priority)

**Files:** `database/*.ts` (e.g., `books.ts`, `certificates.ts`, `projects.ts`, etc.)

### The Issue

Every database service file contains nearly identical boilerplate for authentication, record fetching, and especially **ID vs. Slug resolution**.

### Example: Redundant Resolution Logic

In both `database/books.ts` and `database/certificates.ts` (and others), the following logic is repeated inside `update`, `delete`, and `getById` functions:

```typescript
// Found in both files and multiple functions per file
if (recordId.length !== 15) {
  const records = await pb.collection('...').getFullList({
    filter: `slug = "${recordId}"`,
  });
  if (records.length > 0) recordId = records[0].id;
} else {
  try {
    await pb.collection('...').getOne(recordId);
  } catch {
    const records = await pb.collection('...').getFullList({
      filter: `slug = "${recordId}"`,
    });
    if (records.length > 0) recordId = records[0].id;
  }
}
```

### Recommendation: Generic Service Factory

Create a generic `BaseService` or a factory function that handles these common operations.

```typescript
// Proposed: lib/serviceFactory.ts
export async function resolveId(collection: string, idOrSlug: string) {
  if (idOrSlug.length === 15) {
    try {
      return (await pb.collection(collection).getOne(idOrSlug)).id;
    } catch {
      /* fall through to slug check */
    }
  }
  const record = await pb
    .collection(collection)
    .getFirstListItem(`slug="${idOrSlug}"`);
  return record.id;
}
```

---

## 2. Card Component Logic

**Files:** `components/Card/*/index.tsx`

### The Issue

Components like `BookCard`, `CertificateCard`, and `ProjectCard` share a `handleCardClick` function that handles navigation based on whether the user is in "Edit Mode" or "View Mode".

### Example: Repeated Click Handling

```typescript
// components/Card/Book/index.tsx
const handleCardClick = () => {
  if (isInForm) return;
  if (openForm) {
    router.push(`/database/reading-list/${book.id}/edit`);
  } else {
    openLink(book.link);
  }
};

// components/Card/Certificate/index.tsx
const handleCardClick = () => {
  if (isInForm) return;
  const identifier = certificate.slug || certificate.id;
  if (openForm) {
    router.push(`/database/certs/${identifier}/edit`);
  } else {
    openLink(certificate.link);
  }
};
```

### Recommendation: Unified Card Component

Abstract this logic into the parent `Card` component or a custom hook `useCardAction`. The individual cards should only provide the `data` and the `editPath`.

---

## 3. Data Mapping Boilerplate

**Files:** `lib/mappers.ts`

### The Issue

The `mappers.ts` file manually maps every single field from a PocketBase record to a TypeScript interface. For 10+ entities, this results in hundreds of lines of predictable code.

### Example: Manual Mapping

```typescript
export function mapRecordToBook(record: RecordModel): Book {
  return {
    id: record.id,
    slug: record.slug,
    // ... every other field ...
  };
}
```

### Recommendation: Schema-Based Mapping

Use a generic mapper that takes a configuration object for fields requiring special handling (like JSON parsing or file URLs) and spreads the rest.

---

## 4. App Router Wrapper Pattern

**Files:** `app/**/page.tsx` and `app/**/content.tsx`

### The Issue

The codebase strictly follows a pattern where `page.tsx` (Server Component) simply wraps a `content.tsx` (Client Component). While often necessary for Next.js, it creates many near-empty files.

### Example: Wrapper Boilerplate

```typescript
// app/certs/page.tsx
export default async function CertificatesPage() {
  return <CertificatesContent />;
}
```

### Recommendation: Page Metadata Helper

Create a higher-order component or a shared metadata generator to at least standardize the `Metadata` definitions which are also repetitive across these pages.

---

## 5. UI/UX Consistency in Content Components

**Files:** `app/*/content.tsx`

### The Issue

Almost every "listing" page (Books, Certs, Projects) uses the exact same `useCollection` hook and renders a loading state with `CardLoading`.

### Example: Repeated Listing Logic

```typescript
const { data, loading, error } = useCollection<T>(collectionName, mapper);

if (loading) return Array(8).fill(0).map(...)
```

### Recommendation: Generic ResourceList Component

Create a `ResourceList` component that takes the collection name, mapper, and the specific Card component as props. This would turn 50 lines of `content.tsx` into 5.

```tsx
<ResourceList
  collection='certificates'
  mapper={mapRecordToCertificate}
  component={CertificateCard}
  title='Certificates'
/>
```
