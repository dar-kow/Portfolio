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
      pl: "Testy interfejsu użytkownika - MAF",
      en: "User Interface Testing - MAF",
    },
    date: "2025-04-26",
    description: {
      pl: "Playwright / TS / Return Early Pattern / POM / Vertical Slice",
      en: "Playwright / TS / Return Early Pattern / POM / Vertical Slice",
    },
    link: "/articles/ui-tests-playwright-maf",
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
  {
    title: {
      pl: "Wzorzec Fasady i Delagacji",
      en: "Facade and Delegation Pattern",
    },
    date: "2025-04-07",
    description: {
      pl: "Refaktoryzacja dużych plików testowych. Sposób na uporządkowanie chaosu",
      en: "Refactoring large test files. A way to organize chaos",
    },
    link: "/articles/facade-pattern-and-delegation",
  },
  {
    title: {
      pl: "Automatyczne Daty Aktualizacji w Portfolio Projektu",
      en: "Automatic Update Dates in Project Portfolio",
    },
    date: "2025-04-08",
    description: {
      pl: "Korzyści dla prestiżu portfolio",
      en: "Benefits for portfolio prestige",
    },
    link: "/articles/automatic-update-dates-is-project-portfolio",
  },
  {
    title: {
      pl: "Asercje w Playwright: Kiedy faktycznie potrzebujesz await?",
      en: "Assertions in Playwright: When Do You Actually Need await?",
    },
    date: "2025-05-20",
    description: {
      pl: "Analiza techniczna dotycząca używania słowa kluczowego await z asercjami w Playwright. Artykuł obala popularny mit, że wszystkie asercje wymagają await, prezentując szczegółową analizę różnych typów asercji oraz wskazówki, kiedy await jest niezbędne, a kiedy niepotrzebne.",
      en: "Technical analysis of using the await keyword with assertions in Playwright. This article debunks the common myth that all assertions require await, presenting a detailed breakdown of different assertion types and clear guidelines on when await is necessary and when it's redundant.",
    },
    link: "/articles/playwright-assertions-when-you-need-await",
  },
  {
    title: {
      pl: "Gdy Extension Host odmawia posłuszeństwa - czyli jak stworzyliśmy Claude VSCode Controller na Linux",
      en: "When the Extension Host Refuses to Cooperate – How We Built Claude VSCode Controller for Linux",
    },
    date: "2025-07-08",
    description: {
      pl: "Czy kiedykolwiek miałeś moment, gdy potrzebujesz czegoś tak bardzo, że gotów jesteś to stworzyć od zera? Ja właśnie przeżyłem taki moment. Historia, którą wam opowiem, to nie tylko techniczny case study, ale przede wszystkim opowieść o tym, że czasem najbardziej frustrujące problemy prowadzą do najciekawszych rozwiązań.",
      en: "Have you ever had a moment when you needed something so badly that you were willing to create it from scratch? I just experienced such a moment. The story I'm going to tell you is not only a technical case study but, above all, a tale of how sometimes the most frustrating problems lead to the most interesting solutions.",
    },
    link: "/articles/claude_vscode_article",
  },
];
