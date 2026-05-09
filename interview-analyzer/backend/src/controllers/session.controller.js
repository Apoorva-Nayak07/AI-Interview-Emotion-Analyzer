import Session from '../models/MockSession.model.js';
import User from '../models/MockUser.model.js';

// @desc    Get all sessions for user
// @route   GET /api/sessions
// @access  Private
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-transcript'); // Exclude large transcript field

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { title } = req.body;

    const session = await Session.create({
      user: req.user._id,
      title: title || `Interview Session - ${new Date().toLocaleDateString()}`,
    });

    // Add session to user's sessions array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { sessions: session._id },
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
export const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Session.findByIdAndDelete(req.params.id);

    // Remove session from user's sessions array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { sessions: req.params.id },
    });

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/sessions/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id });

    const stats = {
      totalSessions: sessions.length,
      totalDuration: sessions.reduce((acc, session) => acc + session.duration, 0),
      averageConfidence: sessions.length > 0
        ? sessions.reduce((acc, session) => acc + session.confidenceScore.overall, 0) / sessions.length
        : 0,
      averageEyeContact: sessions.length > 0
        ? sessions.reduce((acc, session) => acc + session.eyeContact.percentage, 0) / sessions.length
        : 0,
      totalFillerWords: sessions.reduce((acc, session) => acc + session.fillerWords.count, 0),
      recentSessions: sessions.slice(0, 5),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
