// Hook tao hieu ung go chu giong nhu nguoi that (Typing effect)
// Su dung khi AI phan hoi de tao cam giac sinh dong.

import { useState, useEffect, useRef } from "react";

export const useTypingEffect = (
  text: string,
  speed: number = 25, // ms per chunk
  active: boolean = false,
  onComplete?: () => void,
  stopFlag: boolean = false
) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const textRef = useRef(text);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText("");
    setIsComplete(false);
    indexRef.current = 0;

    let timer: NodeJS.Timeout;
    
    const tick = () => {
      if (stopFlag) {
        setIsComplete(true);
        if (onCompleteRef.current) onCompleteRef.current();
        return;
      }

      const fullText = textRef.current;
      const index = indexRef.current;
      
      if (index >= fullText.length) {
        setIsComplete(true);
        if (onCompleteRef.current) onCompleteRef.current();
        return;
      }

      // Type 1 to 4 characters at a time for natural speed variations
      const chunkSize = Math.floor(Math.random() * 3) + 1;
      const nextIndex = Math.min(index + chunkSize, fullText.length);
      const nextText = fullText.slice(0, nextIndex);
      
      setDisplayedText(nextText);
      indexRef.current = nextIndex;

      // Add variation to tick duration
      const delay = speed + (Math.random() * 15 - 5);
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, speed);

    return () => {
      clearTimeout(timer);
    };
  }, [text, active, speed, stopFlag]);

  return { displayedText, isComplete };
};
