import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { useLanguage } from "../../shared/components/common/LanguageContext";
import MatrixEffect from "@/shared/components/common/MatrixRain";
import { getMatrixColors } from "../articles/Articles";
import { referencesMessages } from "./data";

function References(): JSX.Element {
    const { lang } = useLanguage();
    const [isMobile, setIsMobile] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <MatrixEffect immediate bgOpacity={0.2} matrixColors={getMatrixColors()} />
            <div className="references-container relative z-10 p-4 md:p-8 md:pl-72 space-y-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    <h1 className="references-title text-[var(--matrix-primary)] text-3xl font-bold">
                        {referencesMessages.title[lang]}
                    </h1>
                    <p className="text-[var(--matrix-hover)] text-lg">
                        {referencesMessages.description[lang]}
                    </p>
                    <p className="text-[var(--matrix-white)] text-sm md:text-base leading-relaxed mt-2">
                        {referencesMessages.longDescription[lang]}
                    </p>
                    <div className="flex items-center space-x-2">
                        <div className="flex flex-col items-center space-y-2">
                            {/* Miniaturka widoczna tylko na desktopie z tooltipem */}
                            {!isMobile && (
                                <div className="relative inline-block group border border-[var(--matrix-dark)] p-1 hover:shadow-md transition">
                                    <button onClick={() => setModalOpen(true)}>
                                        <img
                                            src="/assets/pdf-thumbnail.jpg"
                                            alt={lang === "pl" ? "Podgląd referencji" : "PDF Preview"}
                                            className="w-32"
                                        />
                                    </button>
                                    <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 rounded bg-[var(--matrix-dark)] text-[var(--matrix-white)] text-sm px-3 py-2 opacity-0 group-hover:opacity-100 transition">
                                        {lang === "pl" ? "Podgląd referencji" : "PDF Preview"}
                                    </span>
                                </div>
                            )}
                            {/* Przycisk pobierania umieszczony pod miniaturką */}
                            <a
                                href="/assets/referencje.pdf"
                                download
                                className="flex items-center space-x-1 text-[var(--matrix-white)] hover:text-[var(--matrix-primary)] transition"
                            >
                                <Download className="w-4 h-4" />
                                <span>{referencesMessages.downloadButton[lang]}</span>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal z PDF */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative bg-[var(--matrix-black)] p-4 rounded-md max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-2 right-2 text-[var(--matrix-white)]"
                                onClick={() => setModalOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <iframe
                                src="/assets/referencje.pdf"
                                title="Podgląd referencji"
                                className="w-full h-[80vh] border-0"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default References;