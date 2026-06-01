import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';
import User from '../models/User.js';
import BorrowRecord from '../models/BorrowRecord.js';
import Fine from '../models/Fine.js';
import { streamExcelReport, streamPdfReport } from '../utils/reportGenerator.js';

const getReportData = async (type) => {
  switch (type) {
    case 'fine': {
      const fines = await Fine.find().populate('member', 'name');
      return {
        title: 'Fine Report',
        headers: ['Member', 'Amount', 'Reason', 'Status'],
        rows: fines.map((item) => [item.member?.name || 'Unknown', item.amount, item.reason, item.status]),
        pdfRows: fines.map((item) => `${item.member?.name || 'Unknown'} | $${item.amount} | ${item.reason} | ${item.status}`)
      };
    }
    case 'inventory': {
      const books = await Book.find();
      return {
        title: 'Inventory Report',
        headers: ['Title', 'Author', 'Available', 'Total', 'Category'],
        rows: books.map((item) => [item.title, item.author, item.availableCopies, item.totalCopies, item.category]),
        pdfRows: books.map((item) => `${item.title} | ${item.author} | ${item.availableCopies}/${item.totalCopies} | ${item.category}`)
      };
    }
    case 'member': {
      const users = await User.find({ role: 'member' });
      return {
        title: 'Member Report',
        headers: ['Name', 'Email', 'Department', 'Membership ID'],
        rows: users.map((item) => [item.name, item.email, item.department, item.membershipId]),
        pdfRows: users.map((item) => `${item.name} | ${item.email} | ${item.department || '-'} | ${item.membershipId || '-'}`)
      };
    }
    default: {
      const borrows = await BorrowRecord.find().populate('member', 'name').populate('book', 'title');
      return {
        title: 'Borrow Report',
        headers: ['Member', 'Book', 'Issue Date', 'Due Date', 'Status'],
        rows: borrows.map((item) => [item.member?.name || 'Unknown', item.book?.title || 'Unknown', item.issueDate.toISOString().slice(0, 10), item.dueDate.toISOString().slice(0, 10), item.status]),
        pdfRows: borrows.map((item) => `${item.member?.name || 'Unknown'} | ${item.book?.title || 'Unknown'} | ${item.status}`)
      };
    }
  }
};

export const getAnalyticsReport = asyncHandler(async (_, res) => {
  const [revenue, borrowed, inventoryRisk, members] = await Promise.all([
    Fine.find({ status: 'paid' }),
    BorrowRecord.countDocuments({ status: 'issued' }),
    Book.countDocuments({ availableCopies: { $lte: 2 } }),
    User.countDocuments({ role: 'member' })
  ]);
  res.json({ summary: { revenue: revenue.reduce((sum, item) => sum + item.amount, 0), borrowed, inventoryRisk, members } });
});

export const exportPdf = asyncHandler(async (req, res) => {
  const report = await getReportData(req.params.type);
  streamPdfReport({ title: report.title, rows: report.pdfRows }, res);
});

export const exportExcel = asyncHandler(async (req, res) => {
  const report = await getReportData(req.params.type);
  await streamExcelReport({ title: report.title, headers: report.headers, rows: report.rows }, res);
});
