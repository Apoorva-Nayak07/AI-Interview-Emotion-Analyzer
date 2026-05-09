import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Webcam from 'react-webcam'
import { useNavigate } from 'react-router-dom'
import { useAnalysis } from '../context/AnalysisContext'
import { useWebcam } from '../hooks/useWebcam'
import { useEmotionDetection } from '../hooks/useEmotionDetection'
import { useEyeContact } from '../hooks/useEyeContact'
import speechRecognitionService from '../services/speechRecognition'
import fillerWordDetectionService from '../services/fillerWordDetection'
import { sessionService } from '../services/api'
import EmotionDisplay from '../components/EmotionDisplay'
import EyeContactIndicator from '../components/EyeContactIndicator'
import FillerWordsDisplay from '../components/FillerWordsDisplay'
import ConfidenceScore from '../components/ConfidenceScore'

const Interview = () => {
  const navigate = useNavigate()
  const { webcamRef, isRecording, startRecording, stopRecording } = useWebcam()
  const [isInterviewActive, setIsInterviewActive] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [fillerWords, setFillerWords] = useState([])
  const [wordCount, setWordCount] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const startTimeRef = useRef(null)
  const timerRef = useRef(null)

  const {
    startSession,
    endSession,
    updateEmotionData,
    updateSpeechData,
    updateEyeContactData,
    calculateConfidenceScore,
    confidenceScore
  } = useAnalysis()

  const videoElement = webcamRef.current?.video

  const {
    currentEmotion,
    emotionHistory,
    isInitialized: emotionInitialized,
    getEmotionStats
  } = useEmotionDetection(videoElement, isInterviewActive)

  const {
    eyeContactPercentage,
    isLookingAtCamera,
    resetEyeContact
  } = useEyeContact(videoElement, isInterviewActive)

  useEffect(() => {
    if (currentEmotion) {
      updateEmotionData(currentEmotion)
    }
  }, [currentEmotion, updateEmotionData])

  useEffect(() => {
    updateEyeContactData({ percentage: eyeContactPercentage })
  }, [eyeContactPercentage, updateEyeContactData])

  const handleStartInterview = () => {
    setIsInterviewActive(true)
    startRecording()
    startTimeRef.current = Date.now()

    // Start timer
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setDuration(elapsed)
    }, 1000)

    // Start speech recognition
    speechRecognitionService.start(
      (result) => {
        if (result.isFinal) {
          const newTranscript = transcript + ' ' + result.transcript
          setTranscript(newTranscript)
          
          // Detect filler words
          const detectedFillers = fillerWordDetectionService.detectFillerWords(result.transcript)
          setFillerWords(prev => [...prev, ...detectedFillers])
          
          // Update word count
          const words = newTranscript.trim().split(/\s+/).filter(w => w.length > 0)
          setWordCount(words.length)
        }
        setInterimTranscript(result.interimTranscript)
      },
      () => {
        console.log('Speech recognition ended')
      }
    )

    startSession({ startTime: Date.now() })
  }

  const handleStopInterview = async () => {
    setIsInterviewActive(false)
    stopRecording()
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    speechRecognitionService.stop()
    
    // Calculate final confidence score
    const finalScore = calculateConfidenceScore()

    // Save session
    setIsSaving(true)
    try {
      const sessionData = {
        title: `Interview Session - ${new Date().toLocaleDateString()}`,
        duration,
        transcript,
        emotions: emotionHistory,
        fillerWords: {
          count: fillerWords.length,
          words: fillerWordDetectionService.getFillerWordStats(fillerWords)
        },
        eyeContact: {
          percentage: eyeContactPercentage,
          totalTime: duration,
          lookingAwayCount: 0
        },
        confidenceScore: {
          overall: finalScore,
          emotionStability: 0,
          speechClarity: 0,
          eyeContactScore: eyeContactPercentage,
          fillerWordScore: 0
        }
      }

      await sessionService.createSession(sessionData)
      endSession()
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error saving session:', error)
      alert('Failed to save session. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Practice Interview
          </h1>
          <p className="text-gray-600">
            {isInterviewActive
              ? 'Interview in progress - Stay focused and confident!'
              : 'Click start when you\'re ready to begin'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card"
            >
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <Webcam
                  ref={webcamRef}
                  audio={true}
                  className="w-full h-full object-cover"
                  mirrored={true}
                />
                
                {isInterviewActive && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-3 h-3 bg-red-500 rounded-full"
                    />
                    <span className="text-white font-semibold">Recording</span>
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg font-mono text-xl">
                  {formatDuration(duration)}
                </div>

                {!emotionInitialized && isInterviewActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p>Initializing AI models...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                {!isInterviewActive ? (
                  <button
                    onClick={handleStartInterview}
                    className="btn-primary text-lg px-8 py-3"
                  >
                    🎬 Start Interview
                  </button>
                ) : (
                  <button
                    onClick={handleStopInterview}
                    disabled={isSaving}
                    className="btn-danger text-lg px-8 py-3"
                  >
                    {isSaving ? 'Saving...' : '⏹️ Stop Interview'}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Transcript Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Live Transcript
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 h-48 overflow-y-auto">
                {transcript || interimTranscript ? (
                  <p className="text-gray-700">
                    {transcript}
                    {interimTranscript && (
                      <span className="text-gray-400 italic"> {interimTranscript}</span>
                    )}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">
                    Your speech will appear here...
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>Words: {wordCount}</span>
                <span>Filler Words: {fillerWords.length}</span>
              </div>
            </motion.div>
          </div>

          {/* Analysis Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ConfidenceScore score={confidenceScore} />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <EmotionDisplay
                emotion={currentEmotion?.emotion}
                confidence={currentEmotion?.confidence || 0}
              />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <EyeContactIndicator
                percentage={eyeContactPercentage}
                isLooking={isLookingAtCamera}
              />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <FillerWordsDisplay
                fillerWords={fillerWords}
                totalWords={wordCount}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Interview
