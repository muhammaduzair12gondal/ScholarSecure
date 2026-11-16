import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Application from '../models/Application.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All application routes require authentication
router.use(authenticate);

const SCHOLARSHIP_OPTIONS = [
  'HEC Need-Based Scholarship',
  'Punjab Educational Endowment Fund',
  'University Merit Support Grant',
  'Digital Skills Access Scholarship',
];

// ---------- Validation rules for creating an application ----------
const createValidation = [
  body('scholarship')
    .isString()
    .isIn(SCHOLARSHIP_OPTIONS)
    .withMessage('Please select a valid scholarship.'),
  body('studyLevel')
    .isString()
    .isIn(['Undergraduate', 'Graduate', 'Postgraduate'])
    .withMessage('Please select a valid study level.'),
  body('cgpa')
    .isString()
    .isLength({ min: 1, max: 4 })
    .withMessage('CGPA is required (max 4 characters).')
    .custom((value) => {
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0 || n > 4) {
        throw new Error('CGPA must be a number between 0.00 and 4.00.');
      }
      return true;
    }),
  body('statement')
    .isString()
    .isLength({ min: 20, max: 500 })
    .withMessage('Personal statement must be between 20 and 500 characters.')
    .customSanitizer((value) => value.replace(/[<>]/g, '')),
];

// ---------- POST /api/applications  (Student only) ----------
router.post('/', authorize('student'), createValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, message: errors.array()[0].msg });
  }

  try {
    const { scholarship, studyLevel, cgpa, statement } = req.body;
    const parsedCgpa = Number(cgpa);

    // Generate sequential app ID by finding the highest existing number
    const allApps = await Application.find({}, { appId: 1 });
    let nextNumber = 1001;
    for (const app of allApps) {
      const num = Number(String(app.appId).replace('APP-', ''));
      if (Number.isFinite(num) && num >= nextNumber) nextNumber = num + 1;
    }

    const application = await Application.create({
      appId: `APP-${nextNumber}`,
      studentId: req.user.id,
      studentName: req.user.name,
      scholarship,
      studyLevel,
      cgpa: parsedCgpa.toFixed(2),
      statement,
    });

    res.status(201).json({
      ok: true,
      message: `${application.appId} submitted successfully.`,
      application,
    });
  } catch (err) {
    console.error('Create application error:', err.message);
    res.status(500).json({ ok: false, message: 'Failed to create application. Please try again.' });
  }
});

// ---------- GET /api/applications  (Role-aware) ----------
// Students see only their own; officers see all
router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'student') {
      // Students can only retrieve their own applications
      filter = { studentId: req.user.id };
    }
    // Officers see all applications (no filter)

    const applications = await Application.find(filter).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Get applications error:', err.message);
    res.status(500).json({ message: 'Failed to retrieve applications.' });
  }
});

// ---------- PATCH /api/applications/:appId/status  (Officer only) ----------
const statusValidation = [
  body('status')
    .isString()
    .isIn(['Submitted', 'Pending review', 'Under review', 'Approved', 'Rejected'])
    .withMessage('Invalid status value.'),
];

router.patch(
  '/:appId/status',
  authorize('officer'),
  statusValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ok: false, message: errors.array()[0].msg });
    }

    try {
      const { appId } = req.params;
      const { status } = req.body;

      // Parameterized query – safe from injection
      const application = await Application.findOneAndUpdate(
        { appId },
        { status },
        { new: true, runValidators: true }
      );

      if (!application) {
        return res.status(404).json({ ok: false, message: 'Application not found.' });
      }

      res.json({
        ok: true,
        message: `${appId} marked as ${status}.`,
        application,
      });
    } catch (err) {
      console.error('Update status error:', err.message);
      res.status(500).json({ ok: false, message: 'Failed to update application status.' });
    }
  }
);

export default router;
