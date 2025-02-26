export class SpeechService {
    private synthesis: SpeechSynthesis;
    private voice: SpeechSynthesisVoice | null = null;
    
    constructor() {
      this.synthesis = window.speechSynthesis;
      this.setVoice();
    }
  
    private setVoice() {
      // Tenta encontrar uma voz em português
      const voices = this.synthesis.getVoices();
      this.voice = voices.find(voice => voice.lang.includes('pt')) || voices[0];
    }
  
    speak(text: string) {
      if (!this.voice) {
        this.setVoice();
      }
  
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.voice;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      this.synthesis.speak(utterance);
    }
  
    stop() {
      this.synthesis.cancel();
    }
  }
  
  export const speechService = new SpeechService();