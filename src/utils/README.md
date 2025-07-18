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