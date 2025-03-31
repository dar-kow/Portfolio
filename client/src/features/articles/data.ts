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
  {
    title: {
      pl: "Ślęczenie nad kodem w 2025 - sensowne czy przestarzałe?",
      en: "Poring Over Code in 2025 - Sensible or Outdated?",
    },
    date: "2025-02-24",
    description: {
      pl: "Czy warto ślęczeć nad kodem w erze AI, czyli programista kontra maszyna",
      en: "Is it worth poring over code in the era of AI, or programmer vs. machine?",
    },
    link: "/articles/learning-coding-and-AI",
  },
  {
    title: {
      pl: "Reverse Proxy z NGINX",
      en: "Reverse Proxy z NGINX",
    },
    date: "2025-02-25",
    description: {
      pl: "Jak to ugryźć? | SPA + Reverse Proxy z NGINX",
      en: "How to get it? | SPA + Reverse Proxy with NGINX",
    },
    link: "/articles/reverse-proxy-nginx",
  },
  {
    title: {
      pl: "Testing Library vs Playwright",
      en: "Testing Library vs Playwright",
    },
    date: "2025-03-31",
    description: {
      pl: "Testowanie komponentów React z Testing Library vs Playwright - co wybrać i kiedy?",
      en: "Testing React Components with Testing Library vs Playwright – Which One to Choose and When?",
    },
   link: "/articles/react-testing-library-vs-playwright",
  },
  {
    title: {
      pl: "API Tests Playwright - MAF",
      en: "API Tests Playwright - MAF",
    },
    date: "2025-03-24",
    description: {
      pl: "Testy backendu w aplikacji MAF - podejście oparte o Playwright",
      en: "Backend testing in the MAF application – a Playwright-based approach",
    },
    link: "/articles/api-tests-playwright-maf",
  },
  {
    title: {
      pl: "OVH od zera do eksperta: ",
      en: "OVH Server Zero to Hero: ",
    },
    date: "2025-03-27",
    description: {
      pl: "Kompleksowa instrukcja konfiguracji serwera",
      en: "A Comprehensive Configuration Manual",
    },
    link: "/articles/ovh-server-zero-to-hero",
  },
];
