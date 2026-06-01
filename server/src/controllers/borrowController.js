import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';
import BorrowRecord from '../models/BorrowRecord.js';
import Fine from '../models/Fine.js';
import Notification from '../models/Notification.js';
import { logActivity } from '../utils/activity.js';

export const getBorrowRecords = asyncHandler(async (_, res) => {
  const records = await BorrowRecord.find().populate('member', 'name email').populate('book', 'title author').sort({ createdAt: -1 });
  res.json({ records });
});

export const getMyBorrowHistory = asyncHandler(async (req, res) => {
  const records = await BorrowRecord.find({ member: req.user._id }).populate('book', 'title author').sort({ createdAt: -1 });
  res.json({ records });
});

export const issueBook = asyncHandler(async (req, res) => {
  const { memberId, bookId, issueDate, dueDate } = req.body;
  const book = await Book.findById(bookId);
  if (!book || book.availableCopies < 1) {
    res.status(400);
    throw new Error('Book unavailable');
  }

  const record = await BorrowRecord.create({ member: memberId, book: bookId, issuedBy: req.user._id, issueDate, dueDate });
  book.availableCopies -= 1;
  book.borrowCount += 1;
  await book.save();
  await Notification.create({ user: memberId, title: 'Book issued', message: `${book.title} has been issued to your account.` });
  await logActivity({ userId: req.user._id, action: 'BOOK_ISSUED', description: `Issued ${book.title}` });
  res.status(201).json({ message: 'Book issued', record });
});

export const returnBook = asyncHandler(async (req, res) => {
  const record = await BorrowRecord.findById(req.params.id).populate('book');
  if (!record) {
    res.status(404);
    throw new Error('Borrow record not found');
  }

  const returnDate = new Date(req.body.returnDate || new Date());
  const dueDate = new Date(record.dueDate);
  const overdueDays = Math.max(0, Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24)));
  const fineAmount = overdueDays * 2;

  record.returnDate = returnDate;
  record.status = 'returned';
  record.fineAmount = fineAmount;
  await record.save();

  const book = await Book.findById(record.book._id);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  if (fineAmount > 0) {
    await Fine.create({ member: record.member, borrowRecord: record._id, amount: fineAmount, reason: `Late return (${overdueDays} days)` });
    await Notification.create({ user: record.member, title: 'Fine generated', message: `A fine of $${fineAmount} has been added for late return.` });
  } else {
    await Notification.create({ user: record.member, title: 'Book returned', message: `${record.book.title} return completed successfully.` });
  }

  await logActivity({ userId: req.user._id, action: 'BOOK_RETURNED', description: `Processed return for ${record.book.title}` });
  res.json({ message: 'Book returned', record });
});
