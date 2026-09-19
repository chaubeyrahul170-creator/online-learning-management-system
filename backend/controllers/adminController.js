import User from '../models/User.js';
import Course from '../models/Course.js';

// @desc    Get all users (Students & Instructors)
// @route   GET /api/admin/users
// @access  Admin Only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending access approval requests
// @route   GET /api/admin/pending-users
// @access  Admin Only
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false }).select('-password');
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve User Access
// @route   PUT /api/admin/users/:id/approve
// @access  Admin Only
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: `Access granted for ${user.name}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suspend User for a period of time with reason
// @route   PUT /api/admin/users/:id/suspend
// @access  Admin Only
export const suspendUser = async (req, res) => {
  try {
    const { days, reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot suspend an Administrator' });
    }

    user.isSuspended = true;
    user.suspensionReason = reason || 'Administrative review under process';
    
    // Calculate end date if days provided
    if (days && Number(days) > 0) {
      const until = new Date();
      until.setDate(until.getDate() + Number(days));
      user.suspendedUntil = until;
    } else {
      user.suspendedUntil = null; // Indefinite until reinstated
    }

    await user.save();
    res.json({ message: `${user.name} has been suspended`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reinstate / Restore suspended user
// @route   PUT /api/admin/users/:id/reinstate
// @access  Admin Only
export const reinstateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isSuspended = false;
    user.suspendedUntil = null;
    user.suspensionReason = '';
    await user.save();

    res.json({ message: `${user.name}'s publishing access has been reinstated`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete/Revoke User permanently
// @route   DELETE /api/admin/users/:id
// @access  Admin Only
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete Super Admin' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed permanently from platform' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Platform Analytics for Admin
// @route   GET /api/admin/stats
// @access  Admin Only
export const getPlatformStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const pendingApprovals = await User.countDocuments({ isApproved: false });
    const suspendedCount = await User.countDocuments({ isSuspended: true });
    const totalCourses = await Course.countDocuments();

    res.json({
      totalStudents,
      totalInstructors,
      pendingApprovals,
      suspendedCount,
      totalCourses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
