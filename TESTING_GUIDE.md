# Attendance System Testing Guide

## Overview
This guide walks through testing the Stitch attendance system end-to-end to verify that:
- Attendance data is correctly stored in the database
- API returns accurate attendance percentages
- Frontend displays real teacher-marked attendance
- Date-wise attendance marking works correctly

---

## Prerequisites

### 1. Backend Requirements
- Node.js installed
- MongoDB running locally (or connection string configured in `.env`)

### 2. Frontend Requirements
- HTTP server (Python 3 or Node.js)
- Modern browser with DevTools console access

---

## Setup Steps

### Step 1: Seed the Database

Terminal (in `backend/` folder):
```bash
cd backend
node seed.js
```

**Expected Output:**
```
Connected to MongoDB
Deleted existing data
Created 4 teachers
Created 60 students (20 per branch)
Created 4 subjects
Created demo attendance records

=== Demo Credentials ===
[... credential details ...]

Database seeded successfully!
```

**What was created:**
- 60 students: 20 CSE, 20 IT, 20 AIML (all enrolled in 4 subjects)
- 4 teachers with their subjects
- Demo attendance records:
  - Yesterday: Mathematics (70% present)
  - 2 days ago: Physics (80% present)
  - 3 days ago: Chemistry (75% present)

---

### Step 2: Start Backend Server

Terminal (in `backend/` folder):
```bash
npm start
```

**Expected Output:**
```
Server is running on port 5000
Connected to MongoDB
```

---

### Step 3: Start Frontend Server

Terminal (in `frontend/` folder):
```bash
npm start
```

**Expected Output:**
```
Starting up http-server, serving ./
```

Or if using Python:
```bash
python -m http.server 8000
```

---

## Testing Scenarios

### Scenario 1: View Attendance Dashboard (Student Login)

**Steps:**
1. Open browser: `http://localhost:8000/attendtrack_login_desktop.html.html`
2. Login with: `cse.student1@track.edu` | `demo1234`
3. You should see the **My Attendance Overview** page

**Expected Results:**
✅ Page shows overall attendance percentage (should be ~70-75%)
✅ Status shows "On Track" (green) or "Urgent: Action Required" (red) if <75%
✅ Each subject card shows:
   - Subject name and code
   - Percentage (70-80% range)
   - Sessions marked (e.g., "3 / 4 Sessions")
   - Progress bar matching the percentage
✅ All 4 subjects are visible

**If you see 0%:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for logs from `loadMyAttendance()` function
4. Look for error messages

**Debugging Logs to Check:**
```
Attendance API Response: {overallPercentage: XX, attendanceData: [...]}
Processed Attendance Data: [...]
Overall Percentage: XX
Subject: Mathematics, Percentage: XX, Present: X, Total: X
```

---

### Scenario 2: Refresh Data (Manual Refresh)

**Steps:**
1. Stay on the student dashboard (from Scenario 1)
2. Click the **Refresh** button (🔄 icon in top-right header)
3. Watch the icon spin 360 degrees
4. Verify data reloads

**Expected Results:**
✅ Refresh button rotates smoothly
✅ Data updates from API
✅ Console shows fresh logs

---

### Scenario 3: Mark New Attendance (Teacher)

**Steps:**
1. Open browser: `http://localhost:8000/teacher_mark_view_attendance_mobile.html.html`
2. Login with: `rajesh@track.edu` | `demo1234`
3. Select a **Branch** (CSE, IT, or AIML)
4. For first 3-4 students, click **Present** button
5. For remaining students, leave as **Absent** (or fill however you like)
6. Scroll to bottom and click **Submit Attendance**

**Expected Results:**
✅ Page shows branch selector with students
✅ Mark Present/Absent buttons work
✅ After submission, shows summary with all students and their percentages
✅ Prevents duplicate marking for same date
✅ If already marked today, shows alert: "Attendance already marked for today"

---

### Scenario 4: Check New Attendance on Student Dashboard

**Steps:**
1. Switch to student browser tab/session
2. Login with: `cse.student1@track.edu` | `demo1234`
3. Should show **today's** attendance in addition to previous days
4. Click **Refresh** button to reload

**Expected Results:**
✅ Overall percentage updates to reflect today's attendance
✅ If you marked 3/20 students as present, overall % should increase
✅ Specific subject shows the mix (some 70%, some 0% if marked today first time)

---

### Scenario 5: Check Date-wise Attendance (Try marking twice same day)

