import natural from 'natural';
import Session from '../models/MockSession.model.js';

const tokenizer = new natural.WordTokenizer();

// Common filler words
const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'so', 'actually', 'basically',
  'literally', 'right', 'i mean', 'kind of', 'sort of', 'well',
  'anyway', 'honestly', 'obviously', 'seriously'
];

// @desc    Analyze speech transcript
// @route   POST /api/analysis/speech
// @access  Private
export const analyzeSpeech = async (req, res) => {
  try {
    const { sessionId, transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ message: 'Transcript is required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Tokenize transcript
    const words = tokenizer.tokenize(transcript.toLowerCase());
    const totalWords = words.length;

    // Detect filler words
    const fillerWordData = {};
    let totalFillerCount = 0;

    FILLER_WORDS.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = transcript.match(regex);
      const count = matches ? matches.length : 0;
      
      if (count > 0) {
        fillerWordData[filler] = count;
        totalFillerCount += count;
      }
    });

    // Calculate filler word score (0-100, lower filler words = higher score)
    const fillerWordPercentage = (totalFillerCount / totalWords) * 100;
    const fillerWordScore = Math.max(0, 100 - (fillerWordPercentage * 10));

    // Calculate speech clarity score
    const avgWordLength = words.reduce((acc, word) => acc + word.length, 0) / totalWords;
    const clarityScore = Math.min(100, (avgWordLength / 6) * 100);

    // Update session
    session.transcript = transcript;
    session.fillerWords = {
      count: totalFillerCount,
      words: Object.entries(fillerWordData).map(([word, count]) => ({
        word,
        count,
        timestamps: [],
      })),
    };

    await session.save();

    res.json({
      totalWords,
      fillerWords: fillerWordData,
      totalFillerCount,
      fillerWordScore,
      clarityScore,
      fillerWordPercentage: fillerWordPercentage.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save emotion data
// @route   POST /api/analysis/emotion
// @access  Private
export const saveEmotionData = async (req, res) => {
  try {
    const { sessionId, emotions } = req.body;

    if (!emotions || !Array.isArray(emotions)) {
      return res.status(400).json({ message: 'Emotions array is required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Add emotions to session
    session.emotions.push(...emotions);

    // Calculate emotion stability score
    const emotionCounts = {};
    emotions.forEach(({ emotion }) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
      emotionCounts[a] > emotionCounts[b] ? a : b
    );

    const stabilityScore = (emotionCounts[dominantEmotion] / emotions.length) * 100;

    await session.save();

    res.json({
      emotionCounts,
      dominantEmotion,
      stabilityScore,
      totalEmotions: emotions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save eye contact data
// @route   POST /api/analysis/eye-contact
// @access  Private
export const saveEyeContactData = async (req, res) => {
  try {
    const { sessionId, eyeContactData } = req.body;

    if (!eyeContactData) {
      return res.status(400).json({ message: 'Eye contact data is required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.eyeContact = eyeContactData;
    await session.save();

    res.json({ message: 'Eye contact data saved', eyeContactData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate AI feedback
// @route   POST /api/analysis/feedback
// @access  Private
export const generateFeedback = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Calculate overall confidence score
    const emotionStability = calculateEmotionStability(session.emotions);
    const speechClarity = calculateSpeechClarity(session.transcript, session.fillerWords.count);
    const eyeContactScore = session.eyeContact.percentage;
    const fillerWordScore = calculateFillerWordScore(session.fillerWords.count, session.transcript);

    const overallScore = (
      emotionStability * 0.3 +
      speechClarity * 0.25 +
      eyeContactScore * 0.25 +
      fillerWordScore * 0.2
    );

    // Generate feedback
    const feedback = {
      strengths: generateStrengths(session),
      improvements: generateImprovements(session),
      summary: generateSummary(overallScore, session),
      tips: generateTips(session),
    };

    // Update session
    session.confidenceScore = {
      overall: Math.round(overallScore),
      emotionStability: Math.round(emotionStability),
      speechClarity: Math.round(speechClarity),
      eyeContactScore: Math.round(eyeContactScore),
      fillerWordScore: Math.round(fillerWordScore),
    };
    session.feedback = feedback;
    session.status = 'analyzed';

    await session.save();

    res.json({
      confidenceScore: session.confidenceScore,
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper functions
function calculateEmotionStability(emotions) {
  if (!emotions || emotions.length === 0) return 50;

  const emotionCounts = {};
  emotions.forEach(({ emotion }) => {
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });

  const positiveEmotions = ['happy', 'neutral'];
  const positiveCount = positiveEmotions.reduce(
    (acc, emotion) => acc + (emotionCounts[emotion] || 0),
    0
  );

  return (positiveCount / emotions.length) * 100;
}

function calculateSpeechClarity(transcript, fillerCount) {
  if (!transcript) return 50;

  const words = tokenizer.tokenize(transcript);
  const totalWords = words.length;

  if (totalWords === 0) return 50;

  const fillerPercentage = (fillerCount / totalWords) * 100;
  return Math.max(0, 100 - fillerPercentage * 5);
}

function calculateFillerWordScore(fillerCount, transcript) {
  if (!transcript) return 50;

  const words = tokenizer.tokenize(transcript);
  const totalWords = words.length;

  if (totalWords === 0) return 50;

  const fillerPercentage = (fillerCount / totalWords) * 100;
  return Math.max(0, 100 - fillerPercentage * 10);
}

function generateStrengths(session) {
  const strengths = [];

  if (session.eyeContact.percentage > 70) {
    strengths.push('Excellent eye contact maintained throughout the interview');
  }

  if (session.confidenceScore.emotionStability > 70) {
    strengths.push('Demonstrated emotional stability and composure');
  }

  if (session.fillerWords.count < 10) {
    strengths.push('Minimal use of filler words, showing clear communication');
  }

  if (session.transcript && session.transcript.split(' ').length > 100) {
    strengths.push('Provided detailed and comprehensive responses');
  }

  if (strengths.length === 0) {
    strengths.push('Completed the interview session successfully');
  }

  return strengths;
}

function generateImprovements(session) {
  const improvements = [];

  if (session.eyeContact.percentage < 50) {
    improvements.push('Work on maintaining more consistent eye contact with the camera');
  }

  if (session.fillerWords.count > 20) {
    improvements.push('Reduce the use of filler words by pausing before speaking');
  }

  if (session.confidenceScore.emotionStability < 50) {
    improvements.push('Practice maintaining a calm and positive demeanor');
  }

  if (session.transcript && session.transcript.split(' ').length < 50) {
    improvements.push('Provide more detailed responses to interview questions');
  }

  if (improvements.length === 0) {
    improvements.push('Continue practicing to further refine your interview skills');
  }

  return improvements;
}

function generateSummary(score, session) {
  if (score >= 80) {
    return 'Outstanding performance! You demonstrated excellent interview skills with strong eye contact, clear communication, and emotional stability. Keep up the great work!';
  } else if (score >= 60) {
    return 'Good performance overall. You showed solid interview skills with room for improvement in a few areas. Focus on the suggested improvements to enhance your performance.';
  } else if (score >= 40) {
    return 'Decent effort with several areas for improvement. Practice the suggested tips to build confidence and improve your interview presence.';
  } else {
    return 'This session shows potential, but there are significant areas to work on. Regular practice and focusing on the improvement areas will help you develop stronger interview skills.';
  }
}

function generateTips(session) {
  const tips = [
    'Practice the STAR method (Situation, Task, Action, Result) for behavioral questions',
    'Take a brief pause before answering to collect your thoughts',
    'Maintain a confident posture and smile naturally',
    'Research the company and role thoroughly before the interview',
    'Prepare specific examples from your experience',
  ];

  if (session.eyeContact.percentage < 60) {
    tips.unshift('Look directly at the camera to simulate eye contact');
  }

  if (session.fillerWords.count > 15) {
    tips.unshift('Practice speaking slowly and deliberately to reduce filler words');
  }

  return tips.slice(0, 5);
}
