# Student Attendance Tracker

A full-stack client-server web application for managing student attendance with role-based access control. This system enables teachers to mark attendance, allows students to view their attendance records with low-attendance alerts, and provides administrators with comprehensive system management capabilities.

## Tech Stack

- **Frontend:** Vanilla JavaScript, Tailwind CSS, Fetch API
- **Backend:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs with 10 salt round hashing
- **Middleware:** CORS, express-validator
- **Development Tool:** nodemon for hot-reloading

## Project Structure

```
stitch/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema with password hashing
│   │   ├── Subject.js           # Subject/course schema
│   │   └── Attendance.js        # Daily attendance records
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile logic
│   │   ├── subjectController.js # Subject CRUD operations
│   │   ├── attendanceController.js # Attendance marking and retrieval
│   │   └── userController.js    # User management (admin)
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── subjects.js          # Subject management endpoints
│   │   ├── attendance.js        # Attendance endpoints
│   │   └── users.js             # User management endpoints
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── roleCheck.js         # Role-based access control
│   ├── server.js                # Express app and MongoDB connection
│   ├── seed.js                  # Database initialization script
│   ├── package.json             # Dependencies and scripts
│   └── .env                     # Environment variables
└── frontend/
    ├── js/
    │   └── api.js               # API helper with window.API namespace
    ├── attendtrack_login_desktop.html.html      # Login page
    ├── teacher_mark_view_attendance_mobile.html.html # Teacher dashboard
    ├── student_my_attendance_full_width.html.html    # Student dashboard
    └── admin_single_page_management.html.html        # Admin dashboard
```

## Features

- **Role-Based Authentication:** Secure login with three distinct user roles (admin, teacher, student)
- **Subject Management:** Create, manage, and enroll students in subjects
- **Teacher Dashboard:** Mark daily attendance for enrolled students with quick-mark functionality
- **Student Dashboard:** View personal attendance records with statistics and low-attendance alerts
- **Admin Dashboard:** Manage all users, view system statistics, and manage subjects
- **JWT Authentication:** 7-day token expiration with secure localStorage storage
- **Password Security:** Bcrypt hashing with 10 salt rounds for all user passwords
- **Low-Attendance Alerts:** Automatic warnings for students with attendance below 75%

## API Endpoints

### Authentication

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| GET | `/api/auth/me` | Authenticated | Get current user profile |

### Subjects

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/subjects` | Authenticated | Get all enrolled subjects |
| POST | `/api/subjects` | Teacher/Admin | Create new subject |
| DELETE | `/api/subjects/:id` | Teacher/Admin | Delete subject |
| POST | `/api/subjects/:id/enroll` | Admin | Enroll student in subject |

### Attendance

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/attendance/mark` | Teacher/Admin | Mark attendance for a subject |
| GET | `/api/attendance/me` | Student | Get personal attendance records |
| GET | `/api/attendance/range` | Authenticated | Get attendance for date range |
| GET | `/api/attendance/:subjectId` | Authenticated | Get attendance records for subject |

### Users (Admin Only)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | Admin | Get all users with optional role filter |
| PUT | `/api/users/:id` | Admin | Update user details |
| DELETE | `/api/users/:id` | Admin | Delete user |

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/attendtrack
   JWT_SECRET=attendtrack_super_secret_key_2024
   JWT_EXPIRE=7d
   ```

4. **Initialize database with seed data:**
   ```bash
   npm run seed
   ```
   This creates 5 demo users (1 admin, 1 teacher, 3 students) and 3 sample subjects with enrollment.

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server will run at `http://localhost:5000` with hot-reload enabled.

6. **Verify server is running:**
   Visit `http://localhost:5000/api/health` - you should see:
   ```json
   {
     "status": "ok",
     "message": "AttendTrack API running"
   }
   ```

### Frontend Setup

1. **Open in browser:**
   Navigate to `frontend/attendtrack_login_desktop.html.html` in your web browser.

2. **Authenticate:**
   Use one of the demo credentials below to login.

3. **Access role-specific dashboards:**
   - Admin: System management and statistics
   - Teacher: Mark attendance for enrolled students
   - Student: View personal attendance records

## Demo Credentials

After running `npm run seed`, use these credentials to login:

### Admin User
- **Email:** `admin@track.edu`
- **Password:** `demo1234`
- **Role:** admin

### Teacher User
- **Email:** `teacher@track.edu`
- **Password:** `demo1234`
- **Role:** teacher

### Student Users
- **Email:** `student1@track.edu`
- **Password:** `demo1234`
- **Role:** student

- **Email:** `student2@track.edu`
- **Password:** `demo1234`
- **Role:** student

- **Email:** `student3@track.edu`
- **Password:** `demo1234`
- **Role:** student

## Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, minlength: 6),
  role: String (enum: ['admin', 'teacher', 'student']),
  studentId: String (optional, for students),
  createdAt: Date (auto)
}
```

### Subject Schema
```javascript
{
  name: String (required),
  code: String (unique, uppercase),
  credits: Number (1-6),
  teacherName: String,
  createdBy: ObjectId (ref: User),
  totalClasses: Number,
  attendedClasses: Number,
  students: [ObjectId] (ref: User),
  attendancePercentage: virtual (attendedClasses/totalClasses * 100)
}
```

### Attendance Schema
```javascript
{
  subject: ObjectId (ref: Subject),
  date: Date,
  markedBy: ObjectId (ref: User),
  records: [{
    student: ObjectId (ref: User),
    status: String (enum: ['present', 'absent'])
  }],
  unique index: {subject, date}
}
```

## Authentication Flow

1. **Registration:** User provides name, email, password, and role
   - Password is hashed with bcryptjs (10 salts)
   - Stored in MongoDB as User document

2. **Login:** User provides email and password
   - Password compared with stored hash
   - JWT token generated (valid for 7 days)
   - Token includes: userId, name, email, role

3. **API Requests:** Token sent in Authorization header
   ```
   Authorization: Bearer <token>
   ```

4. **Token Verification:** Middleware extracts and validates token
   - Verified using JWT_SECRET
   - User data attached to request object
   - Role-based middleware checks permissions

5. **Logout:** Token removed from localStorage on client

## Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Access Frontend:**
Open `frontend/attendtrack_login_desktop.html.html` in your web browser

### Production Mode

**Start Backend:**
```bash
cd backend
npm start
```

## Key Implementation Details

- **JWT Storage:** Tokens stored in browser localStorage with key `attendtrack_token`
- **User Persistence:** User object stored in localStorage with key `attendtrack_user`
- **Attendance Unique Index:** Compound index on (subject, date) prevents duplicate daily records
- **Password Hashing:** Pre-save hook on User model automatically hashes passwords before storage
- **Role-Based Routes:** Middleware checks user role before allowing access to protected endpoints
- **Attendance Calculation:** Simple presence count divided by total classes, returned as percentage
- **CORS:** Enabled globally for development; restrict origins in production

## Troubleshooting

- **"Cannot connect to MongoDB":** Verify MongoDB is running and MONGO_URI in .env is correct
- **"Unauthorized" errors:** Check JWT token in localStorage or login again
- **"Database already exists":** Run `npm run seed` to reinitialize with demo data
- **Frontend not loading:** Ensure backend is running at port 5000, check browser console for CORS errors

## Future Enhancements

- Email notifications for low attendance
- Attendance reports generation (CSV/PDF)
- Multi-semester and academic year support
- Student attendance approval workflow
- Advanced analytics and dashboards
- Mobile app development
- Batch attendance import from CSV
- Holiday management and adjustments

---

**Created:** 2024
**Version:** 1.0.0
**License:** MIT