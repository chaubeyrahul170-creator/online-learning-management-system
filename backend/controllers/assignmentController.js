import Assignment from '../models/Assignment.js';

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Public / Private
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new assignment (Faculty)
// @route   POST /api/assignments
// @access  Private / Faculty
export const createAssignment = async (req, res) => {
  try {
    const { title, course, instructor, description, deadline, totalMarks } = req.body;
    const assignment = await Assignment.create({
      title,
      course,
      instructor: instructor || 'Dr. Rahul Sharma',
      description,
      deadline,
      totalMarks: totalMarks || 50,
      submissions: [],
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Student submits assignment solution
// @route   POST /api/assignments/:id/submit
// @access  Private / Student
export const submitSolution = async (req, res) => {
  try {
    const { studentName, studentEmail, studentId, solutionUrl, notes } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if already submitted by this student
    const existingIndex = assignment.submissions.findIndex(
      (s) => s.studentEmail === studentEmail
    );

    if (existingIndex > -1) {
      assignment.submissions[existingIndex].solutionUrl = solutionUrl;
      assignment.submissions[existingIndex].notes = notes;
      assignment.submissions[existingIndex].submittedAt = new Date();
      assignment.submissions[existingIndex].status = 'Submitted';
    } else {
      assignment.submissions.push({
        studentName,
        studentEmail,
        studentId: studentId || 'STU-101',
        solutionUrl,
        notes,
        status: 'Submitted',
      });
    }

    await assignment.save();
    res.json({ message: 'Solution submitted successfully to instructor', assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Faculty grades a submission
// @route   PUT /api/assignments/:id/grade/:subId
// @access  Private / Faculty
export const gradeSubmission = async (req, res) => {
  try {
    const { marksObtained, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const sub = assignment.submissions.id(req.params.subId);
    if (!sub) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    sub.marksObtained = marksObtained;
    sub.feedback = feedback || 'Good effort!';
    sub.status = 'Graded';

    await assignment.save();
    res.json({ message: 'Grade awarded successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

