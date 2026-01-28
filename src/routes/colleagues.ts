import { Router } from 'express';
import { ColleaguesController } from '../controllers/colleagues';
import { jwtAuth } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();

// Get all colleagues
router.get('/', ColleaguesController.getAllColleagues);

// Get single colleague by ID
router.get('/:id', ColleaguesController.getColleagueById);

// Add new colleague (requires authentication)
router.post('/', jwtAuth, upload.single('photo'), ColleaguesController.createColleague);

// Update colleague (requires authentication)
router.put('/:id', jwtAuth, upload.single('photo'), ColleaguesController.updateColleague);

// Delete colleague (requires authentication)
router.delete('/:id', jwtAuth, ColleaguesController.deleteColleague);

// Update colleague status (no authentication required)
router.patch('/:id/status', ColleaguesController.updateColleagueStatus);

// SSE endpoint for real-time status updates
router.get('/status/stream', ColleaguesController.getStatusStream);

// Get server timezone information
router.get('/timezone', ColleaguesController.getTimezoneInfo);

export default router; 