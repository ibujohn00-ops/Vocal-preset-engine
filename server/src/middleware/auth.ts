/**
 * Authentication Middleware
 * Validates JWT tokens and protects routes
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as DecodedToken;

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Token Expired',
        message: 'Your session has expired. Please login again.',
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Invalid Token',
        message: 'Token is invalid or malformed',
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to authenticate token',
      });
    }
  }
};

/**
 * Optional authentication middleware
 * Doesn't require token but attaches user if provided
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as DecodedToken;

      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
    }

    next();
  } catch (error) {
    // Continue even if token is invalid
    next();
  }
};
