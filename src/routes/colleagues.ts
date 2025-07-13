import { Router } from 'express';
import { ColleaguesController } from '../controllers/colleagues';
import { basicAuth } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();

// Get all colleagues
router.get('/', ColleaguesController.getAllColleagues);

// Get single colleague by ID
router.get('/:id', ColleaguesController.getColleagueById);

// Add new colleague (requires authentication)
router.post('/', basicAuth, upload.single('photo'), ColleaguesController.createColleague);

// Update colleague (requires authentication)
router.put('/:id', basicAuth, upload.single('photo'), ColleaguesController.updateColleague);

// Delete colleague (requires authentication)
router.delete('/:id', basicAuth, ColleaguesController.deleteColleague);

// Update colleague status (no authentication required)
router.patch('/:id/status', ColleaguesController.updateColleagueStatus);

export default router; 