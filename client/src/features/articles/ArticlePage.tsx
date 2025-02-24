import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import MatrixEffect from "@/shared/components/common/MatrixRain";
import { getMatrixColors } from "./Articles";
import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/atom-one-dark.css";

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
    const [markdownContent, setMarkdownContent] = React.useState("");

    React.useEffect(() => {
        const loadArticle = async () => {
            if (articleMap[slug]) {
                const content = await articleMap[slug]();
                setMarkdownContent(content as string);
            }
        };
        loadArticle();
    }, [slug]);

    return (
        <>
            <MatrixEffect immediate bgOpacity={0.2} matrixColors={getMatrixColors()} />
            <div className="articles-container relative z-10">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Tytuł artykułu */}
                    {/* <h1 className="articles-title text-[var(--matrix-light)]">{slug}</h1> */}
                    <div className="markdown-body border-[1px] border-[var(--matrix-dark)] p-4">
                        <ReactMarkdown
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                a: ({ node, ...props }) => (
                                    <a {...props} target="_blank" rel="noopener noreferrer" />
                                ),
                                code({ node, inline, className, children, ...props }: any) {
                                    return !inline ? (
                                        <pre className="bg-[var(--matrix-black)] text-[var(--matrix-white)] p-2 rounded overflow-x-auto my-4">
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    ) : (
                                        <code className="bg-[var(--matrix-black)] text-[var(--matrix-white)] px-1 rounded" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {markdownContent}
                        </ReactMarkdown>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ArticlePage;