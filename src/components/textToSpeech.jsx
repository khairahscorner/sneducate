import { useState, useEffect } from "react";
import { ReactComponent as Logo } from "../assets/icons/speaker.svg";

const TextToSpeech = () => {
  const [isReading, setIsReading] = useState(false);

  const handleButtonClick = () => {
    const synth = window.speechSynthesis;

    if (!isReading) {
      const utterance = new SpeechSynthesisUtterance(document.body.textContent);
      synth.speak(utterance);
      utterance.onend = () => {
        setIsReading(false);
      };
    } else {
      synth.cancel();
    }

    setIsReading(!isReading);
  };

  useEffect(() => {
    return () => {
      const synth = window.speechSynthesis;
      synth.cancel();
    };
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center">
        <div
          className={`w-8 ${isReading ? " fill-primary" : ""}`}
          onClick={handleButtonClick}
        >
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
