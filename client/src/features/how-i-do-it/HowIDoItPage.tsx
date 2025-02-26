import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/shared/components/common/LanguageContext";
import MatrixEffect from "@/shared/components/common/MatrixRain";
import { getMatrixColors } from "../articles/Articles";
import { howIDoItSubMenu } from "../side-bar/data";
import { useMarkdownContent } from "@/shared/hooks/useMarkdownContent";
import { MarkdownRenderer } from "@/shared/components/markdown/MarkdownRenderer";
import { useMemo } from "react";

const HowIDoItPage = () => {
    const [location] = useLocation();
    const { lang } = useLanguage();
    const pageName = location.split("/").pop() || "";

    const fileSuffix = lang === "en" ? "-en" : "";

    const contentMap = useMemo(() => {
        return {
            "test-plan": () =>
                import(`../../pages/how-i-do-it/test-plan${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import("../../pages/how-i-do-it/test-plan.md?raw").then((mod) => mod.default)),
            "test-case": () =>
                import(`../../pages/how-i-do-it/test-case${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import("../../pages/how-i-do-it/test-case.md?raw").then((mod) => mod.default)),
            "test-architecture": () =>
                import(`../../pages/how-i-do-it/test-architecture${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import("../../pages/how-i-do-it/test-architecture.md?raw").then((mod) => mod.default)),
            "playwright-class": () =>
                import(`../../pages/how-i-do-it/playwright-class${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import("../../pages/how-i-do-it/playwright-class.md?raw").then((mod) => mod.default)),
            // "playwright-func": () =>
            //     import(`../../pages/how-i-do-it/playwright-func${fileSuffix}.md?raw`)
            //         .then((mod) => mod.default)
            //         .catch(() => import("../../pages/how-i-do-it/playwright-func.md?raw").then((mod) => mod.default)),
            "bug-reporting": () =>
                import(`../../pages/how-i-do-it/bug-reporting${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import("../../pages/how-i-do-it/bug-reporting.md?raw").then((mod) => mod.default)),
        };
    }, [fileSuffix]);

    const { markdownContent, isLoading } = useMarkdownContent({
        contentMap,
        slug: pageName,
        fallback: "# Content not found"
    });

    const menuItem = howIDoItSubMenu.find(item => item.path.endsWith(pageName));
    const pageTitle = menuItem?.label || { pl: "Jak to robię", en: "How I Do It" };

    return (
        <>
            <MatrixEffect immediate bgOpacity={0.2} matrixColors={getMatrixColors()} />
            <div className="articles-container relative z-10">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* <h1 className="text-3xl font-bold text-[var(--matrix-light)]">
                        {pageTitle[lang]}
                    </h1> */}

                    {isLoading ? (
                        <div className="text-[var(--matrix-light)]">Loading...</div>
                    ) : (
                        <MarkdownRenderer
                            content={markdownContent}
                            className="border-[1px] border-[var(--matrix-dark)] p-4"
                        />
                    )}
                </motion.div>
            </div>
        </>
    );
};

export default HowIDoItPage;