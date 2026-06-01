import mongoose from 'mongoose';

const borrowRecordSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    returnDate: Date,
    fineAmount: { type: Number, default: 0 },
    status: { type: String, default: 'issued', enum: ['issued', 'returned', 'overdue'] }
  },
  { timestamps: true }
);

export default mongoose.model('BorrowRecord', borrowRecordSchema);
