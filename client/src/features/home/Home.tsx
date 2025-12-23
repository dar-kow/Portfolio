import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import TextReveal from "../../shared/components/common/TextReveal";
import MatrixEffect from "../../shared/components/common/MatrixRain";
import { homeMessages } from "./data";
import { christmasMessages } from "./christmasData";
import { useLanguage } from "../../shared/components/common/LanguageContext";
import MatrixLoader from "../../shared/components/common/MatrixLoader";
import ChristmasMatrixTree from "./ChristmasMatrixTree";
import { isChristmasActive } from "../../config/christmas";

const Home = () => {
  const { lang } = useLanguage();
  const [typingComplete, setTypingComplete] = useState(false);
  const [contactTyped, setAllTyped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  // Christmas mode states
  const isChristmas = isChristmasActive();
  const [treeComplete, setTreeComplete] = useState(false);
  const [greetingTyped, setGreetingTyped] = useState(false);
  const [greetingLine2Typed, setGreetingLine2Typed] = useState(false);
  const [newYearTyped, setNewYearTyped] = useState(false);

  // Stable callback for tree completion (prevents re-render)
  const handleTreeComplete = useCallback(() => {
    setTreeComplete(true);
  }, []);

  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    const animationTimeout = setTimeout(() => {
      setStartAnimation(true);
    }, 100);

    return () => {
      clearTimeout(loaderTimeout);
      clearTimeout(animationTimeout);
    };
  }, []);

  // Christmas version render
  if (isChristmas) {
    return (
      <>
        {loading && <MatrixLoader />}
        {!loading && startAnimation && (
          <div className="home-container md:pl-72">
            <ChristmasMatrixTree onTreeComplete={handleTreeComplete} />
            {treeComplete && (
              <motion.div
                className="fixed bottom-[15%] left-0 right-0 md:left-72 flex flex-col items-center justify-center z-10 px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center space-y-2 md:space-y-3">
                  {/* Wesołych Świąt */}
                  {!greetingTyped ? (
                    <TextReveal
                      text={christmasMessages.greeting[lang]}
                      interval={200}
                      onComplete={() => setGreetingTyped(true)}
                    />
                  ) : (
                    <motion.div
                      className="matrix-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold"
                      animate={{ textShadow: ["0 0 10px #22b455", "0 0 20px #22b455", "0 0 10px #22b455"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {christmasMessages.greeting[lang]}
                    </motion.div>
                  )}
                  {/* Bożego Narodzenia */}
                  {greetingTyped && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      {!greetingLine2Typed ? (
                        <TextReveal
                          text={christmasMessages.greetingLine2[lang]}
                          interval={150}
                          onComplete={() => setGreetingLine2Typed(true)}
                        />
                      ) : (
                        <motion.div
                          className="matrix-text text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold"
                          animate={{ textShadow: ["0 0 10px #22b455", "0 0 20px #22b455", "0 0 10px #22b455"] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {christmasMessages.greetingLine2[lang]}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                  {/* Szczęśliwego Nowego Roku */}
                  {greetingLine2Typed && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="pt-4"
                    >
                      {!newYearTyped ? (
                        <TextReveal
                          text={christmasMessages.newYear[lang]}
                          interval={150}
                          onComplete={() => setNewYearTyped(true)}
                        />
                      ) : (
                        <div className="matrix-text text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono">
                          {christmasMessages.newYear[lang]}
                        </div>
                      )}
                    </motion.div>
                  )}
                  {/* Wszystkiego najlepszego */}
                  {newYearTyped && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <div className="matrix-text text-base sm:text-lg md:text-xl font-mono opacity-80">
                        {christmasMessages.wishes[lang]}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </>
    );
  }

  // Normal version render (original code - unchanged)
  return (
    <>
      {loading && <MatrixLoader />}
      {!loading && startAnimation && (
        <div className="home-container md:pl-72">
          <MatrixEffect
            color={contactTyped ? "#204829" : "#22b455"}
            bgOpacity={contactTyped ? 0.075 : 0.05}
          />
          <motion.div
            className="welcome-screen-inner"
            initial={{ opacity: 0, scale: 1.2, y: -20 }}
            animate={{ opacity: [0, 0.7, 1] }}
            transition={{ delay: 0.5, duration: 1, times: [0, 0.5, 1] }}
          >
            {!typingComplete ? (
              <TextReveal
                text={homeMessages.welcome[lang]}
                interval={200}
                onComplete={() => setTypingComplete(true)}
              />
            ) : (
              <div className="heading-wrapper">
                <motion.div className="heading-text">{homeMessages.welcome[lang]}</motion.div>
                <motion.div
                  className="space-y-4 md:space-y-6"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <TextReveal text={homeMessages.projects[lang]} interval={150} />
                </motion.div>
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <TextReveal text={homeMessages.cv[lang]} interval={150} />
                </motion.div>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  {!contactTyped ? (
                    <TextReveal
                      text={homeMessages.contact[lang]}
                      interval={150}
                      onComplete={() => setAllTyped(true)}
                    />
                  ) : (
                    <div className="matrix-text text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono">
                      {homeMessages.contact[lang]}
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Home;
