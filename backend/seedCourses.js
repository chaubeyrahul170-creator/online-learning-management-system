import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';

dotenv.config();

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding Real Course Lectures...');

    await Course.deleteMany();

    await Course.create([
      {
        title: 'Full Stack Web Development (MERN)',
        subtitle: 'Express Middleware & Protected Routes',
        description: 'Complete hands-on guide to Node.js, Express REST APIs, MongoDB Mongoose, and JWT authentication.',
        instructor: 'Dr. Rahul Sharma',
        category: 'Web Dev',
        totalLessons: 4,
        completedLessons: 1,
        progress: 25,
        hours: '42 hrs',
        level: 'Intermediate',
        gradient: 'from-blue-500 to-indigo-600',
        modules: [
          {
            title: 'Module 1: Node.js & Express Foundations',
            lectures: [
              {
                title: 'Introduction to Node.js & Express Server Setup',
                duration: '25 min',
                // Real Node.js Crash Course Lecture
                videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
                type: 'video',
                isFree: true,
              },
              {
                title: 'REST APIs & Express Route Handlers',
                duration: '35 min',
                // Real REST API Architecture Lecture
                videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48',
                type: 'video',
                isFree: true,
              },
            ],
          },
          {
            title: 'Module 2: Database & Authentication',
            lectures: [
              {
                title: 'MongoDB Atlas Setup & Mongoose Schemas',
                duration: '40 min',
                // Real MongoDB & Mongoose Schema Lecture
                videoUrl: 'https://www.youtube.com/embed/DZBGEExakOM',
                type: 'video',
                isFree: false,
              },
              {
                title: 'JWT Authentication & Protected API Endpoints',
                duration: '45 min',
                // Real JWT Authentication Tutorial
                videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
                type: 'video',
                isFree: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Data Structures & Algorithms in Java',
        subtitle: 'Binary Trees & Tree Traversals',
        description: 'Core computer science algorithms, tree traversals, recursion and graph problems.',
        instructor: 'Prof. Anjali Verma',
        category: 'Core CS',
        totalLessons: 2,
        completedLessons: 0,
        progress: 0,
        hours: '56 hrs',
        level: 'Advanced',
        gradient: 'from-violet-500 to-purple-600',
        modules: [
          {
            title: 'Module 1: Trees & Binary Search Trees',
            lectures: [
              {
                title: 'Binary Tree Data Structure & Recursion',
                duration: '30 min',
                // Real Java DSA Tree Lecture
                videoUrl: 'https://www.youtube.com/embed/M6lYob8STMI',
                type: 'video',
                isFree: true,
              },
              {
                title: 'Tree Traversals: Inorder, Preorder, Postorder',
                duration: '45 min',
                // Real Tree Traversals Tutorial
                videoUrl: 'https://www.youtube.com/embed/b_N4M45-3Mw',
                type: 'video',
                isFree: false,
              },
            ],
          },
        ],
      },
    ]);

    console.log('✅ Real Tech Lectures with Real Video Streams Seeded to MongoDB Atlas!');
    process.exit();
  } catch (error) {
    console.error('Error seeding courses:', error.message);
    process.exit(1);
  }
};

seedCourses();
