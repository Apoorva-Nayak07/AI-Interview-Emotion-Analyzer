import { useState, useRef, useCallback } from 'react'

export const useWebcam = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])
  const mediaRecorderRef = useRef(null)
  const webcamRef = useRef(null)

  const startRecording = useCallback(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm'
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data])
        }
      }

      mediaRecorder.start(100) // Collect data every 100ms
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const downloadRecording = useCallback(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `interview-${Date.now()}.webm`
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [recordedChunks])

  const resetRecording = useCallback(() => {
    setRecordedChunks([])
  }, [])

  return {
    webcamRef,
    isRecording,
    recordedChunks,
    startRecording,
    stopRecording,
    downloadRecording,
    resetRecording
  }
}
