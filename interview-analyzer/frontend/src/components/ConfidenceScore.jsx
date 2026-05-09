import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const ConfidenceScore = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    // Animate score counting up
    let start = 0
    const end = score
    const duration = 1000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayScore(end)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [score])

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  const getScoreBg = () => {
    if (score >= 80) return 'from-green-400 to-green-600'
    if (score >= 60) return 'from-blue-400 to-blue-600'
    if (score >= 40) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  return (
    <div className="card text-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Confidence Score
      </h3>
      
      <div className="relative w-40 h-40 mx-auto mb-4">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-200"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 70}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 70 * (1 - displayScore / 100)
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={getScoreColor()}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div>
            <div className={`text-4xl font-bold ${getScoreColor()}`}>
              {displayScore}
            </div>
            <div className="text-sm text-gray-500">/ 100</div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getScoreBg()} text-white font-semibold`}
      >
        {getScoreLabel()}
      </motion.div>
    </div>
  )
}

export default ConfidenceScore
