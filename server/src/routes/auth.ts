/**
 * Authentication Routes
 * Handles user registration, login, and session management
 */

import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import {
  register,
  login,
  getCurrentUser,
  logout,
} from '../controllers/authController';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    // Validate request
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message,
      });
      return;
    }

    await register(req, res);
  })
);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    // Validate request
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message,
      });
      return;
    }

    await login(req, res);
  })
);

/**
 * GET /api/auth/me
 * Get current user information (protected route)
 */
router.get(
  '/me',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await getCurrentUser(req, res);
  })
);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post(
  '/logout',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await logout(req, res);
  })
);

export default router;
