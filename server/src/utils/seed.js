import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Book from '../models/Book.js';

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Book.deleteMany({})]);

  const admin = await User.create({
    name: 'System Admin',
    email: 'admin@velora.app',
    password: 'Admin123!',
    role: 'admin',
    phone: '+1 555-0100'
  });

  const member = await User.create({
    name: 'Ava Member',
    email: 'member@velora.app',
    password: 'Member123!',
    role: 'member',
    membershipId: 'LIB-100001',
    department: 'Computer Science',
    joinDate: new Date()
  });

  await Book.insertMany([
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', category: 'Technology', isbn: '9781449373320', totalCopies: 6, availableCopies: 4, price: 49, publisher: 'O\'Reilly', shelfLocation: 'A-12' },
    { title: 'Atomic Habits', author: 'James Clear', category: 'Self Growth', isbn: '9780735211292', totalCopies: 8, availableCopies: 5, price: 24, publisher: 'Penguin', shelfLocation: 'B-07' },
    { title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', isbn: '9780132350884', totalCopies: 5, availableCopies: 3, price: 42, publisher: 'Prentice Hall', shelfLocation: 'A-09' }
  ]);

  console.log('Seed complete');
  console.log({ admin: admin.email, member: member.email });
  process.exit(0);
};

run();
