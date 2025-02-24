import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription } from "../../shared/components/ui/card";
import { articlesMessages, articles } from "./data";
import { useLanguage } from "../../shared/components/common/LanguageContext";
import MatrixEffect from "@/shared/components/common/MatrixRain";

export const getMatrixColors = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  return [
    rootStyles.getPropertyValue("--matrix-black").trim(),
    rootStyles.getPropertyValue("--matrix-bg").trim(),
    rootStyles.getPropertyValue("--matrix-darker").trim(),
    rootStyles.getPropertyValue("--matrix-dark").trim(),
  ];
};

const Articles = () => {
  const { lang } = useLanguage();

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <>
      <MatrixEffect immediate bgOpacity={0.2} matrixColors={getMatrixColors()} />
      <div className="articles-container relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h1 className="articles-title text-[var(--matrix-light)]">
            {articlesMessages.title[lang]}
          </h1>
          <div className="articles-grid">
            {sortedArticles.map((article, index) => (
              <motion.div
                key={article.title.en}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={article.link}>
                  <a>
                    <Card className="cursor-pointer bg-[var(--matrix-bg)] border border-[var(--matrix-dark)] hover:shadow-[0_0_8px_#80ce87] transition-all duration-200">
                      <CardHeader>
                        <div className="text-sm text-[var(--matrix-white)]">{article.date}</div>
                        <CardTitle className="text-[var(--matrix-white)] text-xl font-bold">
                          {article.title[lang]}
                        </CardTitle>
                        <CardDescription className="text-[var(--matrix-white)]">
                          {article.description[lang]}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Articles;
