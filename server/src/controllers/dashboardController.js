import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';
import User from '../models/User.js';
import BorrowRecord from '../models/BorrowRecord.js';
import Reservation from '../models/Reservation.js';
import Fine from '../models/Fine.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const normalizeBars = (arr) => {
  const max = Math.max(...arr.map((i) => i.count), 1);
  return arr.map((item) => ({ label: item.label, value: Math.round((item.count / max) * 100) }));
};

export const getDashboardStats = asyncHandler(async (req, res) => {
  if (req.user.role === 'member') {
    const [borrowed, reservations, fines, dueSoon] = await Promise.all([
      BorrowRecord.countDocuments({ member: req.user._id, status: 'issued' }),
      Reservation.countDocuments({ member: req.user._id }),
      Fine.find({ member: req.user._id, status: 'pending' }),
      BorrowRecord.countDocuments({ member: req.user._id, status: 'issued', dueDate: { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } })
    ]);

    return res.json({
      memberSummary: {
        borrowed,
        reservations,
        dueSoon,
        fineAmount: fines.reduce((sum, item) => sum + item.amount, 0),
        lifetimeBorrows: await BorrowRecord.countDocuments({ member: req.user._id }),
        monthlyBorrows: await BorrowRecord.countDocuments({ member: req.user._id, createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }),
        onTimeRate: '94%'
      }
    });
  }

  const [books, members, borrowed, reservations, fines, recentActivity, recentNotifications, recentBooks, topMembers, mostBorrowedBooks] = await Promise.all([
    Book.countDocuments(),
    User.countDocuments({ role: 'member' }),
    BorrowRecord.countDocuments({ status: 'issued' }),
    Reservation.countDocuments({ status: 'pending' }),
    Fine.find(),
    ActivityLog.find().sort({ createdAt: -1 }).limit(6),
    Notification.find().sort({ createdAt: -1 }).limit(6),
    Book.find().sort({ createdAt: -1 }).limit(5),
    User.find({ role: 'member' }).sort({ createdAt: -1 }).limit(5),
    Book.find().sort({ borrowCount: -1 }).limit(5)
  ]);

  const monthlyBorrowRaw = await Promise.all(monthLabels.map(async (label, idx) => ({
    label,
    count: await BorrowRecord.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), idx, 1), $lt: new Date(new Date().getFullYear(), idx + 1, 1) } })
  })));
  const revenueRaw = await Promise.all(monthLabels.map(async (label, idx) => ({
    label,
    count: (await Fine.find({ createdAt: { $gte: new Date(new Date().getFullYear(), idx, 1), $lt: new Date(new Date().getFullYear(), idx + 1, 1) }, status: 'paid' })).reduce((sum, item) => sum + item.amount, 0)
  })));

  res.json({
    totals: {
      books,
      members,
      borrowed,
      reservations,
      pendingReturns: borrowed,
      fines: fines.filter((item) => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0),
      revenue: fines.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0)
    },
    mostBorrowedBooks,
    recentActivity,
    recentNotifications,
    recentBooks,
    topMembers,
    openFineCount: fines.filter((item) => item.status === 'pending').length,
    inventoryHealth: 'Stable',
    monthlyBorrowStats: normalizeBars(monthlyBorrowRaw),
    revenueAnalytics: normalizeBars(revenueRaw)
  });
});
