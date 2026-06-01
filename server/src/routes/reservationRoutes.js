import express from 'express';
import { createReservation, getReservations, updateReservation } from '../controllers/reservationController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(protect, getReservations).post(protect, authorize('member'), createReservation);
router.put('/:id', protect, authorize('admin'), updateReservation);
export default router;
