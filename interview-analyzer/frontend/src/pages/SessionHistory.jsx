import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { sessionService } from '../services/api'

const SessionHistory = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, week, month

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await sessionService.getAllSessions()
      setSessions(response.data)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionService.deleteSession(id)
        setSessions(sessions.filter(s => s._id !== id))
      } catch (error) {
        console.error('Error deleting session:', error)
        alert('Failed to delete session')
      }
    }
  }

  const getFilteredSessions = () => {
    const now = new Date()
    
    switch (filter) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return sessions.filter(s => new Date(s.createdAt) >= weekAgo)
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return sessions.filter(s => new Date(s.createdAt) >= monthAgo)
      default:
        return sessions
    }
  }

  const filteredSessions = getFilteredSessions()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Session History</h1>
          <p className="text-gray-600">Review your past interview sessions</p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-4 mb-6"
        >
          {['all', 'week', 'month'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f === 'all' ? 'All Time' : f === 'week' ? 'Last Week' : 'Last Month'}
            </button>
          ))}
        </motion.div>

        {filteredSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Sessions Found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'Start your first practice interview'
                : 'No sessions in this time period'}
            </p>
            <Link to="/interview" className="btn-primary">
              Start Interview
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {session.title || `Session ${filteredSessions.length - index}`}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(session.createdAt).toLocaleDateString()} at{' '}
                        {new Date(session.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>⏱️ Duration: {Math.floor(session.duration / 60)}m {session.duration % 60}s</span>
                      <span>💬 Words: {session.transcript ? session.transcript.split(' ').length : 0}</span>
                      <span>🗣️ Fillers: {session.fillerWords?.count || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">
                        {session.confidenceScore?.overall || 0}
                      </div>
                      <div className="text-xs text-gray-500">Confidence</div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {session.eyeContact?.percentage || 0}%
                      </div>
                      <div className="text-xs text-gray-500">Eye Contact</div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Link
                        to={`/session/${session._id}`}
                        className="btn-primary text-sm"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDelete(session._id)}
                        className="btn-danger text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionHistory
