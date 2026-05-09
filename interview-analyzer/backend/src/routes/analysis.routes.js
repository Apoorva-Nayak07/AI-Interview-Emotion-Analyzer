import express from 'express';
import {
  analyzeSpeech,
  saveEmotionData,
  saveEyeContactData,
  generateFeedback,
} from '../controllers/analysis.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/speech', analyzeSpeech);
router.post('/emotion', saveEmotionData);
router.post('/eye-contact', saveEyeContactData);
router.post('/feedback', generateFeedback);

export default router;