**Steps:**
1. As teacher, try marking attendance for same branch again
2. Should prevent duplicate marking

**Expected Results:**
🚫 Alert: "Attendance already marked for today"
✅ System only allows one marking per subject per day

**How it works:**
- Dates are normalized to midnight (00:00:00)
- No time component checked, just the date
- After 12:00 AM next day, can mark new attendance

---

### Scenario 6: Verify Database Directly (Optional)

**Terminal (in project root):**
```bash
mongo  # or mongosh
use stitch_db
db.attendances.find().pretty()
```

**Expected:**
- Should show documents with fields: `subject`, `date`, `markedBy`, `records`
- Each `record` has `student` ID and `status` (present/absent)
- Dates should be at midnight (00:00:00)

---

## Troubleshooting

### Issue: Shows 0% attendance
**Possible Causes:**
1. **Students not enrolled in subjects** → Check seed output
2. **No attendance records in database** → Verify teacher marked attendance
3. **API returning wrong format** → Check browser console logs

**Debug Steps:**
1. Open DevTools Console (F12)
2. Check logs for API response format
3. Look for empty `attendanceData` arrays
4. Check browser Network tab → getMyAttendance request
5. Compare API response with expected format

### Issue: Can't mark attendance as teacher
**Possible Causes:**
1. Wrong login (should be teacher role)
2. Backend server not running
3. API endpoint issue

**Debug Steps:**
1. Check browser Console for fetch errors
2. Check backend terminal for error logs
3. Verify teacher account has `role: "teacher"`

### Issue: Attendance not updating after teacher marks
**Possible Causes:**
1. API not being called correctly
2. Data transformation issue in frontend
3. Student refresh needed

**Debug Steps:**
1. Click **Refresh** button on student dashboard
2. Check if API is returning new data
3. Verify attendance was saved to database

---

## Expected Output Examples

### Student Dashboard (Normal Load):
```
AttendTrack
My Attendance Overview

Overall: 74% (with 🔴 Urgent badge)

📊 MATH-101: Mathematics
  72% | 3 / 4 Sessions | [Dr. Rajesh Kumar]

📊 PHY-101: Physics
  80% | 4 / 5 Sessions | [Prof. Anita Singh]

📊 CHEM-101: Chemistry
  75% | 3 / 4 Sessions | [Dr. Mohan Verma]

📊 PROG-101: Programming
  0% | 0 / 0 Sessions | [Ms. Priya Sharma]
```

### Console Logs (Expected):
```
Attendance API Response: {
  overallPercentage: 74,
  totalPresent: 10,
  totalAbsent: 5,
  totalClasses: 15,
  attendanceData: [...]
}
Processed Attendance Data: Array(4) [...]
Overall Percentage: 74
Subject: Mathematics, Percentage: 72, Present: 3, Total: 4
Subject: Physics, Percentage: 80, Present: 4, Total: 5
Subject: Chemistry, Percentage: 75, Present: 3, Total: 4
Subject: Programming, Percentage: 0, Present: 0, Total: 0
```

---

## Summary Checklist

- [ ] Backend started successfully (npm start)
- [ ] Frontend server started (npm start or python http.server)
- [ ] Database seeded (node seed.js)
- [ ] Student sees attendance with real percentages (not 0%)
- [ ] Refresh button works and reloads data
- [ ] Teacher can mark attendance without duplication
- [ ] New attendance marks update student dashboard
- [ ] Overall percentage calculates correctly
- [ ] Browser console shows proper API responses
- [ ] No JavaScript errors in console

---

## Login Credentials

### Admin
- Email: `admin@track.edu`
- Password: `demo1234`

### Teachers (for marking attendance)
1. Dr. Rajesh Kumar - `rajesh@track.edu`
2. Prof. Anita Singh - `anita@track.edu`
3. Dr. Mohan Verma - `mohan@track.edu`
4. Ms. Priya Sharma - `priya.s@track.edu`
- Password: `demo1234` (all)

### Students (for viewing attendance)
- CSE Students: `cse.student1@track.edu` to `cse.student20@track.edu`
- IT Students: `it.student1@track.edu` to `it.student20@track.edu`
- AIML Students: `aiml.student1@track.edu` to `aiml.student20@track.edu`
- Password: `demo1234` (all)

---

## Next Steps

If all tests pass: ✅ System is working correctly
If issues found: 
1. Check console logs for error messages
2. Review backend error logs
3. Verify database connectivity
4. Check API response format
