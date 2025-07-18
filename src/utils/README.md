# Utils Directory

This directory contains utility functions used across the application.

## urlHelper

Utility functions for URL generation.

### generatePhotoUrl(filename)

Generates a full URL for photo files based on the current environment.

**Parameters:**
- `filename` (string): The photo filename

**Returns:**
- `string`: Full URL to the photo

**Environment Variables:**
- `NODE_ENV`: Determines the environment (prod/dev)
- `FRONTEND_DOMAIN`: Required in production, the domain for the frontend
- `PORT`: Server port (default: 3001)

**Usage:**

```typescript
// TypeScript
import { generatePhotoUrl } from '../utils/urlHelper';

const photoUrl = generatePhotoUrl('photo.jpg');
// Development: http://localhost:3001/static/photo.jpg
// Production: https://your-domain.com/colleagues/static/photo.jpg
```

```javascript
// JavaScript
const { generatePhotoUrl } = require('./src/utils/urlHelper');

const photoUrl = generatePhotoUrl('photo.jpg');
// Development: http://localhost:3001/static/photo.jpg
// Production: https://your-domain.com/colleagues/static/photo.jpg
```

**Error Handling:**
- Throws an error if `FRONTEND_DOMAIN` is not set in production environment

## eventEmitter

Singleton EventEmitter for SSE (Server-Sent Events) functionality.

### StatusEventEmitter

Manages real-time status change events for colleagues.

**Methods:**
- `emitStatusChange(colleagueId, isAtWork)`: Emits status change event
- `emitInitialData(colleagues)`: Emits initial data event

## dateHelper

Utility functions for date/time operations with timezone support.

### Server Timezone Configuration

The server uses **UTC+6** timezone for all date/time operations.

### Available Functions

#### getCurrentTimestamp()

Returns current timestamp in server timezone (UTC+6) with timezone info.

**Returns:**
- `string`: ISO string with timezone (e.g., "2024-01-15T14:30:00.000+06:00")

#### getCurrentSQLiteTimestamp()

Returns current timestamp formatted for SQLite database (without timezone info).

**Returns:**
- `string`: SQLite-compatible datetime string (e.g., "2024-01-15 14:30:00")

#### convertToServerTimezone(utcTimestamp)

Converts UTC timestamp to server timezone.

**Parameters:**
- `utcTimestamp` (string): UTC timestamp

**Returns:**
- `string`: ISO string with server timezone

#### formatDisplayDate(timestamp)

Formats timestamp for display in server timezone.

**Parameters:**
- `timestamp` (string): ISO timestamp

**Returns:**
- `string`: Formatted date string (e.g., "01/15/2024, 14:30:00")

#### getTimezoneInfo()

Returns server timezone information.

**Returns:**
- `object`: Timezone info with offset, name, and description

### Usage Examples

```typescript
// TypeScript
import { getCurrentTimestamp, getCurrentSQLiteTimestamp, getTimezoneInfo } from '../utils/dateHelper';

const now = getCurrentTimestamp();
// "2024-01-15T14:30:00.000+06:00"

const sqliteNow = getCurrentSQLiteTimestamp();
// "2024-01-15 14:30:00"

const timezone = getTimezoneInfo();
// { offset: 6, name: 'UTC+6', description: 'Server timezone (UTC+6)' }
```

```javascript
// JavaScript
const { getCurrentTimestamp, getCurrentSQLiteTimestamp, getTimezoneInfo } = require('./src/utils/dateHelper');

const now = getCurrentTimestamp();
// "2024-01-15T14:30:00.000+06:00"

const sqliteNow = getCurrentSQLiteTimestamp();
// "2024-01-15 14:30:00"

const timezone = getTimezoneInfo();
// { offset: 6, name: 'UTC+6', description: 'Server timezone (UTC+6)' }
```

### API Endpoint

Check server timezone via API:

```bash
GET /api/colleagues/timezone
```

**Response:**
```json
{
  "timezone": {
    "offset": 6,
    "name": "UTC+6",
    "description": "Server timezone (UTC+6)"
  },
  "currentTime": "2024-01-15T14:30:00.000+06:00",
  "sqliteTime": "2024-01-15 14:30:00",
  "systemTime": "2024-01-15T08:30:00.000Z",
  "message": "Server timezone information"
}
``` 