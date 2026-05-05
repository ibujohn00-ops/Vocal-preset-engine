/**
 * Authentication Controller
 * Handles user registration, login, and session management
 */

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

/**
 * Generate JWT token
 */
const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET || 'your-secret-key',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

/**
 * Register new user
 */
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists',
      });
      return;
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password,
      name,
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error('[ERROR] Registration failed:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Failed to create user account',
    });
  }
};

/**
 * Login user
 */
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and get password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
      return;
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('[ERROR] Login failed:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Failed to authenticate user',
    });
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No user context',
      });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'The user account does not exist',
      });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('[ERROR] Get user failed:', error);
    res.status(500).json({
      error: 'Failed to retrieve user',
      message: 'Error fetching user information',
    });
  }
};

/**
 * Logout user (client-side mainly, but we can invalidate tokens server-side if needed)
 */
export const logout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('[ERROR] Logout failed:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'Failed to logout user',
    });
  }
};
