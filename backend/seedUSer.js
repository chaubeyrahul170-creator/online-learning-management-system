import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    await User.deleteMany();

    await User.create([
      {
        name: 'Rahul Student',
        email: 'student@edulearn.com',
        password: 'password123',
        role: 'student',
        studentId: 'STU-101',
        isApproved: true,
      },
      {
        name: 'Dr. Rahul Sharma',
        email: 'instructor@edulearn.com',
        password: 'password123',
        role: 'instructor',
        studentId: 'FAC-201',
        isApproved: true,
      },
      {
        name: 'Prof. Anjali Verma',
        email: 'anjali@edulearn.com',
        password: 'password123',
        role: 'instructor',
        studentId: 'FAC-202',
        isApproved: true,
      },
      {
        name: 'Admin User',
        email: 'admin@edulearn.com',
        password: 'password123',
        role: 'admin',
        studentId: 'ADMIN-01',
        isApproved: true,
      },
    ]);

    console.log('✅ Instructors (Dr. Rahul Sharma & Prof. Anjali Verma) Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
};

seedUsers();
