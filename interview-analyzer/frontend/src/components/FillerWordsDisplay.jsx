import { motion } from 'framer-motion'

const FillerWordsDisplay = ({ fillerWords, totalWords }) => {
  const fillerWordRate = totalWords > 0 
    ? ((fillerWords.length / totalWords) * 100).toFixed(1)
    : 0

  const getFillerWordStats = () => {
    const stats = {}
    fillerWords.forEach(item => {
      if (stats[item.word]) {
        stats[item.word]++
      } else {
        stats[item.word] = 1
      }
    })
    return Object.entries(stats)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const topFillers = getFillerWordStats()

  const getRateColor = () => {
    if (fillerWordRate < 2) return 'text-green-600'
    if (fillerWordRate < 5) return 'text-blue-600'
    if (fillerWordRate < 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Filler Words Analysis
      </h3>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Filler Word Rate</span>
          <span className={`text-2xl font-bold ${getRateColor()}`}>
            {fillerWordRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(fillerWordRate, 100)}%` }}
            className={`h-3 rounded-full ${
              fillerWordRate < 2
                ? 'bg-green-500'
                : fillerWordRate < 5
                ? 'bg-blue-500'
                : fillerWordRate < 10
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Most Common Fillers:</h4>
        {topFillers.length > 0 ? (
          topFillers.map((filler, index) => (
            <motion.div
              key={filler.word}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-700">"{filler.word}"</span>
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                {filler.count}x
              </span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No filler words detected yet
          </p>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Total Filler Words:</strong> {fillerWords.length} out of {totalWords} words
        </p>
      </div>
    </div>
  )
}

export default FillerWordsDisplay
