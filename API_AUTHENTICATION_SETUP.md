# API Authentication Setup - RESOLVED

## Issue
The external EDI API at `http://10.152.2.9:10680/v1/1/docs` requires Basic Authentication.

## Solution Implemented
Added Basic Auth support to the backend service.

## Configuration

### Backend Environment Variables (`backend/.env`)
```env
# External EDI API Configuration
EDI_API_BASE_URL=http://10.152.2.9:10680
EDI_API_USERNAME=Pramod
EDI_API_PASSWORD=password123!

# Mock data mode (set to false to use real API)
USE_MOCK_DATA=false
```

## API Endpoint
- **Correct Endpoint**: `/v1/1/docs` (not `/portal/documents`)
- **Authentication**: Basic Auth
- **Base URL**: `http://10.152.2.9:10680`

## API Parameter Mapping
The backend automatically maps frontend parameter names to API parameter names:
- Frontend: `documentType` → API: `docType`
- All other parameters pass through as-is

## Testing

### Test with curl:
```bash
curl -u Pramod:password123! "http://10.152.2.9:10680/v1/1/docs?selectFiltered=Y&withNotes=true&sortBy=transactionLastDateTime&sortDir=desc"
```

### Test through backend:
```bash
curl "http://localhost:5000/api/docs?selectFiltered=Y&withNotes=true&sortBy=transactionLastDateTime&sortDir=desc"
```

## Status
✅ **WORKING** - Backend successfully connects to external API and returns data (2653+ documents)

## Next Steps
1. Open frontend at `http://localhost:5173/documents`
2. Click "Today's Documents" or use search form
3. View real EDI documents in the table

## Security Notes
- Basic Auth credentials are stored in `.env` file
- `.env` file is excluded from git via `.gitignore`
- Never commit credentials to version control
- Consider using environment-specific configuration for production
