import { useState, useEffect, useCallback, useRef } from 'react'
import emotionDetectionService from '../services/emotionDetection'

export const useEyeContact = (videoElement, isActive = false) => {
  const [eyeContactPercentage, setEyeContactPercentage] = useState(0)
  const [eyeContactTimeline, setEyeContactTimeline] = useState([])
  const [isLookingAtCamera, setIsLookingAtCamera] = useState(false)
  const intervalRef = useRef(null)
  const totalChecksRef = useRef(0)
  const positiveChecksRef = useRef(0)

  const checkEyeContact = useCallback(async () => {
    if (!videoElement) return

    try {
      const result = await emotionDetectionService.detectEyeContact(videoElement)
      setIsLookingAtCamera(result.isLookingAtCamera)
      
      totalChecksRef.current++
      if (result.isLookingAtCamera) {
        positiveChecksRef.current++
      }

      const percentage = (positiveChecksRef.current / totalChecksRef.current) * 100
      setEyeContactPercentage(percentage)

      setEyeContactTimeline(prev => [
        ...prev,
        {
          timestamp: Date.now(),
          isLooking: result.isLookingAtCamera,
          confidence: result.confidence
        }
      ])
    } catch (err) {
      console.error('Error checking eye contact:', err)
    }
  }, [videoElement])

  useEffect(() => {
    if (isActive && videoElement) {
      // Check eye contact every 1 second
      intervalRef.current = setInterval(checkEyeContact, 1000)
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
  }, [isActive, videoElement, checkEyeContact])

  const resetEyeContact = useCallback(() => {
    setEyeContactPercentage(0)
    setEyeContactTimeline([])
    setIsLookingAtCamera(false)
    totalChecksRef.current = 0
    positiveChecksRef.current = 0
  }, [])

  const getEyeContactFeedback = useCallback(() => {
    if (eyeContactPercentage >= 70) {
      return {
        level: 'excellent',
        message: 'Excellent eye contact! You maintained good engagement.',
        color: 'green'
      }
    } else if (eyeContactPercentage >= 50) {
      return {
        level: 'good',
        message: 'Good eye contact. Try to maintain it more consistently.',
        color: 'blue'
      }
    } else if (eyeContactPercentage >= 30) {
      return {
        level: 'moderate',
        message: 'Moderate eye contact. Practice looking at the camera more often.',
        color: 'yellow'
      }
    } else {
      return {
        level: 'needs-improvement',
        message: 'Eye contact needs improvement. Focus on looking at the camera.',
        color: 'red'
      }
    }
  }, [eyeContactPercentage])

  return {
    eyeContactPercentage,
    eyeContactTimeline,
    isLookingAtCamera,
    resetEyeContact,
    getEyeContactFeedback
  }
}
