const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('createdBy', 'name email')
      .exec();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name, code, credits, teacherName } = req.body;
    
    // Check for duplicate code
    const existingSubject = await Subject.findOne({ code: code.toUpperCase() });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }
    
    const subject = new Subject({
      name,
      code,
      credits,
      teacherName,
      createdBy: req.user.id,
    });
    
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && subject.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    // Delete all attendance records for this subject
    await Attendance.deleteMany({ subject: req.params.id });
    
    // Delete subject
    await Subject.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    if (!subject.students.includes(studentId)) {
      subject.students.push(studentId);
      await subject.save();
    }
    
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSubjects, createSubject, deleteSubject, enrollStudent };
