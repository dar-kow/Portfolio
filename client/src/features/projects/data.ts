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
    title: { pl: "Testy Playwright - aplikacji MAF", en: "Playwright Testing - MAF App" },
    description: {
      pl: "Jak nie dać się zwariować i stworzyć skalowalną strukturę do stabilnych testów.",
      en: "How to avoid going crazy and create a scalable structure for stable testing.",
    },
    link: "",
    demo: "",
    // link: "https://github.com/playwright-maf",
    // demo: "https://portfolio.bieda.it",
  },
  {
    title: { pl: "SDET - Strefa dla testerów, których korci na więcej", en: "SDET - The Zone for Testers Who Want More" },
    description: {
      pl: "Projekt w fazie budowy. Już wkrótce pokaże, jak zbudować prostą, ale skuteczną stronę startową inicjującą projekt. Założeniem jest nie tylko stworzenie atrakcyjnego interfejsu, ale także zbieranie subskrybentów i zaproszenie chętnych do współtworzenia. W tle działa solidny backend z panelem administratora – zarządzanie danymi, autoryzacja oparta o JWT i baza PostgreSQL gwarantują nowoczesne podejście. Start odliczania to pierwszy, ale najważniejszy krok, który motywuje do działania. Stay tuned!",
      en: "Project Under Construction. Coming soon: a showcase on how to build a simple yet effective landing page to kickstart your project. The aim is not only to create an attractive interface but also to gather subscribers and invite interested collaborators. Behind the scenes, a robust backend featuring an admin panel—with data management, JWT-based authentication, and PostgreSQL—ensures a modern approach. The countdown to launch is the first, and most important, step that motivates action. Stay tuned!",
    },
    link:"",
    // link: "https://github.com/dar-kow/portfolio",
    demo: "https://sdet.pl",
  },
];
