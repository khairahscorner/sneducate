import { useState } from "react";
import { ReactComponent as Logo } from "../assets/icons/speaker.svg";

const TextToSpeech = () => {
  const [isReading, setIsReading] = useState(false);

  const handleButtonClick = () => {
    const synth = window.speechSynthesis;

    if (!isReading) {
      const utterance = new SpeechSynthesisUtterance(document.body.textContent);
      synth.speak(utterance);
    } else {
      synth.cancel();
    }

    setIsReading(!isReading);
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="w-8" onClick={handleButtonClick}>
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
