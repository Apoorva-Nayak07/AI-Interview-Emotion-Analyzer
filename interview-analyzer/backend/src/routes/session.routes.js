import express from 'express';
import {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  getStats,
} from '../controllers/session.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getSessions).post(createSession);
router.route('/stats').get(getStats);
router.route('/:id').get(getSession).put(updateSession).delete(deleteSession);

export default router;
