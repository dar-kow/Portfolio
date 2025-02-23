export type LocalizedString = {
  pl: string;
  en: string;
};

export type ArticlesMessages = {
  title: LocalizedString;
};

export type Article = {
  title: LocalizedString;
  date: string;
  description: LocalizedString;
  link: string;
};

export const articlesMessages: ArticlesMessages = {
  title: { pl: "Artykuły", en: "Articles" },
};

export const articles: Article[] = [
  {
    title: {
      pl: "Budowanie animacji w stylu Matrix z Framer Motion",
      en: "Building Matrix-style Animations with Framer Motion",
    },
    date: "2025-02-22",
    description: {
      pl: "Dowiedz się, jak stworzyć przyciągające animacje inspirowane filmem Matrix.",
      en: "Learn how to create engaging Matrix-inspired animations using Framer Motion in React",
    },
    link: "/articles/matrix-portfolio",
  },
  {
    title: {
      pl: "Unikanie waitForTimeout w testach",
      en: "Avoiding waitForTimeout in tests",
    },
    date: "2025-02-02",
    description: {
      pl: "Unikanie waitForTimeout w testach Playwright. Zalety, wady i alternatywy",
      en: "Avoiding waitForTimeout in Playwright Testing: Advantages, Disadvantages, and Alternatives",
    },
    link: "/articles/avoiding-wait-for-timeout",
  },
  {
    title: {
      pl: "Portfolio po co to komu?",
      en: "What's the point of a portfolio?",
    },
    date: "2025-02-23",
    description: {
      pl: "Czy warto tracić czas i energię na stworzenie portfolio?",
      en: "Is it worth wasting time and energy to create a portfolio?",
    },
    link: "/articles/portfolio-idea",
  },
];
