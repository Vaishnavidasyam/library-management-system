import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'cancelled'] }
  },
  { timestamps: true }
);

export default mongoose.model('Reservation', reservationSchema);
