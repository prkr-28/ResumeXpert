import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createResume,
  deleteResume,
  getResumeById,
  getUserResume,
  updateResume,
} from '../controllers/resumeController.js';
import { uploaResumeImage } from '../controllers/uploadImages.js';

const resumeRoutes = express.Router();
resumeRoutes.post('/', protect, createResume);
resumeRoutes.get('/', protect, getUserResume);
resumeRoutes.get('/:id'.protect, getResumeById);

resumeRoutes.put('/:id', protect, updateResume);
resumeRoutes.put('/:id/uplod-images', protect, uploaResumeImage);
resumeRoutes.delete('/:id', protect, deleteResume);
export default resumeRoutes;
