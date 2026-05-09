import { useState, useEffect, useCallback, useRef } from 'react'
import emotionDetectionService from '../services/emotionDetection'

export const useEmotionDetection = (videoElement, isActive = false) => {
  const [currentEmotion, setCurrentEmotion] = useState(null)
  const [emotionHistory, setEmotionHistory] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    const initializeDetection = async () => {
      try {
        await emotionDetectionService.initialize()
        setIsInitialized(true)
      } catch (err) {
        setError('Failed to initialize emotion detection')
        console.error(err)
      }
    }

    initializeDetection()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const detectEmotion = useCallback(async () => {
    if (!videoElement || !isInitialized) return

    try {
      const emotion = await emotionDetectionService.detectEmotion(videoElement)
      if (emotion) {
        setCurrentEmotion(emotion)
        setEmotionHistory(prev => [...prev, emotion])
      }
    } catch (err) {
      console.error('Error detecting emotion:', err)
    }
  }, [videoElement, isInitialized])

  useEffect(() => {
    if (isActive && isInitialized && videoElement) {
      // Detect emotion every 2 seconds
      intervalRef.current = setInterval(detectEmotion, 2000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isInitialized, videoElement, detectEmotion])

  const resetEmotionHistory = useCallback(() => {
    setEmotionHistory([])
    setCurrentEmotion(null)
  }, [])

  const getEmotionStats = useCallback(() => {
    if (emotionHistory.length === 0) return {}

    const stats = {}
    emotionHistory.forEach(item => {
      if (stats[item.emotion]) {
        stats[item.emotion]++
      } else {
        stats[item.emotion] = 1
      }
    })

    const total = emotionHistory.length
    const percentages = {}
    Object.keys(stats).forEach(emotion => {
      percentages[emotion] = ((stats[emotion] / total) * 100).toFixed(1)
    })

    return percentages
  }, [emotionHistory])

  return {
    currentEmotion,
    emotionHistory,
    isInitialized,
    error,
    resetEmotionHistory,
    getEmotionStats
  }
}
