// TypingEffect.jsx
import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 20); // Adjust the speed here (milliseconds)

      return () => clearTimeout(timeoutId);
    }
  }, [index, text]);

  return <span>{displayedText}</span>;
};

export default TypingEffect;