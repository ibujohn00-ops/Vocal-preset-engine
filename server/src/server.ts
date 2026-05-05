/**
 * VocalLab AI - Main Server Entry Point
 * Sets up Express application and starts the server
 */

import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vocallab';

/**
 * Connect to MongoDB
 */
const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[INFO] MongoDB connected successfully');
  } catch (error) {
    console.error('[ERROR] MongoDB connection failed:', error);
    // Exit process if database connection fails
    process.exit(1);
  }
};

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to database first
    await connectDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`[INFO] VocalLab AI Server running on http://localhost:${PORT}`);
      console.log(`[INFO] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[INFO] Database: ${MONGODB_URI}`);
    });
  } catch (error) {
    console.error('[ERROR] Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('[ERROR] Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('[ERROR] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
