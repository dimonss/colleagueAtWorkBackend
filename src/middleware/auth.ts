import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { DatabaseConfig } from '../config/database';
import { User, AuthenticatedRequest } from '../types';

export const basicAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Colleagues API"');
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [username, password] = credentials.split(':');

    const db = DatabaseConfig.getInstance().getDatabase();
    
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user: User | undefined) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }
      
      if (!user || !bcrypt.compareSync(password, user.password)) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Colleagues API"');
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      
      (req as any).user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid authorization header' });
  }
}; 