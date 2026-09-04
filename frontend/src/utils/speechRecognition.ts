// Utility for Web Speech API (Speech Recognition & Speech Synthesis)

export class SpeechRecognitionHelper {
  private recognition: any = null;
  public isSupported: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.isSupported = true;
      }
    }
  }

  public async requestMicrophonePermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return true;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately so SpeechRecognition can access microphone stream
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (e) {
      console.warn('Microphone permission error:', e);
      return false;
    }
  }

  public async startListening(
    onResult: (finalText: string, interimText: string) => void,
    onError?: (err: any) => void,
    onEnd?: () => void
  ) {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.isSupported = false;
      if (onError) onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    this.isSupported = true;

    // Stop ongoing speech output so mic does not hear AI's voice
    this.stopSpeaking();

    // Request microphone permission to ensure prompt appears if not granted
    const hasMicPermission = await this.requestMicrophonePermission();
    if (!hasMicPermission) {
      if (onError) onError('not-allowed');
      return;
    }

    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = navigator.language || 'en-US';

      let accumulatedFinal = '';

      rec.onresult = (event: any) => {
        let interimTranscript = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (currentFinal) {
          accumulatedFinal += currentFinal;
        }

        const totalFinal = accumulatedFinal.trim();
        const totalInterim = interimTranscript.trim();
        onResult(totalFinal, totalInterim);
      };

      rec.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (onError) onError(event.error);
      };

      rec.onend = () => {
        this.recognition = null;
        if (onEnd) onEnd();
      };

      this.recognition = rec;
      rec.start();
    } catch (err: any) {
      console.warn('Failed to start SpeechRecognition:', err);
      if (onError) onError(err.message || err);
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        try {
          this.recognition.abort();
        } catch {
          // ignore
        }
      }
      this.recognition = null;
    }
  }

  // Clean Markdown and format text for natural speech synthesis
  public cleanTextForSpeech(text: string): string {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
      .replace(/\*(.*?)\*/g, '$1')     // remove italic
      .replace(/__(.*?)__/g, '$1')     // remove underline
      .replace(/`(.*?)`/g, '$1')       // remove code
      .replace(/#{1,6}\s+/g, '')       // remove headings
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // replace markdown links with text
      .replace(/[•\-\*\u2022]/g, ' ')   // replace bullet points with space
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis
      .replace(/\s+/g, ' ')            // collapse spaces
      .trim();
  }

  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError('Speech synthesis not supported');
      return;
    }

    this.stopSpeaking();

    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.98;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    const getBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      return (
        voices.find((v) => (v.lang.includes('en-US') || v.lang.includes('en-IN') || v.lang.includes('en-GB')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Zira'))) ||
        voices.find((v) => v.lang.startsWith('en'))
      );
    };

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        const asyncVoice = getBestVoice();
        if (asyncVoice) utterance.voice = asyncVoice;
      };
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeakingState = false;
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      (window.speechSynthesis.speaking || this.isSpeakingState)
    );
  }
}

export const speechHelper = new SpeechRecognitionHelper();
