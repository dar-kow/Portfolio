export type LocalizedString = {
  pl: string;
  en: string;
};

export type ProjectsMessages = {
  title: LocalizedString;
  sourceCode: LocalizedString;
  liveDemo: LocalizedString;
  lastUpdated: LocalizedString; // Added this field
};

export type Project = {
  title: LocalizedString;
  description: LocalizedString;
  link: string;
  demo: string;
  lastCommitDate?: string; // Added this optional field
};

export const projectsMessages: ProjectsMessages = {
  title: { pl: "Projekty", en: "Projects" },
  sourceCode: { pl: "Kod źródłowy", en: "Source Code" },
  liveDemo: { pl: "Demo", en: "Live Demo" },
  lastUpdated: { pl: "Ostatnia aktualizacja", en: "Last updated" }, // Added this message
};

export const projects: Project[] = [
    {
    title: {
      pl: "Claude VSCode Controller - Wieloplatformowy Most AI-IDE",
      en: "Claude VSCode Controller - Cross-Platform AI Development Bridge",
    },
    description: {
      pl: "Zaprojektowałem zaawansowaną integrację czasu rzeczywistego między Claude Desktop AI a VSCode wykorzystując Extension API, komunikację WebSocket oraz Model Context Protocol. System dostarcza 30+ natywnych komend IDE poprzez interfejs naturalnego języka, eliminując zależności CLI dla płynnego doświadczenia użytkownika. Pokonałem złożone wyzwania kompatybilności Linux Extension Host, opracowując automatyczne poprawki oraz kompleksową strategię wieloplatformowego wdrażania.",
      en: "Engineered sophisticated real-time integration between Claude Desktop AI and VSCode using Extension API, WebSocket communication, and Model Context Protocol. Delivers 30+ native IDE commands through natural language interface, eliminating CLI dependencies for seamless user experience. Conquered complex Linux Extension Host compatibility challenges, developing automated fixes and comprehensive cross-platform deployment strategy.",
    },
    link: "https://github.com/dar-kow/claude-vscode-controller",
    demo: "",
  },
  {
    title: {
      pl: "K6 Performance Dashboard with live terminal output",
      en: "K6 Performance Dashboard z wbudowanym terminalem",
    },
    description: {
      pl: "K6 Performance Dashboard to kompleksowa aplikacja internetowa klasy korporacyjnej, opracowana w oparciu o zasady Clean Architecture, służąca do wizualizacji, zarządzania i analizowania wyników testów wydajnościowych K6. Aplikacja została rozszerzona o live terminal oraz możliwość klonowania repozytoriów z testami, umożliwiając przeprowadzanie testów wydajnościowych bez konieczności lokalnego środowiska DEV/QA.",
      en: "K6 Performance Dashboard is a comprehensive, enterprise-grade web application built with Clean Architecture principles for visualizing, managing, and analyzing K6 performance test results. The application has been extended with a live terminal and the ability to clone repositories with tests, allowing performance tests to be conducted without the need for a local DEV/QA environment.",
    },
    link: "https://github.com/dar-kow/k6-dashboard",
    demo: "",
  },
  {
    title: {
      pl: "Testy E2E aplikacji MAF w Playwright",
      en: "E2E Testing of the MAF App with Playwright",
    },
    description: {
      pl: "Zautomatyzowany zestaw testów end-to-end przygotowany w Playwright do weryfikacji kluczowych funkcji mojej autorskiej aplikacji MAF. Skupia się na testowaniu interfejsu, walidacji danych i stabilności działania w różnych scenariuszach użytkownika.",
      en: "An automated end-to-end test suite built with Playwright to verify the core features of my custom MAF application. It focuses on UI testing, data validation, and functional stability across various user scenarios.",
    },
    link: "https://github.com/dar-kow/maf-e2e-pw",
    demo: "",
  },
  {
    title: { pl: "Projekt MAF - Moja Aplikacja Faktur", en: "Project MAF" },
    description: {
      pl: "Proste narzędzie do analizy finansowej z przetwarzaniem danych w czasie rzeczywistym",
      en: "Simple financial analysis tool with real-time data processing",
    },
    link: "https://github.com/dar-kow/M-A-F",
    demo: "http://maf.sdet.pl",
  },
  {
    title: { pl: "Portfolio Website", en: "Portfolio Website" },
    description: {
      pl: "Portfolio z efektami w stylu Matrix zbudowane przy użyciu React",
      en: "Personal portfolio with Matrix-style animations built using React",
    },
    link: "https://github.com/dar-kow/portfolio",
    demo: "https://portfolio.sdet.pl",
  },
  {
    title: {
      pl: "Confluence Headers Manager -  zarządzanie nagłówkami.",
      en: "Confluence Headers Manager - header management.",
    },
    description: {
      pl: "To inteligentne narzędzie rozwiązujące jeden z najbardziej uciążliwych problemów użytkowników Confluence",
      en: "An intelligent tool that solves one of the most frustrating problems for Confluence users",
    },
    link: "https://github.com/dar-kow/confluence-headers-manager-pro",
    demo: "",
    // demo: "https://github.com/dar-kow/confluence-headers-manager-pro",
  },
  {
    title: { pl: "Testy API Playwright - aplikacji MAF", en: "Playwright Testing - MAF App" },
    description: {
      pl: "Jak nie dać się zwariować i stworzyć skalowalną strukturę do stabilnych testów.",
      en: "How to avoid going crazy and create a scalable structure for stable testing.",
    },
    link: "https://github.com/dar-kow/M-A-F/tree/main/maf-api-tests",
    demo: "/articles/api-tests-playwright-maf",
  },
  {
    title: {
      pl: "SDET - Strefa dla testerów, których korci na więcej",
      en: "SDET - The Zone for Testers Who Want More",
    },
    description: {
      pl: "Projekt w fazie budowy. Już wkrótce pokaże, jak zbudować prostą, ale skuteczną stronę startową inicjującą projekt. Założeniem jest nie tylko stworzenie atrakcyjnego interfejsu, ale także zbieranie subskrybentów i zaproszenie chętnych do współtworzenia. W tle działa solidny backend z panelem administratora – zarządzanie danymi, autoryzacja oparta o JWT i baza PostgreSQL gwarantują nowoczesne podejście. Start odliczania to pierwszy, ale najważniejszy krok, który motywuje do działania. Stay tuned!",
      en: "Project Under Construction. Coming soon: a showcase on how to build a simple yet effective landing page to kickstart your project. The aim is not only to create an attractive interface but also to gather subscribers and invite interested collaborators. Behind the scenes, a robust backend featuring an admin panel—with data management, JWT-based authentication, and PostgreSQL—ensures a modern approach. The countdown to launch is the first, and most important, step that motivates action. Stay tuned!",
    },
    link: "",
    // link: "https://github.com/dar-kow/portfolio",
    demo: "https://sdet.pl",
  },
];
