import asyncHandler from "express-async-handler";
import Reservation from "../models/Reservation.js";
import Notification from "../models/Notification.js";
import { logActivity } from "../utils/activity.js";

export const getReservations = asyncHandler(async (req, res) => {
  const filter =
    req.query.mine === "true" || req.user.role === "member"
      ? { member: req.user._id }
      : {};

  const reservations = await Reservation.find(filter)
    .populate("member", "name")
    .populate("book", "title author")
    .sort({ createdAt: -1 });

  const validReservations = reservations.filter(
    (reservation) => reservation.book,
  );

  res.json({
    reservations: validReservations,
  });
});
export const createReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.create({
    member: req.user._id,
    book: req.body.bookId,
  });
  await Notification.create({
    user: req.user._id,
    title: "Reservation submitted",
    message: "Your reservation request is pending review.",
  });
  await logActivity({
    userId: req.user._id,
    action: "RESERVATION_CREATE",
    description: "Created a new reservation",
  });
  res.status(201).json({ message: "Reservation created", reservation });
});

export const updateReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!reservation) {
    res.status(404);
    throw new Error("Reservation not found");
  }
  await Notification.create({
    user: reservation.member,
    title: "Reservation updated",
    message: `Your reservation status is now ${reservation.status}.`,
  });
  await logActivity({
    userId: req.user._id,
    action: "RESERVATION_UPDATE",
    description: `Reservation updated to ${reservation.status}`,
  });
  res.json({ message: "Reservation updated", reservation });
});
