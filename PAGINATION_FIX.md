# Pagination Fix for Document Table

## Issue
The pagination controls in the DocumentTable component were not working properly. Users couldn't navigate between pages.

## Root Cause
The pagination state was not being properly managed. TanStack Table requires:
1. Pagination state to be explicitly declared and managed
2. The `onPaginationChange` handler to be provided
3. Proper state synchronization

## Changes Made

### 1. Added Pagination State Management
**File**: `frontend/src/components/DocumentTable.tsx`

```typescript
// Added explicit pagination state
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 25,
});
```

### 2. Connected State to Table
```typescript
const table = useReactTable({
  // ... other config
  state: {
    sorting,
    columnFilters,
    globalFilter,
    pagination,  // ← Added
  },
  onPaginationChange: setPagination,  // ← Added
  // ... rest of config
});
```

### 3. Reset Pagination on New Data
```typescript
// Reset to page 1 when new data arrives
useEffect(() => {
  setPagination(prev => ({ ...prev, pageIndex: 0 }));
}, [documents]);
```

### 4. Improved Pagination UI
- Added "Showing X-Y of Z results" display
- Made the layout responsive (column on mobile, row on desktop)
- Removed the "Go to page" input (simplified UX)
- Better visual feedback for current page

## How Pagination Works Now

### Client-Side Pagination
The table uses **client-side pagination**:
- All data is loaded from the API once
- Pagination happens in the browser
- Fast navigation between pages
- Sorting and filtering work across all data

### Page Size Options
Users can choose to display:
- 10 rows per page
- 25 rows per page (default)
- 50 rows per page
- 100 rows per page

### Navigation Controls
- **<<** : Jump to first page
- **<**  : Go to previous page
- **>**  : Go to next page
- **>>** : Jump to last page

### Display Information
```
Showing 1-25 of 2653 results
Page 1 of 107
```

## Testing the Fix

1. Open the application at `http://localhost:5173/documents`
2. Click "Today's Documents" to load data
3. Verify pagination controls at the bottom of the table:
   - Click ">" to go to next page
   - Click "<" to go to previous page
   - Change page size dropdown
   - Verify "Showing X-Y of Z" updates correctly

## Alternative: Server-Side Pagination

If you need **server-side pagination** (recommended for large datasets):

### Pros:
- Faster initial load
- Reduced memory usage
- Better for thousands of documents

### Changes Required:
1. Backend API to support `page` and `pageSize` parameters
2. Return `totalCount` in response
3. Frontend to make new API call on page change
4. Store pagination state in DocumentDetails component

### Implementation:
```typescript
// In DocumentDetails.tsx
const handlePageChange = async (pageIndex: number, pageSize: number) => {
  const response = await documentApi.getDocuments({
    ...currentSearchParams,
    page: pageIndex + 1,
    pageSize: pageSize
  });
  setDocuments(response.data);
  setTotalCount(response.totalCount);
};
```

## Current Status
✅ **Client-side pagination is now fully functional**
- All pagination controls work correctly
- State properly syncs between table and UI
- Page resets when new search is performed
- Responsive layout for mobile and desktop

## Related Files
- `frontend/src/components/DocumentTable.tsx` - Main table component with pagination
- `shared/types/document.types.ts` - Type definitions
- `backend/src/services/document.service.ts` - API service (already supports page/pageSize params)
