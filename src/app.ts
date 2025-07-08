import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { staticDir } from './config/upload';
import colleaguesRoutes from './routes/colleagues';
import authRoutes from './routes/auth';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from static directory
app.use('/static', express.static(staticDir));

// Routes
app.use('/api/colleagues', colleaguesRoutes);
app.use('/api/auth', authRoutes);

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