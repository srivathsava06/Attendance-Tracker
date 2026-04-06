const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceBySubject,
  getAttendanceByDateRange,
  getMyAttendance,
  recordAttendanceByBranch,
  checkBranchAttendanceToday,
  getStudentAttendanceHistory,
} = require('../controllers/attendanceController');
const protect = require('../middleware/auth');
const { isTeacherOrAdmin } = require('../middleware/roleCheck');

router.post('/mark', protect, isTeacherOrAdmin, markAttendance);
router.post('/record-by-branch', protect, isTeacherOrAdmin, recordAttendanceByBranch);
router.get('/check-branch/:branch', protect, isTeacherOrAdmin, checkBranchAttendanceToday);
router.get('/student/:studentId', protect, getStudentAttendanceHistory);
router.get('/me', protect, getMyAttendance);
router.get('/range', protect, getAttendanceByDateRange);
router.get('/:subjectId', protect, getAttendanceBySubject);

module.exports = router;
