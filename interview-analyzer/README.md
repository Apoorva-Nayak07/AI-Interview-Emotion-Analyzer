# AI-Powered Interview Emotion Analyzer

A comprehensive web application that analyzes interview performance using AI-powered emotion detection, speech analysis, and behavioral insights.

## Features

- 🎥 **Webcam Recording** - Record interview sessions in real-time
- 🗣️ **Speech-to-Text** - Convert speech to text for analysis
- 📊 **Filler Word Detection** - Identify and count filler words (um, uh, like, etc.)
- 😊 **Emotion Analysis** - Real-time emotion detection using TensorFlow.js
- 👁️ **Eye Contact Detection** - Track and analyze eye contact patterns
- 💯 **Confidence Scoring** - AI-powered confidence assessment
- 🤖 **AI Feedback** - Generate personalized interview feedback
- 📈 **Analytics Dashboard** - Comprehensive performance metrics
- 📜 **Session History** - Track and review past interviews
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- Framer Motion
- TensorFlow.js
- React Webcam
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Natural (NLP)
- JWT Authentication

## Project Structure

```
interview-analyzer/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and AI services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── context/        # React context providers
│   │   └── assets/         # Static assets
│   └── public/
└── backend/
    ├── src/
    │   ├── controllers/    # Route controllers
    │   ├── models/         # MongoDB models
    │   ├── routes/         # API routes
    │   ├── middleware/     # Custom middleware
    │   ├── services/       # Business logic
    │   └── utils/          # Utility functions
    └── uploads/            # File uploads directory
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd interview-analyzer/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview-analyzer
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd interview-analyzer/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Create an account or login
3. Start a new interview session
4. Allow camera and microphone permissions
5. Begin your practice interview
6. Receive real-time feedback and analysis
7. Review detailed analytics in the dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Analysis
- `POST /api/analysis/emotion` - Analyze emotions
- `POST /api/analysis/speech` - Analyze speech
- `POST /api/analysis/feedback` - Generate AI feedback

## Features in Detail

### Emotion Analysis
Uses TensorFlow.js face-landmarks-detection model to identify:
- Happy
- Sad
- Angry
- Surprised
- Neutral
- Fearful

### Speech Analysis
- Filler word detection (um, uh, like, you know, etc.)
- Speech pace analysis
- Clarity assessment
- Word count and duration tracking

### Eye Contact Detection
- Tracks gaze direction
- Calculates eye contact percentage
- Provides improvement suggestions

### Confidence Scoring
Combines multiple factors:
- Emotion stability
- Speech clarity
- Eye contact
- Filler word frequency
- Overall composure

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions, please open an issue on GitHub.
