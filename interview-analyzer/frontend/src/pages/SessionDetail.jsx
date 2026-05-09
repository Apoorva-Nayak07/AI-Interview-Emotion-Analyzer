import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      const response = await api.get(`/sessions/${id}`);
      setSession(response.data);
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await api.delete(`/sessions/${id}`);
        navigate('/history');
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session not found</h2>
          <Link to="/history" className="btn-primary">
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  const emotionData = session.emotions.reduce((acc, { emotion }) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});

  const emotionChartData = Object.entries(emotionData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const confidenceData = [
    { name: 'Overall', score: session.confidenceScore.overall },
    { name: 'Emotion', score: session.confidenceScore.emotionStability },
    { name: 'Speech', score: session.confidenceScore.speechClarity },
    { name: 'Eye Contact', score: session.confidenceScore.eyeContactScore },
    { name: 'Filler Words', score: session.confidenceScore.fillerWordScore },
  ];

  const fillerWordsData = session.fillerWords.words.map(({ word, count }) => ({
    word,
    count,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <Link to="/history" className="text-primary-600 hover:text-primary-700 mb-2 inline-block">
              ← Back to History
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
            <p className="text-gray-600">
              {new Date(session.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <button onClick={handleDelete} className="btn-secondary text-red-600 hover:bg-red-50">
            Delete Session
          </button>
        </div>

        {/* Overall Score */}
        <div className="card bg-gradient-to-r from-primary-500 to-purple-600 text-white">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Overall Confidence Score</h2>
            <div className="text-6xl font-bold mb-2">{session.confidenceScore.overall}</div>
            <div className="text-lg opacity-90">out of 100</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
              </p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Eye Contact</p>
              <p className="text-2xl font-bold text-gray-900">{session.eyeContact.percentage}%</p>
            </div>
            <div className="text-4xl">👁️</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Filler Words</p>
              <p className="text-2xl font-bold text-gray-900">{session.fillerWords.count}</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Confidence Breakdown */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Confidence Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Emotion Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emotionChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {emotionChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Filler Words */}
      {fillerWordsData.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="card mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Filler Words Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fillerWordsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="word" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Feedback */}
      {session.feedback && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="card mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Generated Feedback</h3>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
            <p className="text-gray-700">{session.feedback.summary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✓ Strengths</h4>
              <ul className="space-y-2">
                {session.feedback.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-orange-600 mb-2">→ Areas for Improvement</h4>
              <ul className="space-y-2">
                {session.feedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-primary-600 mb-2">💡 Tips for Next Time</h4>
            <ul className="space-y-2">
              {session.feedback.tips.map((tip, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Transcript */}
      {session.transcript && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Transcript</h3>
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">{session.transcript}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SessionDetail;
