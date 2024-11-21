declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof SpeechRecognition | undefined;
    SpeechGrammarList: typeof SpeechGrammarList | undefined;
    webkitSpeechGrammarList: typeof SpeechGrammarList | undefined;
  }
}

export {};
