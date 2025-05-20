import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = [
  "Inicjalizacja systemu...",
  "Łączenie z Matrixem...",
  "Ładowanie umiejętności...",
  "Dekodowanie projektów...",
  "Analizowanie struktury...",
  "Wykrywanie agentów...",
  "Przygotowywanie portalu..."
];

const englishPhrases = [
  "Initializing system...",
  "Connecting to the Matrix...",
  "Loading skills...",
  "Decoding projects...",
  "Analyzing structure...",
  "Detecting agents...",
  "Preparing portal..."
];

const MatrixLoader = ({ language = "pl" }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const currentPhrases = language === "pl" ? phrases : englishPhrases;

  // Effect to change loading phrase every 800ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % currentPhrases.length);
    }, 800);

    return () => clearInterval(intervalId);
  }, [currentPhrases]);

  // Effect to simulate loading progress
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + Math.random() * 15;
        return next > 100 ? 100 : next;
      });
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="matrix-loader fixed inset-0 flex flex-col items-center justify-center bg-black z-[1000]">
      {/* Animated Matrix ring */}
      <motion.div
        className="matrix-loader-ring mb-8"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />

      {/* Animated loading phrase */}
      <motion.div
        key={currentPhraseIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[var(--matrix-primary)] text-lg font-mono mb-4"
      >
        {currentPhrases[currentPhraseIndex]}
      </motion.div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-[var(--matrix-dark)] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[var(--matrix-primary)]"
          initial={{ width: 0 }}
          animate={{ width: `${loadingProgress}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>

      {/* Completion percentage */}
      <motion.div
        animate={{ opacity: [0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        className="text-[var(--matrix-light)] text-sm mt-2 font-mono"
      >
        {Math.floor(loadingProgress)}%
      </motion.div>
    </div>
  );
};

export default MatrixLoader;