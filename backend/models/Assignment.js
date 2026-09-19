import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentId: { type: String, default: 'STU-101' },
  solutionUrl: { type: String, required: true },
  notes: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  marksObtained: { type: Number, default: null },
  feedback: { type: String, default: '' },
  status: { type: String, enum: ['Submitted', 'Graded'], default: 'Submitted' },
});

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      default: 50,
    },
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;

