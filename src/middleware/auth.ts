import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { DatabaseConfig } from '../config/database';
import { jwtConfig } from '../config/jwt';
import { User } from '../types';

export interface JwtPayload {
  userId: number;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Middleware для проверки JWT токена из cookie
 */
export const jwtAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.[jwtConfig.cookieName];

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;

    const db = DatabaseConfig.getInstance().getDatabase();

    db.get("SELECT * FROM users WHERE id = ?", [decoded.userId], (err, user: User | undefined) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      (req as AuthenticatedRequest).user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Генерация JWT токена
 */
export const generateToken = (user: User): string => {
  const payload: JwtPayload = {
    userId: user.id,
    username: user.username,
  };

  return jwt.sign(payload, jwtConfig.secret, { expiresIn: '7d' } as jwt.SignOptions);
};

/**
 * Проверка пароля пользователя
 */
export const verifyPassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

/**
 * @deprecated Используйте jwtAuth вместо basicAuth
 */
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