import mongoose from 'mongoose';

/**
 * Connects to MongoDB.
 * - Uses MONGODB_URI when configured (local MongoDB or Atlas).
 * - Otherwise boots an in-memory MongoDB so the app works with zero setup.
 */
export const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const memServer = await MongoMemoryServer.create();
    uri = memServer.getUri();
    console.log('[DB] MONGODB_URI not set — started an in-memory MongoDB for local development.');
  }

  await mongoose.connect(uri);
  console.log('[DB] MongoDB connected');
};
