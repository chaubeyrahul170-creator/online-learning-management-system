import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// Strict Email Regex: Must contain @ and valid domain extension like .com, .in, .org
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// @desc    Register a new user (Student or Instructor)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 🔒 1. Strict Email Format Check
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format. Please include a valid domain (e.g. user@gmail.com)',
      });
    }

    // 🔒 2. Password Length Check
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const assignedRole = role === 'instructor' ? 'instructor' : 'student';

    // 🚀 Students are 100% INSTANTLY APPROVED (Auto-activated)
    // Only Faculty requires Admin verification
    const isApproved = assignedRole === 'student';

    const studentId =
      assignedRole === 'instructor'
        ? `FAC-${Math.floor(100 + Math.random() * 900)}`
        : `STU-${Math.floor(100 + Math.random() * 900)}`;

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
      isApproved,
      studentId,
    });

    // Agar Student hai toh turant flat data + token bhejkar auto-login karwayein!
    if (assignedRole === 'student') {
      const token = generateToken(user._id);
      return res.status(201).json({
        message: 'Registration successful! Welcome to EduLearn.',
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        isApproved: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          isApproved: true,
        },
      });
    }

    // Agar Faculty hai toh Admin verification message dein
    res.status(201).json({
      message: 'Faculty application submitted! Admin will verify your credentials before granting course studio access.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 🔒 Strict Email Format Check
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email address format (e.g. name@domain.com required)',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Optional Role check
    if (role && user.role !== role) {
      return res.status(401).json({ message: `No ${role} account found with this email` });
    }

    // Password check
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 🔒 Admin approval sirf Instructors ke liye check hoga
    if (user.role === 'instructor' && !user.isApproved) {
      return res.status(403).json({
        message: 'Faculty Access Pending: Administrator is reviewing your credentials.',
      });
    }

    // Check if account is suspended
    if (user.isSuspended) {
      return res.status(403).json({
        message: `Account Suspended: ${user.suspensionReason || 'Please contact administrator.'}`,
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
