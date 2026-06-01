import express from 'express';
import { createMember, deleteMember, getMembers, getRecommendations, updateMember } from '../controllers/memberController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/me/recommendations', protect, authorize('member'), getRecommendations);
router.route('/').get(protect, authorize('admin'), getMembers).post(protect, authorize('admin'), createMember);
router.route('/:id').put(protect, authorize('admin'), updateMember).delete(protect, authorize('admin'), deleteMember);
export default router;
