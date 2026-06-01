import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Book from '../models/Book.js';
import BorrowRecord from '../models/BorrowRecord.js';
import { logActivity } from '../utils/activity.js';

export const getMembers = asyncHandler(async (_, res) => {
  const members = await User.find({ role: 'member' }).select('-password').sort({ createdAt: -1 });
  res.json({ members });
});

export const createMember = asyncHandler(async (req, res) => {
  const { name, email, phone, department, membershipId, address, joinDate } = req.body;
  const member = await User.create({ name, email, phone, department, membershipId, address, joinDate, role: 'member', password: 'ChangeMe123!' });
  await logActivity({ userId: req.user._id, action: 'MEMBER_CREATE', description: `Created member ${member.name}` });
  res.status(201).json({ message: 'Member created', member });
});

export const updateMember = asyncHandler(async (req, res) => {
  const member = await User.findOneAndUpdate({ _id: req.params.id, role: 'member' }, req.body, { new: true }).select('-password');
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }
  await logActivity({ userId: req.user._id, action: 'MEMBER_UPDATE', description: `Updated member ${member.name}` });
  res.json({ message: 'Member updated', member });
});

export const deleteMember = asyncHandler(async (req, res) => {
  const member = await User.findOneAndDelete({ _id: req.params.id, role: 'member' });
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }
  await logActivity({ userId: req.user._id, action: 'MEMBER_DELETE', description: `Deleted member ${member.name}` });
  res.json({ message: 'Member deleted' });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const borrows = await BorrowRecord.find({ member: req.user._id }).populate('book');
  const categories = [...new Set(borrows.map((item) => item.book?.category).filter(Boolean))];
  const filter = categories.length ? { category: { $in: categories } } : {};
  const books = await Book.find(filter).sort({ borrowCount: -1 }).limit(6);
  res.json({ books });
});
