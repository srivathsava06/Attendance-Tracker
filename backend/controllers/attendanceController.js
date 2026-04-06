const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');

const markAttendance = async (req, res) => {
  try {
    const { subjectId, records } = req.body;
    
    // Set date to start of today (midnight) - date wise attendance
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    
    // Check for duplicate attendance for today
    const existingAttendance = await Attendance.findOne({
      subject: subjectId,
      date: todayDate,
    });
    
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }
    
    // Create attendance record
    const attendance = new Attendance({
      subject: subjectId,
      date: todayDate,
      markedBy: req.user.id,
      records,
    });
    
    await attendance.save();
    
    // Update subject statistics
    const subject = await Subject.findById(subjectId);
    subject.totalClasses += 1;
    subject.attendedClasses += records.filter((r) => r.status === 'present').length;
    await subject.save();
    
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAttendanceBySubject = async (req, res) => {
  try {
    const attendance = await Attendance.find({ subject: req.params.subjectId })
      .populate('records.student', 'name email studentId')
      .sort({ date: -1 })
      .exec();
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAttendanceByDateRange = async (req, res) => {
  try {
    const { subjectId, from, to } = req.query;
    
    const attendance = await Attendance.find({
      subject: subjectId,
      date: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    })
      .populate('records.student', 'name email studentId')
      .exec();
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.id.toString();
    
    // Use the SAME query as getStudentAttendanceHistory (teacher view)
    // This guarantees teacher and student see identical percentages
    const attendanceRecords = await Attendance.find({
      'records.student': req.user.id,
    }).select('records date subject').populate('subject', 'name code teacherName').lean();
    
    // Group by subject — exactly like the teacher's endpoint does
    const subjectMap = {};
    let totalPresent = 0;
    let totalAbsent = 0;
    
    attendanceRecords.forEach(att => {
      // Skip records that have no linked subject
      if (!att.subject) return;
      
      const subjectCode = att.subject.code;
      
      att.records.forEach(record => {
        if (record.student.toString() === studentId) {
          if (!subjectMap[subjectCode]) {
            subjectMap[subjectCode] = {
              subject: {
                name: att.subject.name,
                code: att.subject.code,
                teacherName: att.subject.teacherName,
              },
              presentClasses: 0,
              absentClasses: 0,
              totalClasses: 0,
              percentage: 0,
            };
          }
          
          subjectMap[subjectCode].totalClasses += 1;
          if (record.status === 'present') {
            subjectMap[subjectCode].presentClasses += 1;
            totalPresent += 1;
          } else {
            subjectMap[subjectCode].absentClasses += 1;
            totalAbsent += 1;
          }
        }
      });
    });
    
    // Calculate per-subject percentage
    const attendanceData = Object.values(subjectMap).map(item => {
      item.percentage = item.totalClasses === 0 ? 0 : Math.round((item.presentClasses / item.totalClasses) * 100);
      return item;
    });
    
    // Overall attendance = totalPresent / (totalPresent + totalAbsent)
    const totalClasses = totalPresent + totalAbsent;
    const overallPercentage = totalClasses === 0 ? 0 : Math.round((totalPresent / totalClasses) * 100);
    
    res.json({
      overallPercentage,
      totalPresent,
      totalAbsent,
      totalClasses,
      attendanceData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const recordAttendanceByBranch = async (req, res) => {
  try {
    const { branch, records } = req.body;
    
    // Get today's date at midnight (normalize to date only, no time)
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    
    // Find the subject taught by this teacher so it maps to the student's subject breakdown
    let subjectId = null;
    const teacherSubject = await Subject.findOne({ createdBy: req.user.id });
    if (teacherSubject) {
      subjectId = teacherSubject._id;
    }
    
    // Check for duplicate attendance for today for this branch
    // This allows attendance to be marked once per day per teacher per branch
    const existingAttendance = await Attendance.findOne({
      branch: branch,
      date: todayDate,
      markedBy: req.user.id,
    });
    
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today for this branch' });
    }
    
    // Create attendance record with date normalized to midnight
    const attendance = new Attendance({
      subject: subjectId, // Links it to the specific subject for student dashboard
      branch: branch,
      date: todayDate,
      markedBy: req.user.id,
      records,
    });
    
    await attendance.save();
    
    res.status(201).json({ message: 'Attendance recorded successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkBranchAttendanceToday = async (req, res) => {
  try {
    const { branch } = req.params;
    
    // Get today's date at midnight (normalize to date only, no time)
    // This allows checking date-wise attendance
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    
    // Check if attendance already marked for this branch today
    // After 12:00 AM, todayDate changes, so a new day's attendance can be marked
    const existingAttendance = await Attendance.findOne({
      branch: branch,
      date: todayDate,
      markedBy: req.user.id,
    });
    
    if (existingAttendance) {
      return res.json({ completed: true, attendance: existingAttendance });
    }
    
    res.json({ completed: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentAttendanceHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Find all attendance records where this student is in the records array
    const attendanceRecords = await Attendance.find({
      'records.student': studentId,
    }).select('records date branch subject').populate('subject', 'name code teacherName');
    
    // Extract only this student's records and group by subject
    const subjectWiseAttendance = {};
    let totalPresent = 0;
    let totalAbsent = 0;
    
    attendanceRecords.forEach(att => {
      att.records.forEach(record => {
        if (record.student.toString() === studentId) {
          // Group by subject
          const subjectName = att.subject ? att.subject.name : 'General';
          const subjectCode = att.subject ? att.subject.code : 'GEN';
          
          if (!subjectWiseAttendance[subjectCode]) {
            subjectWiseAttendance[subjectCode] = {
              name: subjectName,
              present: 0,
              absent: 0,
              total: 0,
            };
          }
          
          subjectWiseAttendance[subjectCode].total += 1;
          if (record.status === 'present') {
            subjectWiseAttendance[subjectCode].present += 1;
            totalPresent += 1;
          } else {
            subjectWiseAttendance[subjectCode].absent += 1;
            totalAbsent += 1;
          }
        }
      });
    });
    
    // Calculate total percentage
    const totalClasses = totalPresent + totalAbsent;
    const totalPercentage = totalClasses === 0 ? 0 : Math.round((totalPresent / totalClasses) * 100);
    
    res.json({
      totalPresent,
      totalAbsent,
      totalClasses,
      totalPercentage,
      subjectWiseAttendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceBySubject,
  getAttendanceByDateRange,
  getMyAttendance,
  recordAttendanceByBranch,
  checkBranchAttendanceToday,
  getStudentAttendanceHistory,
};
