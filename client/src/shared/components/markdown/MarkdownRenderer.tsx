import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/atom-one-dark.css";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

const customSlugify = (text: string): string => {
    const customIdMatch = text.match(/{#([a-z0-9-]+)}/i);
    if (customIdMatch) {
        return customIdMatch[1];
    }

    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[ąĄ]/g, 'a')
        .replace(/[ćĆ]/g, 'c')
        .replace(/[ęĘ]/g, 'e')
        .replace(/[łŁ]/g, 'l')
        .replace(/[ńŃ]/g, 'n')
        .replace(/[óÓ]/g, 'o')
        .replace(/[śŚ]/g, 's')
        .replace(/[żŻźŹ]/g, 'z')
        .replace(/[^\w-]/g, '')
        .replace(/--+/g, '-')
        .replace(/{#[a-z0-9-]+}/gi, '');
};

const cleanTextFromIdTags = (text: string): string => {
    return typeof text === 'string' ? text.replace(/{#[a-z0-9-]+}/gi, '') : text;
};

const findElementId = (href: string): string => {
    if (!href.startsWith('#')) return href;

    const linkText = decodeURIComponent(href.substring(1));

    if (document.getElementById(linkText)) {
        return linkText;
    }

    return customSlugify(linkText);
};

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    themeCSS: `
    .node rect, .node circle, .node ellipse, .node polygon, .node path {
      fill: #1a1a1a;
      stroke: #80ce87;
    }
    .edgePath .path {
      stroke: #80ce87;
    }
    .cluster rect {
      fill: #0f1419;
      stroke: #80ce87;
    }
    .label {
      color: #e5e0d6;
    }
    .edgeLabel {
      background-color: #1a1a1a;
      color: #e5e0d6;
    }
  `
});

const MermaidRenderer = ({ code }: { code: string }) => {
    const mermaidRef = useRef<HTMLDivElement>(null);
    const codeId = `mermaid-${Math.random().toString(36).substring(2, 11)}`;

    useEffect(() => {
        if (mermaidRef.current) {
            mermaidRef.current.innerHTML = '';
            mermaid.render(codeId, code)
                .then(({ svg }) => {
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = svg;
                    }
                })
                .catch(error => {
                    console.error("Failed to render mermaid diagram:", error);
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = `<pre>Error rendering diagram: ${error.message}</pre>`;
                    }
                });
        }
    }, [code, codeId]);

    return <div className="my-6" ref={mermaidRef} />;
};

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    const [tocLinks, setTocLinks] = useState<string[]>([]);
    const [hasTableOfContents, setHasTableOfContents] = useState(false);

    useEffect(() => {
        const hasTOC = content.includes("Spis treści") || content.includes("Table of Contents");
        setHasTableOfContents(hasTOC);

        if (hasTOC) {
            const linkRegex = /\[.*?\]\((#[^)]+)\)/g;
            const matches = Array.from(content.matchAll(linkRegex));

            const links = matches.map(match => decodeURIComponent(match[1].substring(1)));
            setTocLinks(links);
        }
    }, [content]);

    useEffect(() => {
        if (window.location.hash) {
            const id = decodeURIComponent(window.location.hash.substring(1));
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        }
    }, [content]);

    const renderHeading = (level: 'h1' | 'h2' | 'h3') => {
        const sizing = {
            h1: "text-2xl font-bold mt-6 mb-4",
            h2: "text-xl font-bold mt-5 mb-3",
            h3: "text-lg font-bold mt-4 mb-2"
        };

        return ({ node, children, ...props }: any) => {
            const cleanChildren = cleanTextFromIdTags(children);
            const HeadingTag = level;

            const isInTOC = hasTableOfContents && tocLinks.some(link => {
                return link === props.id || link === customSlugify(String(cleanChildren));
            });

            if (!isInTOC) {
                return (
                    <HeadingTag id={props.id} className={sizing[level]} {...props}>
                        {cleanChildren}
                    </HeadingTag>
                );
            }

            return (
                <HeadingTag
                    id={props.id}
                    className={`group flex items-center ${sizing[level]}`}
                    {...props}
                >
                    {cleanChildren}
                    <a href={`#${props.id}`} className="ml-2 text-[var(--matrix-primary)] opacity-0 group-hover:opacity-100 transition-opacity matrix-link">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                    </a>
                </HeadingTag>
            );
        };
    };

    const rehypePlugins = [
        rehypeHighlight,
        [rehypeSlug, {
            slugify: customSlugify
        }]
    ];

    if (hasTableOfContents) {
        rehypePlugins.push([
            rehypeAutolinkHeadings,
            {
                behavior: 'wrap',
                properties: {
                    className: ['matrix-link']
                },
                test: (element) => {
                    if (element.tagName === 'h1' || element.tagName === 'h2' || element.tagName === 'h3') {
                        const id = element.properties?.id;
                        return tocLinks.includes(id as string);
                    }
                    return false;
                }
            }
        ] as any);
    }

    return (
        <div className={`markdown-body ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={rehypePlugins as any}
                components={{
                    h1: renderHeading('h1'),
                    h2: renderHeading('h2'),
                    h3: renderHeading('h3'),

                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-6 my-4 space-y-1" {...props} />
                    ),

                    ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-6 my-4 space-y-1" {...props} />
                    ),

                    li: ({ node, ...props }) => (
                        <li className="ml-2" {...props} />
                    ),

                    a: ({ node, href, children, ...props }) => {
                        if (href?.startsWith('#')) {
                            const linkTarget = decodeURIComponent(href.substring(1));

                            const expectedElementId = findElementId(href);

                            return (
                                <a
                                    href={href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const targetElement = document.getElementById(expectedElementId);
                                        if (targetElement) {
                                            targetElement.scrollIntoView({ behavior: 'smooth' });
                                            window.history.pushState(null, '', href);
                                        } else {
                                            console.warn(`Element z ID "${expectedElementId}" nie został znaleziony`);
                                        }
                                    }}
                                    className="matrix-link"
                                    {...props}
                                >
                                    {children}
                                </a>
                            );
                        }

                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="matrix-link"
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },

                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full border-collapse border border-[var(--matrix-dark)]" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-[var(--matrix-darker)]" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="border border-[var(--matrix-dark)] p-2 text-left font-bold" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="border border-[var(--matrix-dark)] p-2" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                        <tr className="even:bg-[var(--matrix-bg-light)] odd:bg-[var(--matrix-bg)]" {...props} />
                    ),

                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';

                        if (language === 'mermaid') {
                            return <MermaidRenderer code={String(children).replace(/\n$/, '')} />;
                        }

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
                {content}
            </ReactMarkdown>
        </div>
    );
}