const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {
    let query = {};
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    const users = await User.find(query).select('-password').lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { role, studentId, department, teacherId, teacherSubject, password, plainPassword } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (role) user.role = role;
    if (studentId !== undefined) user.studentId = studentId;
    if (teacherId !== undefined) user.teacherId = teacherId;
    if (teacherSubject !== undefined) user.teacherSubject = teacherSubject;
    if (department !== undefined) user.department = department;
    
    // Handle password update - set raw password and let pre-save hook hash it
    if (password || plainPassword) {
      const newPassword = password || plainPassword;
      user.password = newPassword; // pre-save hook will hash this
      user.plainPassword = newPassword;
    }

    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser };
