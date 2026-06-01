import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async ({ userId, action, description, meta = {} }) => {
  try {
    await ActivityLog.create({ user: userId, action, description, meta });
  } catch (error) {
    console.error('Activity logging failed', error.message);
  }
};
