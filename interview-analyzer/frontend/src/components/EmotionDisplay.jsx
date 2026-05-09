import { motion } from 'framer-motion'

const emotionEmojis = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprised: '😲',
  neutral: '😐',
  fearful: '😨'
}

const emotionColors = {
  happy: 'bg-green-100 text-green-800 border-green-300',
  sad: 'bg-blue-100 text-blue-800 border-blue-300',
  angry: 'bg-red-100 text-red-800 border-red-300',
  surprised: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  neutral: 'bg-gray-100 text-gray-800 border-gray-300',
  fearful: 'bg-purple-100 text-purple-800 border-purple-300'
}

const EmotionDisplay = ({ emotion, confidence }) => {
  if (!emotion) {
    return (
      <div className="card text-center">
        <p className="text-gray-500">Detecting emotion...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`card border-2 ${emotionColors[emotion]}`}
    >
      <div className="text-center">
        <div className="text-6xl mb-3">{emotionEmojis[emotion]}</div>
        <h3 className="text-xl font-bold capitalize mb-2">{emotion}</h3>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence * 100}%` }}
            className="bg-current h-2 rounded-full"
          />
        </div>
        <p className="text-sm">
          Confidence: {(confidence * 100).toFixed(0)}%
        </p>
      </div>
    </motion.div>
  )
}

export default EmotionDisplay
