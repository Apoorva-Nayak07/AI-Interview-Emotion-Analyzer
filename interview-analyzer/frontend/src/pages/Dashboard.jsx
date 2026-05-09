import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { sessionService } from '../services/api'

const Dashboard = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgConfidence: 0,
    avgEyeContact: 0,
    totalDuration: 0
  })

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await sessionService.getAllSessions()
      const sessionsData = response.data
      setSessions(sessionsData)
      calculateStats(sessionsData)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (sessionsData) => {
    if (sessionsData.length === 0) {
      setStats({
        totalSessions: 0,
        avgConfidence: 0,
        avgEyeContact: 0,
        totalDuration: 0
      })
      return
    }

    const totalSessions = sessionsData.length
    const avgConfidence = sessionsData.reduce((sum, s) => sum + (s.confidenceScore?.overall || 0), 0) / totalSessions
    const avgEyeContact = sessionsData.reduce((sum, s) => sum + (s.eyeContact?.percentage || 0), 0) / totalSessions
    const totalDuration = sessionsData.reduce((sum, s) => sum + (s.duration || 0), 0)

    setStats({
      totalSessions,
      avgConfidence: Math.round(avgConfidence),
      avgEyeContact: Math.round(avgEyeContact),
      totalDuration: Math.round(totalDuration / 60) // Convert to minutes
    })
  }

  const getConfidenceTrendData = () => {
    return sessions.slice(-7).map((session, index) => ({
      name: `Session ${index + 1}`,
      confidence: session.confidenceScore?.overall || 0,
      eyeContact: session.eyeContact?.percentage || 0
    }))
  }

  const getEmotionDistribution = () => {
    if (sessions.length === 0) return []

    const emotionTotals = {}
    sessions.forEach(session => {
      if (session.emotions && session.emotions.length > 0) {
        session.emotions.forEach(({ emotion }) => {
          emotionTotals[emotion] = (emotionTotals[emotion] || 0) + 1
        })
      }
    })

    const total = Object.values(emotionTotals).reduce((sum, count) => sum + count, 0)
    if (total === 0) return []

    return Object.entries(emotionTotals).map(([emotion, count]) => ({
      name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      value: Math.round((count / total) * 100)
    }))
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Track your interview performance over time</p>
          </div>
          <Link to="/interview" className="btn-primary">
            🎬 New Interview
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Sessions', value: stats.totalSessions, icon: '📊', color: 'blue' },
            { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, icon: '💯', color: 'green' },
            { label: 'Avg Eye Contact', value: `${stats.avgEyeContact}%`, icon: '👁️', color: 'purple' },
            { label: 'Total Practice', value: `${stats.totalDuration}m`, icon: '⏱️', color: 'yellow' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`card bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border border-${stat.color}-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Sessions Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your first practice interview to see analytics here
            </p>
            <Link to="/interview" className="btn-primary">
              Start First Interview
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Performance Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getConfidenceTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="confidence" stroke="#3b82f6" strokeWidth={2} name="Confidence" />
                    <Line type="monotone" dataKey="eyeContact" stroke="#10b981" strokeWidth={2} name="Eye Contact" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Emotion Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getEmotionDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getEmotionDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Recent Sessions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-700">
                  Recent Sessions
                </h3>
                <Link to="/history" className="text-primary-600 hover:text-primary-700 font-semibold">
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {sessions.slice(0, 5).map((session, index) => (
                  <Link
                    key={session._id}
                    to={`/session/${session._id}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {session.title || `Session ${sessions.length - index}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(session.createdAt).toLocaleDateString()} at{' '}
                          {new Date(session.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary-600">
                            {session.confidenceScore?.overall || 0}
                          </p>
                          <p className="text-xs text-gray-500">Confidence</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {session.eyeContact?.percentage || 0}%
                          </p>
                          <p className="text-xs text-gray-500">Eye Contact</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
