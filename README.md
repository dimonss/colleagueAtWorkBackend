# Colleague At Work Backend (TypeScript)

Express.js backend with SQLite database for managing colleague information with real-time status updates via Server-Sent Events (SSE). Written in TypeScript with full type safety.

## Features

- ✅ **TypeScript support** with full type safety
- ✅ **Real-time status updates** via Server-Sent Events (SSE)
- ✅ **CRUD operations** for colleague management
- ✅ **Photo upload** with UUID naming and validation
- ✅ **Basic Authentication** for protected routes
- ✅ **Status management** with optimistic updates
- ✅ **SQLite database** for data persistence
- ✅ **CORS configuration** for production domains
- ✅ **Comprehensive test suite**
- ✅ **Health check endpoint**
- ✅ **Production deployment** with systemd service

## Installation

1. Navigate to the backend directory:
```bash
cd colleagueAtWorkBackend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env file with your configuration
```

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
# Development mode (with auto-restart)
npm run dev:watch

# Development mode (single run)
npm run dev

# Production mode
npm start
```

The server will start on port 3001 by default.

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Node environment
NODE_ENV=prod

# Server port
PORT=3001

# Frontend domain for CORS
FRONTEND_DOMAIN=https://your-domain.com

# Database settings
DB_PATH=./database/colleagues.db

# Upload settings
UPLOAD_DIR=./static
MAX_FILE_SIZE=5242880
```

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

static/            # Uploaded photos (UUID names)
database/           # SQLite database files
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
  "timestamp": "2025-01-06T10:23:24.462Z"
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
    "is_at_work": true,
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
  "is_at_work": true,
  "created_at": "2024-01-01T10:00:00.000Z",
  "updated_at": "2024-01-01T10:00:00.000Z"
}
```

#### PATCH /api/colleagues/:id/status
Update colleague work status (public endpoint).

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "is_at_work": true
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "is_at_work": true,
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

#### GET /api/colleagues/status/stream
Server-Sent Events endpoint for real-time status updates.

**Headers:**
```
Accept: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Response (SSE):**
```
data: {"type":"initial","colleagues":[{"id":1,"name":"John Doe","is_at_work":true}]}

data: {"type":"statusChange","colleagueId":1,"isAtWork":false}

data: {"type":"heartbeat","timestamp":"2024-01-01T12:00:00.000Z"}
```

### Protected Endpoints (Basic Authentication Required)

#### POST /api/colleagues
Add a new colleague. Requires Basic Authentication.

**Headers:**
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
Content-Type: multipart/form-data
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
  "is_at_work": false,
  "created_at": "2024-01-01T11:00:00.000Z",
  "updated_at": "2024-01-01T11:00:00.000Z"
}
```

#### PUT /api/colleagues/:id
Update an existing colleague. Requires Basic Authentication.

**Headers:**
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
Content-Type: multipart/form-data
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
  "is_at_work": true,
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

### Authentication Endpoints

#### POST /api/auth/login
Authenticate user and return success status.

**Headers:**
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

**Response:**
```json
{
  "message": "Authentication successful",
  "user": "admin"
}
```

## Authentication

The API uses Basic Authentication for protected endpoints. Include the Authorization header with base64-encoded credentials:

```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

Where `YWRtaW46YWRtaW4xMjM=` is the base64 encoding of `admin:admin123`.

## Real-time Features

### Server-Sent Events (SSE)

The backend provides real-time status updates via SSE:

- **Initial Data**: Sends all colleague statuses on connection
- **Status Changes**: Emits events when status changes
- **Heartbeat**: Sends periodic heartbeat events
- **Auto-reconnect**: Client automatically reconnects on disconnect

### Event Types

1. **Initial Event**: Contains all colleague statuses
2. **Status Change Event**: Emitted when status changes
3. **Heartbeat Event**: Periodic connection keep-alive

### EventEmitter Integration

The backend uses Node.js EventEmitter for efficient event handling:

```typescript
// Emit status change event
EventEmitter.getInstance().emit('statusChange', {
  colleagueId: 1,
  isAtWork: true
});
```

## File Upload

- **Supported formats**: All image types (JPEG, PNG, GIF, etc.)
- **Maximum file size**: 5MB
- **File naming**: UUID-based names for security
- **Storage location**: `static/` directory
- **URL generation**: Automatic photo URL generation
- **Cleanup**: Old photos automatically deleted when updating

