import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { logActivity } from '../utils/activity.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'member', phone, department, address } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    department,
    address,
    membershipId: role === 'member' ? `LIB-${Date.now().toString().slice(-6)}` : undefined,
    joinDate: new Date()
  });

  await logActivity({ userId: user._id, action: 'REGISTER', description: `${user.name} registered as ${role}` });

  res.status(201).json({
    message: 'Registration successful',
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, department: user.department, address: user.address, membershipId: user.membershipId }
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)) || (role && user.role !== role)) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  await logActivity({ userId: user._id, action: 'LOGIN', description: `${user.name} logged in` });

  res.json({
    message: 'Login successful',
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, department: user.department, address: user.address, membershipId: user.membershipId }
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const logoutUser = asyncHandler(async (_, res) => {
  res.json({ message: 'Logout successful' });
});
