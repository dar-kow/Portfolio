import { useState, useEffect } from "react";

interface UseMarkdownContentOptions {
  contentMap: Record<string, () => Promise<string>>;
  slug: string;
  fallback?: string;
}

export function useMarkdownContent({ contentMap, slug, fallback = "" }: UseMarkdownContentOptions) {
  const [markdownContent, setMarkdownContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (contentMap[slug]) {
          const content = await contentMap[slug]();
          setMarkdownContent(content);
        } else {
          setMarkdownContent(fallback || "# Content not found");
          setError(new Error(`No content found for slug: ${slug}`));
        }
      } catch (err) {
        setMarkdownContent(fallback || "# Error loading content");
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, [slug, contentMap, fallback]);

  return { markdownContent, isLoading, error };
}