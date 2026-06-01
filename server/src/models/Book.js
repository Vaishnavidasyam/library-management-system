import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, unique: true, sparse: true },
    publisher: String,
    publicationDate: Date,
    category: String,
    description: String,
    edition: String,
    language: String,
    shelfLocation: String,
    totalCopies: { type: Number, default: 1 },
    availableCopies: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    coverImage: String,
    qrCode: String,
    borrowCount: { type: Number, default: 0 },
    condition: { type: String, default: 'good', enum: ['good', 'damaged'] },
    status: { type: String, default: 'available', enum: ['available', 'missing', 'archived'] }
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);
