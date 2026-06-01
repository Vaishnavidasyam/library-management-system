import express from 'express';
import { createBook, deleteBook, getBookById, getBooks, updateBook } from '../controllers/bookController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.route('/').get(protect, getBooks).post(protect, authorize('admin'), upload.single('coverImage'), createBook);
router.route('/:id').get(protect, getBookById).put(protect, authorize('admin'), upload.single('coverImage'), updateBook).delete(protect, authorize('admin'), deleteBook);
export default router;
