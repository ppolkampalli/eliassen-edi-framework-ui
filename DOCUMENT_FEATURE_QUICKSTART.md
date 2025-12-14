# Document Details Feature - Quick Start Guide

## What Was Built

A complete full-stack feature for searching and viewing EDI documents with:
- **Backend API** at `/api/docs` that connects to your external EDI system
- **Frontend page** at `/documents` with search form and data table
- **Advanced features**: sorting, filtering, pagination, quick actions

## Quick Start (3 Steps)

### 1. Start the Backend
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### 2. Start the Frontend
Open a new terminal:
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### 3. Use the Feature
1. Open your browser to `http://localhost:5173`
2. Click **"Document Details"** in the navigation menu
3. Click **"Today's Documents"** or **"Today's to Maxxmart"** to see results
4. Or fill in the search form with your criteria

## Features You Can Use

### Search Form
- **Date Range**: Filter by start/end date
- **Source/Destination**: Filter by trading partner IDs
- **Document Type**: e.g., "810" for invoices
- **Transaction Status**: SENT, ERROR, RECEIVED, etc.
- **Sort Options**: Choose field and direction

### Data Table
- **Click column headers** to sort
- **Global search box** to filter all columns
- **Pagination controls** at bottom
- **Page size selector**: 10, 25, 50, or 100 rows
- **Color-coded status badges** for quick identification

### Quick Actions
- **Today's Documents**: Loads all documents from today
- **Today's to Maxxmart**: Loads today's Maxxmart documents

## Configuration

### Backend (.env file location: `backend/.env`)
Already configured with defaults:
```env
PORT=5000
EDI_API_BASE_URL=http://10.152.2.9:10680
```

### Frontend (.env file location: `frontend/.env`)
Already configured with defaults:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Testing the API Directly

You can test the backend API using curl or browser:

### Get All Documents
```bash
curl http://localhost:5000/api/docs
```

### Get Today's Documents to Maxxmart
```bash
curl "http://localhost:5000/api/docs?startDate=2025-12-13T05:00:00.000Z&destination=maxxmart&selectFiltered=Y&withNotes=true&sortBy=transactionLastDateTime&sortDir=desc"
```

### Get Documents by Type
```bash
curl "http://localhost:5000/api/docs?documentType=810&sortBy=transactionLastDateTime&sortDir=desc"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/docs` | Search documents with query parameters |
| GET | `/api/health` | Health check |
| GET | `/` | API info and available endpoints |

## Query Parameters Reference

| Parameter | Example | Description |
|-----------|---------|-------------|
| startDate | `2025-12-13T00:00:00.000Z` | Start date (ISO format) |
| endDate | `2025-12-13T23:59:59.999Z` | End date (ISO format) |
| source | `PRODUXINC` | Source trading partner |
| destination | `MAXXMART` | Destination trading partner |
| documentType | `810` | Document type (810=Invoice) |
| transactionStatus | `SENT` | Status (SENT, ERROR, etc.) |
| sortBy | `transactionLastDateTime` | Field to sort by |
| sortDir | `desc` | Sort direction (asc/desc) |

## Troubleshooting

### "Cannot connect to backend"
- Make sure backend is running on port 5000
- Check `frontend/.env` has correct `VITE_API_BASE_URL`

### "No data returned"
- Verify external EDI API is accessible at `http://10.152.2.9:10680`
- Check `backend/.env` has correct `EDI_API_BASE_URL`
- Try adjusting your search criteria (dates, filters)

### "Build errors"
Both projects build successfully:
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## Common EDI Document Types

Reference for the `documentType` field:
- **810**: Invoice
- **850**: Purchase Order
- **856**: Advance Ship Notice
- **997**: Functional Acknowledgment

## Next Steps

1. **Test with real data**: Adjust dates and filters to match your data
2. **Customize columns**: Edit `DocumentTable.tsx` to show/hide columns
3. **Add authentication**: Implement user login if needed
4. **Export data**: Add CSV/Excel export functionality
5. **Real-time updates**: Implement WebSocket updates

## Need Help?

- **Implementation details**: See `IMPLEMENTATION_SUMMARY.md`
- **API documentation**: See `backend/api-examples/customer-specific-list.md`
- **Project structure**: See `TEMPLATE_STRUCTURE.md`

## File Locations

Key files you might want to modify:

### Search Form
`frontend/src/components/DocumentSearchForm.tsx`

### Data Table
`frontend/src/components/DocumentTable.tsx`

### API Service (Backend)
`backend/src/services/document.service.ts`

### API Types
`shared/types/document.types.ts` (source of truth)
`backend/src/types/document.types.ts` (copy)

---

**That's it!** You now have a fully functional EDI document search and viewing system. Happy coding!
