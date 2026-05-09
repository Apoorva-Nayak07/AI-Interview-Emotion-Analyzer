class SpeechRecognitionService {
  constructor() {
    this.recognition = null
    this.isListening = false
    this.transcript = ''
    this.onResultCallback = null
    this.onEndCallback = null
  }

  initialize() {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      throw new Error('Speech recognition not supported in this browser')
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'

    this.recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        this.transcript += finalTranscript
        if (this.onResultCallback) {
          this.onResultCallback({
            transcript: this.transcript,
            interimTranscript,
            isFinal: true
          })
        }
      } else if (interimTranscript && this.onResultCallback) {
        this.onResultCallback({
          transcript: this.transcript,
          interimTranscript,
          isFinal: false
        })
      }
    }

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        // Restart if no speech detected
        if (this.isListening) {
          this.recognition.start()
        }
      }
    }

    this.recognition.onend = () => {
      if (this.isListening) {
        // Restart recognition if it stops unexpectedly
        this.recognition.start()
      } else if (this.onEndCallback) {
        this.onEndCallback()
      }
    }
  }

  start(onResult, onEnd) {
    if (!this.recognition) {
      this.initialize()
    }

    this.onResultCallback = onResult
    this.onEndCallback = onEnd
    this.transcript = ''
    this.isListening = true

    try {
      this.recognition.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
    }
  }

  stop() {
    this.isListening = false
    if (this.recognition) {
      this.recognition.stop()
    }
    return this.transcript
  }

  getTranscript() {
    return this.transcript
  }

  reset() {
    this.transcript = ''
  }
}

export default new SpeechRecognitionService()
