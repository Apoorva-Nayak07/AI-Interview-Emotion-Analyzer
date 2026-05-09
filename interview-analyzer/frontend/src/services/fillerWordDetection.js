const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'so', 'actually', 'basically',
  'literally', 'right', 'okay', 'well', 'i mean', 'kind of',
  'sort of', 'you see', 'you know what i mean', 'hmm', 'ah',
  'er', 'erm'
]

class FillerWordDetectionService {
  detectFillerWords(transcript) {
    if (!transcript) return []

    const words = transcript.toLowerCase().split(/\s+/)
    const fillerWords = []

    // Check for single-word fillers
    words.forEach((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '')
      if (FILLER_WORDS.includes(cleanWord)) {
        fillerWords.push({
          word: cleanWord,
          position: index,
          timestamp: Date.now()
        })
      }
    })

    // Check for multi-word fillers
    FILLER_WORDS.forEach(filler => {
      if (filler.includes(' ')) {
        const regex = new RegExp(`\\b${filler}\\b`, 'gi')
        const matches = transcript.match(regex)
        if (matches) {
          matches.forEach(() => {
            fillerWords.push({
              word: filler,
              position: -1,
              timestamp: Date.now()
            })
          })
        }
      }
    })

    return fillerWords
  }

  getFillerWordStats(fillerWords) {
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
  }

  calculateFillerWordRate(fillerWords, totalWords) {
    if (totalWords === 0) return 0
    return (fillerWords.length / totalWords) * 100
  }

  getSuggestions(fillerWordRate) {
    if (fillerWordRate < 2) {
      return {
        level: 'excellent',
        message: 'Excellent! Your speech is very clear with minimal filler words.',
        color: 'green'
      }
    } else if (fillerWordRate < 5) {
      return {
        level: 'good',
        message: 'Good job! You have a reasonable amount of filler words.',
        color: 'blue'
      }
    } else if (fillerWordRate < 10) {
      return {
        level: 'moderate',
        message: 'Try to reduce filler words. Practice pausing instead of using fillers.',
        color: 'yellow'
      }
    } else {
      return {
        level: 'needs-improvement',
        message: 'Focus on reducing filler words. Take brief pauses to collect your thoughts.',
        color: 'red'
      }
    }
  }
}

export default new FillerWordDetectionService()
