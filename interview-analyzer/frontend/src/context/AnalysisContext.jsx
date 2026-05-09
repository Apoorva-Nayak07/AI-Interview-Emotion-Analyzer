import { createContext, useState, useContext } from 'react'

const AnalysisContext = createContext(null)

export const useAnalysis = () => {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider')
  }
  return context
}

export const AnalysisProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null)
  const [emotionData, setEmotionData] = useState([])
  const [speechData, setSpeechData] = useState({
    transcript: '',
    fillerWords: [],
    wordCount: 0,
    duration: 0
  })
  const [eyeContactData, setEyeContactData] = useState({
    percentage: 0,
    timeline: []
  })
  const [confidenceScore, setConfidenceScore] = useState(0)

  const startSession = (sessionData) => {
    setCurrentSession(sessionData)
    resetAnalysisData()
  }

  const endSession = () => {
    setCurrentSession(null)
  }

  const resetAnalysisData = () => {
    setEmotionData([])
    setSpeechData({
      transcript: '',
      fillerWords: [],
      wordCount: 0,
      duration: 0
    })
    setEyeContactData({
      percentage: 0,
      timeline: []
    })
    setConfidenceScore(0)
  }

  const updateEmotionData = (newEmotion) => {
    setEmotionData(prev => [...prev, { ...newEmotion, timestamp: Date.now() }])
  }

  const updateSpeechData = (newSpeechData) => {
    setSpeechData(prev => ({ ...prev, ...newSpeechData }))
  }

  const updateEyeContactData = (newEyeContactData) => {
    setEyeContactData(prev => ({ ...prev, ...newEyeContactData }))
  }

  const calculateConfidenceScore = () => {
    // Calculate confidence based on multiple factors
    let score = 0
    
    // Emotion stability (30%)
    if (emotionData.length > 0) {
      const positiveEmotions = emotionData.filter(e => 
        e.emotion === 'happy' || e.emotion === 'neutral'
      ).length
      score += (positiveEmotions / emotionData.length) * 30
    }
    
    // Eye contact (25%)
    score += (eyeContactData.percentage / 100) * 25
    
    // Speech clarity - fewer filler words is better (25%)
    if (speechData.wordCount > 0) {
      const fillerRatio = speechData.fillerWords.length / speechData.wordCount
      score += Math.max(0, (1 - fillerRatio * 10)) * 25
    }
    
    // Speech pace (20%)
    if (speechData.duration > 0) {
      const wordsPerMinute = (speechData.wordCount / speechData.duration) * 60
      // Optimal range: 120-150 words per minute
      if (wordsPerMinute >= 120 && wordsPerMinute <= 150) {
        score += 20
      } else if (wordsPerMinute >= 100 && wordsPerMinute <= 170) {
        score += 15
      } else {
        score += 10
      }
    }
    
    setConfidenceScore(Math.round(score))
    return Math.round(score)
  }

  const value = {
    currentSession,
    emotionData,
    speechData,
    eyeContactData,
    confidenceScore,
    startSession,
    endSession,
    updateEmotionData,
    updateSpeechData,
    updateEyeContactData,
    calculateConfidenceScore,
    resetAnalysisData
  }

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
}
