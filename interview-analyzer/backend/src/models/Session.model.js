import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Interview Session',
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    transcript: {
      type: String,
      default: '',
    },
    emotions: [
      {
        timestamp: Number,
        emotion: String,
        confidence: Number,
      },
    ],
    fillerWords: {
      count: {
        type: Number,
        default: 0,
      },
      words: [
        {
          word: String,
          count: Number,
          timestamps: [Number],
        },
      ],
    },
    eyeContact: {
      percentage: {
        type: Number,
        default: 0,
      },
      totalTime: {
        type: Number,
        default: 0,
      },
      lookingAwayCount: {
        type: Number,
        default: 0,
      },
    },
    confidenceScore: {
      overall: {
        type: Number,
        default: 0,
      },
      emotionStability: {
        type: Number,
        default: 0,
      },
      speechClarity: {
        type: Number,
        default: 0,
      },
      eyeContactScore: {
        type: Number,
        default: 0,
      },
      fillerWordScore: {
        type: Number,
        default: 0,
      },
    },
    feedback: {
      strengths: [String],
      improvements: [String],
      summary: String,
      tips: [String],
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'analyzed'],
      default: 'in-progress',
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;
