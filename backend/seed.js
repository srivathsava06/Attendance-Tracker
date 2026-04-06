const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Subject = require('./models/Subject');
const Attendance = require('./models/Attendance');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Delete existing data
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Deleted existing data');
    
    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@track.edu',
      password: 'demo1234',
      plainPassword: 'demo1234',
      role: 'admin',
    });
    
    // Create 4 teachers with subjects
    const teacher1 = await User.create({
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh@track.edu',
      password: 'demo1234',
      plainPassword: 'demo1234',
      role: 'teacher',
      teacherId: 'TCH-001',
      teacherSubject: 'Mathematics',
    });
    
    const teacher2 = await User.create({
      name: 'Prof. Anita Singh',
      email: 'anita@track.edu',
      password: 'demo1234',
      plainPassword: 'demo1234',
      role: 'teacher',
      teacherId: 'TCH-002',
      teacherSubject: 'Physics',
    });
    
    const teacher3 = await User.create({
      name: 'Dr. Mohan Verma',
      email: 'mohan@track.edu',
      password: 'demo1234',
      plainPassword: 'demo1234',
      role: 'teacher',
      teacherId: 'TCH-003',
      teacherSubject: 'Chemistry',
    });
    
    const teacher4 = await User.create({
      name: 'Ms. Priya Sharma',
      email: 'priya.s@track.edu',
      password: 'demo1234',
      plainPassword: 'demo1234',
      role: 'teacher',
      teacherId: 'TCH-004',
      teacherSubject: 'Programming',
    });
    
    console.log('Created 4 teachers');
    
    // Create 20 students for each branch (60 total)
    const students = [];
    let studentCounter = 1;
    
    // CSE Students (20)
    for (let i = 1; i <= 20; i++) {
      const student = await User.create({
        name: `CSE Student ${i}`,
        email: `cse.student${i}@track.edu`,
        password: 'demo1234',
        plainPassword: 'demo1234',
        role: 'student',
        studentId: `CSE-${String(i).padStart(3, '0')}`,
        department: 'CSE',
      });
      students.push(student);
      studentCounter++;
    }
    
    // IT Students (20)
    for (let i = 1; i <= 20; i++) {
      const student = await User.create({
        name: `IT Student ${i}`,
        email: `it.student${i}@track.edu`,
        password: 'demo1234',
        plainPassword: 'demo1234',
        role: 'student',
        studentId: `IT-${String(i).padStart(3, '0')}`,
        department: 'IT',
      });
      students.push(student);
      studentCounter++;
    }
    
    // AIML Students (20)
    for (let i = 1; i <= 20; i++) {
      const student = await User.create({
        name: `AIML Student ${i}`,
        email: `aiml.student${i}@track.edu`,
        password: 'demo1234',
        plainPassword: 'demo1234',
        role: 'student',
        studentId: `AIML-${String(i).padStart(3, '0')}`,
        department: 'AIML',
      });
      students.push(student);
      studentCounter++;
    }
    
    console.log('Created 60 students (20 per branch)');
    
    // Create 4 subjects with all students
    const subject1 = await Subject.create({
      name: 'Mathematics',
      code: 'MATH-101',
      credits: 4,
      createdBy: teacher1._id,
      teacherName: teacher1.name,
      students: students.map(s => s._id),
    });
    
    const subject2 = await Subject.create({
      name: 'Physics',
      code: 'PHY-101',
      credits: 4,
      createdBy: teacher2._id,
      teacherName: teacher2.name,
      students: students.map(s => s._id),
    });
    
    const subject3 = await Subject.create({
      name: 'Chemistry',
      code: 'CHEM-101',
      credits: 4,
      createdBy: teacher3._id,
      teacherName: teacher3.name,
      students: students.map(s => s._id),
    });
    
    const subject4 = await Subject.create({
      name: 'Programming',
      code: 'PROG-101',
      credits: 3,
      createdBy: teacher4._id,
      teacherName: teacher4.name,
      students: students.map(s => s._id),
    });
    
    console.log('Created 4 subjects');
    
    // NO mock attendance data is created
    // Teachers must mark attendance via the dashboard for it to appear
    console.log('No mock attendance data created - teachers will mark real attendance via the UI');
    
    console.log('\n  Test with student: cse.student1@track.edu | demo1234');
    console.log('  Attendance will show as 0% until a teacher marks it via the dashboard');
    console.log('\nDatabase seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
