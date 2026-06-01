import express from 'express';
import { exportExcel, exportPdf, getAnalyticsReport } from '../controllers/reportController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/analytics', protect, authorize('admin'), getAnalyticsReport);
router.get('/pdf/:type', protect, authorize('admin'), exportPdf);
router.get('/excel/:type', protect, authorize('admin'), exportExcel);
export default router;
