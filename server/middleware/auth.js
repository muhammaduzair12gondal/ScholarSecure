import jwt from 'jsonwebtoken';

/**
 * Middleware: Verify JWT and attach decoded user to req.user.
 * Rejects requests with missing, invalid, or expired tokens.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email, role, roleLabel }
    next();
  } catch (err) {
    // Do not expose internal error details to the client
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please sign in again.' });
    }
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

/**
 * Middleware factory: Restrict access to specific roles.
 * @param  {...string} roles – allowed role names (e.g. 'student', 'officer')
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
}
