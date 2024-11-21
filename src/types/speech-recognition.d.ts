declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

// Export an empty object to convert this into a module
export {};
