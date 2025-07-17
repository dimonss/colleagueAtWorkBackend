import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import app from './app';
import { DatabaseConfig } from './config/database';

const PORT = process.env.PORT || 3001;

// Initialize database
DatabaseConfig.getInstance();

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation:`);
    console.log(`GET    /api/colleagues     - Get all colleagues`);
    console.log(`GET    /api/colleagues/:id - Get single colleague`);
    console.log(`POST   /api/colleagues     - Add new colleague (Basic Auth required)`);
    console.log(`PUT    /api/colleagues/:id - Update colleague (Basic Auth required)`);
    console.log(`DELETE /api/colleagues/:id - Delete colleague (Basic Auth required)`);
    console.log(`GET    /health            - Health check`);
    console.log(`\nDefault admin credentials: admin / admin123`);
    console.log(`Static files served from: /static`);
  });
}

export default app; 