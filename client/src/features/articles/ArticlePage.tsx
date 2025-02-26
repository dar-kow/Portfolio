import { useLocation } from "wouter";
import { motion } from "framer-motion";
import MatrixEffect from "@/shared/components/common/MatrixRain";
import { getMatrixColors } from "./Articles";
import { useMarkdownContent } from "@/shared/hooks/useMarkdownContent";
import { MarkdownRenderer } from "@/shared/components/markdown/MarkdownRenderer";

const articleMap: Record<string, () => Promise<string>> = {
    "avoiding-wait-for-timeout": () =>
        import("../../pages/avoiding-wait-for-timeout.md?raw").then((mod) => mod.default),
    "matrix-portfolio": () =>
        import("../../pages/portfolio-matrix-react.md?raw").then((mod) => mod.default),
    "portfolio-idea": () =>
        import("../../pages/portfolio-idea.md?raw").then((mod) => mod.default),
    "learning-coding-and-AI": () =>
        import("../../pages/learning-coding-and-AI.md?raw").then((mod) => mod.default),
    "reverse-proxy-nginx": () =>
        import("../../pages/reverse-proxy-nginx.md?raw").then((mod) => mod.default),
};

const ArticlePage = () => {
    const [location] = useLocation();
    const slug = location.split("/").pop() || "avoiding-wait-for-timeout";
    const { markdownContent, isLoading } = useMarkdownContent({
        contentMap: articleMap,
        slug
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