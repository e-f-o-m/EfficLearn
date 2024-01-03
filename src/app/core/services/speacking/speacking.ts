const synth = window.speechSynthesis;

export function speak(text: string, lang: string) {
    const utterance  = new SpeechSynthesisUtterance(text);
    utterance.lang = lang
    //utterance.voice = speechSynthesis.getVoices()[5];
    //utterance.text = text;
    synth.speak(utterance);
}