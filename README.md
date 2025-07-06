# Colleague At Work Backend (TypeScript)

Express.js backend with SQLite database for managing colleague information with photos and additional details. Written in TypeScript.

## Features

- ✅ TypeScript support with full type safety
- ✅ Get all colleagues with photos and information
- ✅ Get single colleague by ID
- ✅ Add new colleague (with photo upload)
- ✅ Update existing colleague (with photo upload)
- ✅ Delete colleague (removes photo file too)
- ✅ Basic Authentication for protected routes
- ✅ File upload support for colleague photos (UUID names)
- ✅ SQLite database for data persistence
- ✅ Comprehensive test suite
- ✅ Health check endpoint

## Installation

1. Navigate to the backend directory:
```bash
cd colleagueAtWorkBackend
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
# Development mode (with auto-restart)
npm run dev:watch

# Development mode (single run)
npm run dev

# Production mode
npm start
```

The server will start on port 3001 by default.

## Project Structure

```
src/
├── types/           # TypeScript interfaces and types
├── config/          # Database and upload configuration
├── middleware/      # Authentication middleware
├── controllers/     # Business logic controllers
├── routes/          # API route definitions
├── app.ts          # Express application setup
└── server.ts       # Server entry point

test/
├── setup.js        # Test database setup
└── colleagues.test.ts # API integration tests

static/             # Uploaded photos (UUID names)
dist/               # Compiled JavaScript (after build)
```

## Default Credentials

- **Username:** `admin`
- **Password:** `admin123`

## API Endpoints

### Public Endpoints (No Authentication Required)

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-07-06T10:23:24.462Z"
}
```

#### GET /api/colleagues
Get all colleagues with their information and photo URLs.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "position": "Software Engineer",
    "department": "Engineering",
    "email": "john.doe@company.com",
    "phone": "+1234567890",
    "photo_filename": "uuid-1234567890.jpg",
    "photo_url": "http://localhost:3001/static/uuid-1234567890.jpg",
    "hire_date": "2023-01-15",
    "salary": 75000,
    "notes": "Great team player",
    "created_at": "2024-01-01T10:00:00.000Z",
    "updated_at": "2024-01-01T10:00:00.000Z"
  }
]
```

#### GET /api/colleagues/:id
Get a single colleague by ID.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "position": "Software Engineer",
  "department": "Engineering",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "photo_filename": "uuid-1234567890.jpg",
  "photo_url": "http://localhost:3001/static/uuid-1234567890.jpg",
  "hire_date": "2023-01-15",
  "salary": 75000,
  "notes": "Great team player",
  "created_at": "2024-01-01T10:00:00.000Z",
  "updated_at": "2024-01-01T10:00:00.000Z"
}
```

### Protected Endpoints (Basic Authentication Required)

#### POST /api/colleagues
Add a new colleague. Requires Basic Authentication.

**Headers:**
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

**Body (multipart/form-data):**
- `name` (required): Colleague's full name
- `position`: Job position
- `department`: Department name
- `email`: Email address
- `phone`: Phone number
- `hire_date`: Date of hire (YYYY-MM-DD)
- `salary`: Salary amount
- `notes`: Additional notes
- `photo`: Image file (optional, max 5MB)

**Response:**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "position": "Designer",
  "department": "Design",
  "email": "jane.smith@company.com",
  "phone": "+1234567891",
  "photo_filename": "uuid-1234567891.jpg",
  "photo_url": "http://localhost:3001/static/uuid-1234567891.jpg",
  "hire_date": "2023-02-20",
  "salary": 65000,
  "notes": "Creative designer",
  "created_at": "2024-01-01T11:00:00.000Z",
  "updated_at": "2024-01-01T11:00:00.000Z"
}
```

#### PUT /api/colleagues/:id
Update an existing colleague. Requires Basic Authentication.

**Headers:**
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

**Body (multipart/form-data):**
- `name`: Colleague's full name
- `position`: Job position
- `department`: Department name
- `email`: Email address
- `phone`: Phone number
- `hire_date`: Date of hire (YYYY-MM-DD)
- `salary`: Salary amount
- `notes`: Additional notes
- `photo`: New image file (optional, max 5MB)

**Response:**
```json
{
  "id": 1,
  "name": "John Doe Updated",
  "position": "Senior Software Engineer",
  "department": "Engineering",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "photo_filename": "uuid-new-photo-1234567890.jpg",
  "photo_url": "http://localhost:3001/static/uuid-new-photo-1234567890.jpg",
  "hire_date": "2023-01-15",
  "salary": 85000,
  "notes": "Great team player, promoted to senior",
  "created_at": "2024-01-01T10:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

#### DELETE /api/colleagues/:id
Delete a colleague and their photo file. Requires Basic Authentication.

**Headers:**
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

**Response:**
```json
{
  "message": "Colleague deleted successfully"
}
```

## Authentication

The API uses Basic Authentication for protected endpoints. Include the Authorization header with base64-encoded credentials:

```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

Where `YWRtaW46YWRtaW4xMjM=` is the base64 encoding of `admin:admin123`.

## File Upload

- Supported formats: All image types (JPEG, PNG, GIF, etc.)
- Maximum file size: 5MB
- Files are stored in the `static/` directory with UUID names
- Photo URLs are automatically generated and included in responses
- Old photos are automatically deleted when updating

## Database

The application uses SQLite with the following tables:

### colleagues
- `id` (PRIMARY KEY)
- `name` (REQUIRED)
- `position`
- `department`
- `email`
- `phone`
- `photo_filename` (UUID + extension)
- `hire_date`
- `salary`
- `notes`
- `created_at`
- `updated_at`

### users
- `id` (PRIMARY KEY)
- `username` (UNIQUE)
- `password` (HASHED)
- `created_at`

## Development

### TypeScript Development
```bash
# Run in development mode with auto-restart
npm run dev:watch

# Run in development mode (single run)
npm run dev
```

### Building for Production
```bash
# Compile TypeScript to JavaScript
npm run build

# Run compiled version
npm start
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a message:
```json
{
  "error": "Error description"
}
```

## Production Deployment

For production deployment:
1. Change the default admin password
2. Set appropriate environment variables
3. Use a production database if needed
4. Configure proper CORS settings
5. Set up proper file storage (consider cloud storage for photos)
6. Build the project: `npm run build`
7. Run the compiled version: `npm start`

## TypeScript Benefits

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: IntelliSense, refactoring, navigation
- **Maintainability**: Easier to understand and modify code
- **Documentation**: Types serve as inline documentation
- **Refactoring**: Safe refactoring with confidence 