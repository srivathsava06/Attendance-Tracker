const express = require('express');
const router = express.Router();
const {
  getSubjects,
  createSubject,
  deleteSubject,
  enrollStudent,
} = require('../controllers/subjectController');
const protect = require('../middleware/auth');
const { isAdmin, isTeacherOrAdmin } = require('../middleware/roleCheck');

router.get('/', protect, getSubjects);
router.post('/', protect, isTeacherOrAdmin, createSubject);
router.delete('/:id', protect, isTeacherOrAdmin, deleteSubject);
router.post('/:id/enroll', protect, isAdmin, enrollStudent);

module.exports = router;
