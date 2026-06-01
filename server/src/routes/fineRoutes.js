import express from 'express';
import { getFines, updateFine } from '../controllers/fineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getFines);
router.put('/:id', protect, updateFine);
export default router;
