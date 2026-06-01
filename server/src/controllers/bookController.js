import asyncHandler from "express-async-handler";
import QRCode from "qrcode";

import Book from "../models/Book.js";
import BorrowRecord from "../models/BorrowRecord.js";
import Reservation from "../models/Reservation.js";

import { logActivity } from "../utils/activity.js";

const buildQuery = (query) => {
  const filters = {};

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { author: { $regex: query.search, $options: "i" } },
      { category: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.category) {
    filters.category = query.category;
  }

  return filters;
};

export const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find(buildQuery(req.query)).sort({
    createdAt: -1,
  });

  res.json({ books });
});

export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.json(book);
});

export const createBook = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.file) {
    payload.coverImage = `/uploads/${req.file.filename}`;
  }

  payload.qrCode = await QRCode.toDataURL(
    JSON.stringify({
      isbn: payload.isbn,
      title: payload.title,
    }),
  );

  const book = await Book.create(payload);

  await logActivity({
    userId: req.user._id,
    action: "BOOK_CREATE",
    description: `Added book ${book.title}`,
  });

  res.status(201).json({
    message: "Book created",
    book,
  });
});

export const updateBook = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.file) {
    payload.coverImage = `/uploads/${req.file.filename}`;
  }

  const book = await Book.findByIdAndUpdate(req.params.id, payload, {
    new: true,
  });

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  await logActivity({
    userId: req.user._id,
    action: "BOOK_UPDATE",
    description: `Updated book ${book.title}`,
  });

  res.json({
    message: "Book updated",
    book,
  });
});

export const deleteBook = asyncHandler(async (req, res) => {
  // Prevent deletion if book is currently issued

  const activeBorrow = await BorrowRecord.findOne({
    book: req.params.id,
    status: "issued",
  });

  if (activeBorrow) {
    res.status(400);
    throw new Error("Cannot delete a book that is currently borrowed");
  }

  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  // Remove related reservations

  await Reservation.deleteMany({
    book: req.params.id,
  });

  // Delete the book

  await Book.findByIdAndDelete(req.params.id);

  await logActivity({
    userId: req.user._id,
    action: "BOOK_DELETE",
    description: `Deleted book ${book.title}`,
  });

  res.json({
    message: "Book and related reservations deleted",
  });
});
