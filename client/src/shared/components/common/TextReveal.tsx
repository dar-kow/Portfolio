import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MatrixTypingProps {
  text: string;
  interval?: number;
  onComplete?: () => void;
}

const TextReveal: React.FC<MatrixTypingProps> = ({ text, interval = 200, onComplete }) => {
  const [displayText, setDisplayText] = useState<string>("");

  useEffect(() => {
    let left = 0;
    let right = text.length - 1;
    const letters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789アイウエオカキクケコ";

    const randomizeText = () => {
      let randomStr = "";
      for (let i = 0; i < text.length; i++) {
        randomStr += letters[Math.floor(Math.random() * letters.length)];
      }
      setDisplayText(randomStr);
    };

    const randomInterval = window.setInterval(randomizeText, 100);

    const phaseTimeout = window.setTimeout(() => {
      clearInterval(randomInterval);

      const updateText = () => {
        const current = text.split("");
        for (let i = left; i <= right; i++) {
          current[i] = letters[Math.floor(Math.random() * letters.length)];
        }

        if (left <= right) {
          current[left] = text[left];
          current[right] = text[right];
          setDisplayText(current.join(""));
          left++;
          right--;
          setTimeout(updateText, interval);
        } else {
          setDisplayText(text);
          if (onComplete) onComplete();
        }
      };

      updateText();
    }, 1000);

    return () => {
      clearInterval(randomInterval);
      clearTimeout(phaseTimeout);
    };
  }, [text, interval, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center z-10 px-4 md:px-0"
    >
      <h1
        className="text-xl md:text-2xl lg:text-3xl font-mono break-words"
        style={{
          color: "#22b455",
          textShadow: "0 0 10px #22b455, 0 0 20px #204829, 0 0 30px #80ce87",
        }}
      >
        {displayText}
      </h1>
    </motion.div>
  );
};

export default TextReveal;
