import express from 'express';
import { getBorrowRecords, getMyBorrowHistory, issueBook, returnBook } from '../controllers/borrowController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/my/history', protect, authorize('member'), getMyBorrowHistory);
router.get('/', protect, authorize('admin'), getBorrowRecords);
router.post('/issue', protect, authorize('admin'), issueBook);
router.put('/return/:id', protect, authorize('admin'), returnBook);
export default router;
