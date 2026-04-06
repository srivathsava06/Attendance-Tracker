# 🚀 Quick Start Reference

## 30-Second Setup

```bash
# Terminal 1 - Backend
cd backend
node seed.js  # Populates demo data
npm start     # Starts server on port 5000

# Terminal 2 - Frontend  
cd frontend
npm start     # Starts http-server on port 8000

# Browser
Visit: http://localhost:8000/attendtrack_login_desktop.html.html
```

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Student** | `cse.student1@track.edu` | `demo1234` |
| **Teacher** | `rajesh@track.edu` | `demo1234` |
| **Admin** | `admin@track.edu` | `demo1234` |

---

## What to Expect

### Student Dashboard
✅ Overall attendance: **74%** (green or red based on threshold)
✅ 4 subject cards showing:
   - Subject name & code
   - Percentage (70-80% range)
   - Sessions: "X / Y Sessions"
   - Teacher name
✅ Warning banner if <75%

### Console Logs (DevTools F12)
```
Attendance API Response: {...}
Processed Attendance Data: [...]
Overall Percentage: 74
Subject: Mathematics, Percentage: 72, Present: 3, Total: 4
```

### New Features This Session
🔄 **Refresh Button** - Top-right header, rotates when clicked
📝 **Debug Logs** - Shows API response flow in console
📊 **Demo Data** - Attendance for last 3 days pre-populated
📖 **Testing Guide** - Complete walkthrough in `TESTING_GUIDE.md`

---

## If Showing 0%

**Step 1:** Open DevTools (F12) → Console tab
**Step 2:** Look for error messages
**Step 3:** Check if `Attendance API Response` shows data
**Step 4:** Verify backend stdout shows requests

**If API returns empty data:**
- Run `node seed.js` again
- Check MongoDB connection
- Verify students are enrolled in subjects

---

## File Locations

| File | Purpose |
|------|---------|
| `backend/seed.js` | Create demo data |
| `frontend/student_my_attendance_full_width.html.html` | Student dashboard (with refresh + logs) |
| `frontend/teacher_mark_view_attendance_mobile.html.html` | Teacher marking interface |
| `TESTING_GUIDE.md` | Comprehensive test scenarios |
| `SESSION_SUMMARY.md` | Detailed changes and features |

---

## API Response Expected

```json
{
  "overallPercentage": 74,
  "totalPresent": 10,
  "totalAbsent": 5,
  "totalClasses": 15,
  "attendanceData": [
    {
      "subject": {
        "name": "Mathematics",
        "code": "MATH-101",
        "teacherName": "Dr. Rajesh Kumar"
      },
      "presentClasses": 3,
      "totalClasses": 4,
      "percentage": 75
    }
  ]
}
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open DevTools | **F12** |
| Refresh Page | **F5** or **Ctrl+R** |
| Clear Console | Type `clear()` and press Enter |
| Filter Logs | Click 🔍 and search term |

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Shows 0% | Re-run `node seed.js` in backend |
| "Cannot GET" | Make sure frontend server running (npm start) |
| API Error | Check backend terminal for logs |
| No logs in console | Open DevTools BEFORE logging in |
| Button doesn't spin | Check browser console for JS errors |

---

## Demo Attendance Schedule

- **Yesterday:** Mathematics marked (70% present) ✅
- **2 days ago:** Physics marked (80% present) ✅
- **3 days ago:** Chemistry marked (75% present) ✅
- **Today:** Nothing marked (students can refresh after teacher marks)

All 60 students enrolled in all 4 subjects!

---

## Architecture Overview

```
Frontend (Port 8000)
    ↓ Makes fetch request
API Gateway (Port 5000)
    ↓ Queries database
MongoDB
    ↓ Returns attendance records
Backend Calculation
    ↓ Computes percentages
API Response
    ↓ Frontend renders cards
Student Sees Real Attendance ✅
```

---

## Features Implemented

✅ **Attendance Accuracy** - Calculates from actual marked records
✅ **Date-wise Marking** - One entry per subject per calendar day
✅ **Real-time Refresh** - Manual reload button in header
✅ **Debug Logging** - Console shows data flow
✅ **Demo Data** - Immediate testing without manual marking
✅ **Responsive UI** - Works on desktop & mobile
✅ **Error Handling** - Clear error messages
✅ **Status Indicators** - Color-coded (green/red based on threshold)

---

## Next Steps After Testing

1. ✅ Verify all attendance displays correctly
2. ✅ Test teacher marking workflow
3. ✅ Confirm percentage calculations
4. ✅ Check date-wise separation
5. Deploy to production
6. Train teachers and students
7. Monitor for issues

---

## Support

**Check These First:**
1. Browser console (F12) for errors
2. Backend terminal for server logs
3. MongoDB for data verification
4. Network tab for API response

**Then Read:**
1. `TESTING_GUIDE.md` - Full test scenarios
2. `SESSION_SUMMARY.md` - Technical details
3. Console logs - Data flow tracking

---

**System Status: ✅ Ready for Testing**

Last Updated: Current Session
Demo Data: Populated ✅
Logging: Enabled ✅
Refresh Button: Active ✅
