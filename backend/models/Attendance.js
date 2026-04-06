const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    branch: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['present', 'absent'],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Compound unique index for subject-based attendance
attendanceSchema.index({ subject: 1, date: 1 }, { unique: false });

// Compound unique index for branch-based attendance
attendanceSchema.index({ branch: 1, date: 1 }, { unique: false });

module.exports = mongoose.model('Attendance', attendanceSchema);
