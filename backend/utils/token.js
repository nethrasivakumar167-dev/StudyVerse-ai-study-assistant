import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'studyverse_dev_secret';

export const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
