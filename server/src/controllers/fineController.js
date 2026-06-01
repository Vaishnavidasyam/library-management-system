import asyncHandler from 'express-async-handler';
import Fine from '../models/Fine.js';
import Notification from '../models/Notification.js';
import { logActivity } from '../utils/activity.js';

export const getFines = asyncHandler(async (req, res) => {
  const filter = req.query.mine === 'true' || req.user.role === 'member' ? { member: req.user._id } : {};
  const fines = await Fine.find(filter).populate('member', 'name email').sort({ createdAt: -1 });
  res.json({ fines });
});

export const updateFine = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.status === 'paid') payload.paidAt = new Date();
  const fine = await Fine.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!fine) {
    res.status(404);
    throw new Error('Fine not found');
  }
  await Notification.create({ user: fine.member, title: 'Fine updated', message: `Your fine status is now ${fine.status}.` });
  await logActivity({ userId: req.user._id, action: 'FINE_UPDATE', description: `Fine updated to ${fine.status}` });
  res.json({ message: 'Fine updated', fine });
});
