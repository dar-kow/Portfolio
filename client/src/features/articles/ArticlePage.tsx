import { useLocation } from "wouter";
import { motion } from "framer-motion";
import MatrixEffect from "@/shared/components/common/MatrixRain";
import { getMatrixColors } from "./Articles";
import { useMarkdownContent } from "@/shared/hooks/useMarkdownContent";
import { MarkdownRenderer } from "@/shared/components/markdown/MarkdownRenderer";
import { useLanguage } from "@/shared/components/common/LanguageContext";
import { useMemo } from "react";

const ArticlePage = () => {
    const [location] = useLocation();
    const { lang } = useLanguage();
    const slug = location.split("/").pop() || "avoiding-wait-for-timeout";

    const fileSuffix = lang === "en" ? "-en" : "";

    const articleMap = useMemo(() => {
        return {
            "avoiding-wait-for-timeout": () =>
                import(`../../pages/avoiding-wait-for-timeout${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import(`../../pages/avoiding-wait-for-timeout.md?raw`).then((mod) => mod.default)),
            "matrix-portfolio": () =>
                import(`../../pages/portfolio-matrix-react${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import(`../../pages/portfolio-matrix-react.md?raw`).then((mod) => mod.default)),
            "portfolio-idea": () =>
                import(`../../pages/portfolio-idea${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import(`../../pages/portfolio-idea.md?raw`).then((mod) => mod.default)),
            "learning-coding-and-AI": () =>
                import(`../../pages/learning-coding-and-AI${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import(`../../pages/learning-coding-and-AI.md?raw`).then((mod) => mod.default)),
            "reverse-proxy-nginx": () =>
                import(`../../pages/reverse-proxy-nginx${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import(`../../pages/reverse-proxy-nginx.md?raw`).then((mod) => mod.default)),
            "api-tests-playwright-maf": () =>
                import(`../../pages/api-tests-playwright-maf${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import(`../../pages/api-tests-playwright-maf.md?raw`).then((mod) => mod.default)),
            "ovh-server-zero-to-hero": () =>
                import(`../../pages/ovh-server-zero-to-hero${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import(`../../pages/ovh-server-zero-to-hero.md?raw`).then((mod) => mod.default)),
            "react-testing-library-vs-playwright": () =>
                import(`../../pages/react-testing-library-vs-playwright${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import(`../../pages/react-testing-library-vs-playwright.md?raw`).then((mod) => mod.default)),
            "facade-pattern-and-delegation": () =>
                import(`../../pages/facade-pattern-and-delegation${fileSuffix}.md?raw`)
                    .then((mod) => mod.default)
                    .catch(() => import(`../../pages/facade-pattern-and-delegation.md?raw`).then((mod) => mod.default)),
        };
    }, [fileSuffix]);

    const { markdownContent, isLoading } = useMarkdownContent({
        contentMap: articleMap,
        slug,
    });

    return (
        <>
            <MatrixEffect immediate bgOpacity={0.2} matrixColors={getMatrixColors()} />
            <div className="articles-container relative z-10">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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

export default ArticlePage;