## Database Schema

The application uses SQLite with the following tables:

### colleagues
- `id` (PRIMARY KEY, INTEGER)
- `name` (TEXT, REQUIRED)
- `position` (TEXT)
- `department` (TEXT)
- `email` (TEXT)
- `phone` (TEXT)
- `photo_filename` (TEXT, UUID + extension)
- `hire_date` (TEXT, YYYY-MM-DD)
- `salary` (INTEGER)
- `notes` (TEXT)
- `is_at_work` (BOOLEAN, DEFAULT false)
- `created_at` (TEXT, ISO timestamp)
- `updated_at` (TEXT, ISO timestamp)

### users
- `id` (PRIMARY KEY, INTEGER)
- `username` (TEXT, UNIQUE)
- `password` (TEXT, HASHED)
- `created_at` (TEXT, ISO timestamp)

## CORS Configuration

The backend supports different CORS configurations for development and production:

```typescript
const corsOptions = {
  origin: process.env.NODE_ENV === 'prod' 
    ? [process.env.FRONTEND_DOMAIN || 'https://your-domain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

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

# Production mode with environment variables
NODE_ENV=prod npm start
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Database Management
```bash
# Add mock data to database
npm run addMockDataIntoDB

# Clear database (with confirmation)
npm run clearDB
```

## Production Deployment

### Systemd Service

Create a systemd service file for production deployment:

```ini
[Unit]
Description=Colleagues at Work Backend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/colleagues/backend
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=prod
Environment=PORT=3001
Environment=FRONTEND_DOMAIN=https://your-domain.com
Environment=DB_PATH=./database/colleagues.db
Environment=UPLOAD_DIR=./static
Environment=MAX_FILE_SIZE=5242880

[Install]
WantedBy=multi-user.target
```

### Environment Variables for Production

```bash
NODE_ENV=prod
PORT=3001
FRONTEND_DOMAIN=https://your-domain.com
DB_PATH=./database/colleagues.db
UPLOAD_DIR=./static
MAX_FILE_SIZE=5242880
```

### File Permissions

```bash
# Set proper permissions
sudo chown -R www-data:www-data /var/www/colleagues
sudo chmod -R 755 /var/www/colleagues
sudo chmod -R 777 /var/www/colleagues/backend/static
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

## Security Features

- **CORS**: Configured for specific domains
- **Authentication**: Basic Auth for protected routes
- **File Upload**: Image validation and size limits
- **SQL Injection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **UUID File Names**: Secure file naming

## Performance Optimizations

- **Efficient Database Queries**: Optimized SQL queries
- **File Upload Streaming**: Memory-efficient static
- **SSE Connection Management**: Proper connection handling
- **Error Handling**: Comprehensive error management
- **TypeScript**: Compile-time error checking

## Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Service Status
```bash
sudo systemctl status colleagues-backend
```

### Logs
```bash
sudo journalctl -u colleagues-backend -f
```

## TypeScript Benefits

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: IntelliSense, refactoring, navigation
- **Maintainability**: Easier to understand and modify code
- **Documentation**: Types serve as inline documentation
- **Refactoring**: Safe refactoring with confidence

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using port 3001
   lsof -i :3001
   # Kill the process
   kill -9 <PID>
   ```

2. **Database locked**
   ```bash
   # Check database file permissions
   ls -la database/
   # Fix permissions if needed
   chmod 644 database/colleagues.db
   ```

3. **Upload directory issues**
   ```bash
   # Create uploads directory
   mkdir -p static
   # Set permissions
   chmod 777 static
   ```

4. **CORS errors**
   - Check FRONTEND_DOMAIN environment variable
   - Verify frontend domain is in CORS configuration
   - Check browser console for specific errors

### Debug Mode

Enable debug logging:

```bash
# Set debug environment variable
DEBUG=* npm run dev

# Or in production
DEBUG=* npm start
```

## API Versioning

The API supports versioning through URL prefixes:

- **Development**: `/api/colleagues`
- **Production**: `/colleagues/api/colleagues`

This is configured in the Express app setup:

```typescript
const apiPrefix = process.env.NODE_ENV === 'prod' ? '' : '/api';
app.use(`${apiPrefix}/colleagues`, colleaguesRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Build the project: `npm run build`
6. Submit a pull request

## License

MIT License - see LICENSE file for details. 