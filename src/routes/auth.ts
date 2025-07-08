import { Router } from 'express';
import { basicAuth } from '../middleware/auth';

const router = Router();

router.post('/login', basicAuth, (req, res) => {
  res.json({ success: true, username: (req as any).user.username });
});

export default router; 