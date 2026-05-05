/**
 * Preset Service
 * Business logic for preset operations
 */

import Preset, { IPreset } from '../models/Preset';

/**
 * Get presets by user ID
 */
export const getPresetsbyUserId = async (userId: string): Promise<IPreset[]> => {
  return Preset.find({ userId }).lean();
};

/**
 * Get public presets
 */
export const getPublicPresets = async (): Promise<IPreset[]> => {
  return Preset.find({ publicPreset: true }).lean();
};

/**
 * Get preset by ID
 */
export const getPresetById = async (id: string): Promise<IPreset | null> => {
  return Preset.findById(id);
};

/**
 * Get preset by share token
 */
export const getPresetByShareToken = async (
  token: string
): Promise<IPreset | null> => {
  return Preset.findOne({ shareToken: token });
};

/**
 * Create new preset
 */
export const createPreset = async (presetData: any): Promise<IPreset> => {
  const preset = new Preset(presetData);
  return preset.save();
};

/**
 * Update preset
 */
export const updatePreset = async (
  id: string,
  updates: Partial<IPreset>
): Promise<IPreset | null> => {
  return Preset.findByIdAndUpdate(id, updates, { new: true });
};

/**
 * Delete preset
 */
export const deletePreset = async (id: string): Promise<any> => {
  return Preset.findByIdAndDelete(id);
};
