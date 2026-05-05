/**
 * User Service
 * Business logic for user operations
 */

import User, { IUser } from '../models/User';

/**
 * Find user by email
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email: email.toLowerCase() });
};

/**
 * Find user by ID
 */
export const findUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

/**
 * Create new user
 */
export const createUser = async (
  email: string,
  password: string,
  name: string
): Promise<IUser> => {
  const user = new User({
    email: email.toLowerCase(),
    password,
    name,
  });

  return user.save();
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  id: string,
  updates: Partial<IUser>
): Promise<IUser | null> => {
  return User.findByIdAndUpdate(id, updates, { new: true });
};
