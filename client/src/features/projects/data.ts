export type LocalizedString = {
  pl: string;
  en: string;
};

export type ProjectsMessages = {
  title: LocalizedString;
  sourceCode: LocalizedString;
  liveDemo: LocalizedString;
};

export type Project = {
  title: LocalizedString;
  description: LocalizedString;
  link: string;
  demo: string;
};

export const projectsMessages: ProjectsMessages = {
  title: { pl: "Projekty", en: "Projects" },
  sourceCode: { pl: "Kod źródłowy", en: "Source Code" },
  liveDemo: { pl: "Demo", en: "Live Demo" },
};

export const projects: Project[] = [
  {
    title: { pl: "Projekt MAF - Moja Aplikacja Faktur", en: "Project MAF" },
    description: {
      pl: "Proste narzędzie do analizy finansowej z przetwarzaniem danych w czasie rzeczywistym",
      en: "Simple financial analysis tool with real-time data processing",
    },
    link: "https://github.com/darek9k/M-A-F",
    demo: "http://srv10.mikr.us:20267",
  },
  {
    title: { pl: "Portfolio Website", en: "Portfolio Website" },
    description: {
      pl: "Portfolio z efektami w stylu Matrix zbudowane przy użyciu React",
      en: "Personal portfolio with Matrix-style animations built using React",
    },
    link: "https://github.com/portfolio",
    demo: "https://portfolio.bieda.it",
  },
  {
    title: { pl: "Testy Playwright - aplikacji MAF", en: "Playwright Testing - MAF App" },
    description: {
      pl: "Jak nie dać się zwariować i stworzyć skalowalną strukturę do stabilnych testów.",
      en: "How to avoid going crazy and create a scalable structure for stable testing.",
    },
    link: "https://github.com/playwright-maf",
    demo: "https://portfolio.bieda.it",
  },
];
