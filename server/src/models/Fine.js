import mongoose from 'mongoose';

const fineSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowRecord' },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'paid', 'waived'] },
    paidAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('Fine', fineSchema);
