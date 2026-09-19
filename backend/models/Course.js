import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '30 min' },
  videoUrl: { type: String, default: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  type: { type: String, enum: ['video', 'quiz'], default: 'video' },
  isFree: { type: Boolean, default: false },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lectures: [lectureSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    completedLessons: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
    },
    hours: {
      type: String,
      default: '10 hrs',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    gradient: {
      type: String,
      default: 'from-blue-500 to-indigo-600',
    },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
