import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { DatabaseConfig } from '../config/database';
import { jwtConfig } from '../config/jwt';
import { jwtAuth, generateToken, AuthenticatedRequest } from '../middleware/auth';
import { User } from '../types';

const router = Router();

/**
 * POST /auth/login
 * Аутентификация пользователя и установка JWT cookie
 */
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const db = DatabaseConfig.getInstance().getDatabase();

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user: User | undefined) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user);

    res.cookie(jwtConfig.cookieName, token, jwtConfig.cookieOptions);
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
      }
    });
  });
});

/**
 * POST /auth/logout
 * Очистка JWT cookie
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie(jwtConfig.cookieName, {
    httpOnly: true,
    secure: jwtConfig.cookieOptions.secure,
    sameSite: jwtConfig.cookieOptions.sameSite,
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * GET /auth/me
 * Получение информации о текущем пользователе
 */
router.get('/me', jwtAuth, (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    created_at: user.created_at,
  });
});

export default router;