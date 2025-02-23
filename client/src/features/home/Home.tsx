import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TextReveal from "../../shared/components/common/TextReveal";
import MatrixEffect from "../../shared/components/common/MatrixRain";
import { Button } from "../../shared/components/ui/button";
import { Download } from "lucide-react";
import { homeMessages } from "./data";
import { useLanguage } from "../../shared/components/common/LanguageContext";
import MatrixLoader from "../../shared/components/common/MatrixLoader";

const Home = () => {
  const { lang } = useLanguage();
  const [typingComplete, setTypingComplete] = useState(false);
  const [contactTyped, setAllTyped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Loader pokaże się przez 2000ms
    const loaderTimeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    const animationTimeout = setTimeout(() => {
      setStartAnimation(true);
    }, 2000);

    return () => {
      clearTimeout(loaderTimeout);
      clearTimeout(animationTimeout);
    };
  }, []);

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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-4 md:pt-6"
                  style={{ minHeight: "60px" }} // rezerwuje stałą przestrzeń
                >
                  {contactTyped && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 100, damping: 10 }}
                    >
                      <Button variant="outline" className="matrix-button text-sm bg-transparent">
                        <Download className="w-4 h-4 text-[#22b455] hover:text-[#22b455]" />
                        <span className="matrix-button-text">
                          <TextReveal text={homeMessages.downloadCV[lang]} interval={150} />
                        </span>
                      </Button>
                    </motion.div>
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
