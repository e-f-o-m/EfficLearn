const synth = window.speechSynthesis;

export async function speak(text: string, lang: string): Promise<boolean> {
    return new Promise(resolve => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        synth.speak(utterance);

        const intervalId = setInterval(() => {
            if (!synth.speaking) {
                clearInterval(intervalId);
                resolve(true);
            }
        }, 1000);
    });
}