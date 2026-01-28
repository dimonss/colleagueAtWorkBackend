import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { staticDir } from './config/upload';
import colleaguesRoutes from './routes/colleagues';
import authRoutes from './routes/auth';

const app: Application = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'prod'
    ? [process.env.FRONTEND_DOMAIN || '']
    : ["*"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from static directory
app.use('/static', express.static(staticDir));

// API routes with /colleagues prefix for production
const apiPrefix = process.env.NODE_ENV === 'prod' ? '' : '/api';
app.use(`${apiPrefix}/colleagues`, colleaguesRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);

  if (err.message === 'Only image files are allowed!') {
    res.status(400).json({ error: 'Only image files are allowed!' });
    return;
  }

  if (err.message.includes('File too large')) {
    res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    return;
  }

  res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app; 