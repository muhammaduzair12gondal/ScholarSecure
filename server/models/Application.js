import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    appId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    scholarship: {
      type: String,
      required: true,
      enum: [
        'HEC Need-Based Scholarship',
        'Punjab Educational Endowment Fund',
        'University Merit Support Grant',
        'Digital Skills Access Scholarship',
      ],
    },
    studyLevel: {
      type: String,
      required: true,
      enum: ['Undergraduate', 'Graduate', 'Postgraduate'],
    },
    cgpa: {
      type: String,
      required: true,
      maxlength: 4,
    },
    statement: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 500,
    },
    status: {
      type: String,
      default: 'Submitted',
      enum: ['Submitted', 'Pending review', 'Under review', 'Approved', 'Rejected'],
    },
    documentStatus: {
      type: String,
      default: 'Awaiting verification',
      maxlength: 100,
    },
    phone: {
      type: String,
      default: 'Not provided',
      maxlength: 30,
    },
    cnic: {
      type: String,
      default: 'Not provided',
      maxlength: 30,
    },
    internalNote: {
      type: String,
      default: 'New application awaiting officer verification.',
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
