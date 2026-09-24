import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'studyverse_dev_secret';

/** Protects user-specific endpoints: requires a valid Bearer JWT. */
export const protect = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized: no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized: invalid or expired token' });
  }
};
