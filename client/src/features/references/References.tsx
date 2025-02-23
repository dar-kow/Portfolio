import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useLanguage } from "../../shared/components/common/LanguageContext";
import MatrixEffect from "@/shared/components/common/MatrixRain";
import { getMatrixColors } from "../articles/Articles";
import { referencesMessages } from "./data";

function References(): JSX.Element {
    const { lang } = useLanguage();
    const [isMobile, setIsMobile] = useState(false);
    const [iframeKey, setIframeKey] = useState(Date.now());

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            if (!mobile) {
                setIframeKey(Date.now());
            }
        };

        handleResize(); // ustaw przy starcie
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <MatrixEffect immediate bgOpacity={0.2} matrixColors={getMatrixColors()} />
            <div className="references-container relative z-10 p-4 md:p-8 md:pl-72 space-y-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h1 className="references-title text-[var(--matrix-light)] text-3xl font-bold">
                        {referencesMessages.title[lang]}
                    </h1>
                    <p className="text-[var(--matrix-white)] text-lg">
                        {referencesMessages.description[lang]}
                    </p>
                    <p className="text-[var(--matrix-white)] text-sm md:text-base leading-relaxed mt-2">
                        {referencesMessages.longDescription[lang]}
                    </p>
                    <a
                        href="/assets/referencje.pdf"
                        download
                        className="flex items-center space-x-2 text-[var(--matrix-white)] hover:text-[var(--matrix-primary)] transition"
                    >
                        <Download className="w-4 h-4" />
                        <span>{referencesMessages.downloadButton[lang]}</span>
                    </a>
                </motion.div>

                {/* Render iframe tylko na urządzeniach stacjonarnych */}
                {!isMobile ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                        <iframe
                            key={iframeKey}
                            src="/assets/referencje.pdf"
                            title="Podgląd referencji"
                            className="w-full min-h-[400px] sm:min-h-[600px] md:min-h-[800px]"
                        />
                    </motion.div>
                ) : (
                    <div className="w-full text-center text-[var(--matrix-white)]">
                        Podgląd referencji jest dostępny tylko na urządzeniach stacjonarnych.
                    </div>
                )}
            </div>
        </>
    );
}

export default References;