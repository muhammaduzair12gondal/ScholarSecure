import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// ---------- Input validation rules ----------
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail()
    .isLength({ max: 200 })
    .withMessage('Email must be at most 200 characters.'),
  body('password')
    .isString()
    .isLength({ min: 1, max: 128 })
    .withMessage('Password is required and must be at most 128 characters.'),
];

// ---------- POST /api/auth/login ----------
router.post('/login', loginValidation, async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { email, password } = req.body;

    // Find user by email — use parameterized Mongoose query (prevents NoSQL injection)
    const user = await User.findOne({ email });
    if (!user) {
      // Generic message to prevent user enumeration
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate signed JWT
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleLabel: user.roleLabel,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    });

    res.json({
      message: 'Login successful.',
      token,
      user: payload,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    // Never expose internal error details to the client
    res.status(500).json({ message: 'An internal error occurred. Please try again.' });
  }
});

// ---------- GET /api/auth/me ----------
// Returns the current user profile from a valid JWT (used on frontend reload)
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleLabel: user.roleLabel,
    });
  } catch (err) {
    console.error('Auth/me error:', err.message);
    res.status(500).json({ message: 'An internal error occurred.' });
  }
});

export default router;
