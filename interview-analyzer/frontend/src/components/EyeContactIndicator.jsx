import { motion } from 'framer-motion'

const EyeContactIndicator = ({ percentage, isLooking }) => {
  const getColor = () => {
    if (percentage >= 70) return 'green'
    if (percentage >= 50) return 'blue'
    if (percentage >= 30) return 'yellow'
    return 'red'
  }

  const color = getColor()

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Eye Contact
      </h3>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{
              scale: isLooking ? [1, 1.2, 1] : 1,
              backgroundColor: isLooking ? '#10b981' : '#ef4444'
            }}
            transition={{ duration: 0.5 }}
            className="w-4 h-4 rounded-full"
          />
          <span className="text-gray-600">
            {isLooking ? 'Looking at camera' : 'Not looking'}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Overall Eye Contact</span>
          <span className={`text-2xl font-bold text-${color}-600`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={`h-3 rounded-full bg-${color}-500`}
          />
        </div>
      </div>

      <div className={`p-4 bg-${color}-50 rounded-lg`}>
        <p className={`text-sm text-${color}-800`}>
          {percentage >= 70 && '👁️ Excellent! Maintaining great eye contact.'}
          {percentage >= 50 && percentage < 70 && '👀 Good job! Try to maintain it more consistently.'}
          {percentage >= 30 && percentage < 50 && '👁️ Look at the camera more often.'}
          {percentage < 30 && '⚠️ Focus on maintaining eye contact with the camera.'}
        </p>
      </div>
    </div>
  )
}

export default EyeContactIndicator
