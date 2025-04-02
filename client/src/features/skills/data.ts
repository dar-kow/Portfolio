export type LocalizedString = {
  pl: string;
  en: string;
};

export type Skill = {
  name: LocalizedString;
  level: number;
  description?: LocalizedString;
};

export type LearningItem = {
  name: LocalizedString;
  level: number;
  description: LocalizedString;
};

export type SkillsMessages = {
  skillsTab: LocalizedString;
  learningTab: LocalizedString;
  learningDescription: LocalizedString;
};

export const skills: Skill[] = [
  {
    name: { pl: "Frameworki testowe (Playwright, Cypress, Selenium)", en: "Testing Frameworks (Playwright, Cypress, Selenium)" },
    level: 80,
    description: {
      pl: "Biegła znajomość różnych frameworków testowych z naciskiem na Playwright i Cypress. Doświadczenie w projektowaniu stabilnych architektur testowych, implementacji Page Object Pattern oraz integracji z CI/CD.",
      en: "Proficient in various testing frameworks with emphasis on Playwright and Cypress. Experience in designing stable test architectures, implementing Page Object Pattern, and CI/CD integration."
    }
  },
  {
    name: { pl: "Typescript (Frontend i Backend)", en: "Typescript (Frontend & Backend)" },
    level: 70,
  },
  { name: { pl: "Testy manualne", en: "Manual Testing" }, level: 65 },
  {
    name: {
      pl: "Zarządzanie projektami (JIRA, ClickUp)",
      en: "Project Management (JIRA, ClickUp)",
    },
    level: 75,
  },
  { name: { pl: "MongoDB & SQL", en: "MongoDB & SQL" }, level: 65 },
  { name: { pl: "Docker", en: "Docker" }, level: 50 },
  { name: { pl: "Paca zespołowa i komunikacja", en: "Teamwork and Communication" }, level: 80 },
  { name: { pl: "Publikowanie artykułów", en: "Publication of Articles" }, level: 60 },
  {
    name: { pl: "AI jako wsparcie w testach", en: "AI-Augmented Test Automation & Prompt Engineering" },
    level: 70,
    description: {
      pl: "Wykorzystuję AI do optymalizacji testów automatycznych i analizy kodu, usprawniając procesy QA. Korzystam z narzędzi AI do generowania scenariuszy testowych, analizy logów i wykrywania anomalii, jednocześnie dbając o ich walidację i poprawność.",
      en: "I utilize AI to optimize automated testing and code analysis, improving QA processes. I leverage AI tools for test scenario generation, log analysis, and anomaly detection while ensuring their validation and accuracy.",
    },
  },
  {
    name: { pl: "AI / Chatboty / Automatyzacja", en: "AI / Chatbots / Automation" },
    level: 50,
    description: {
      pl: "Tworzę inteligentne systemy automatyzacji wykorzystujące bazy wektorowe Qadrant, platformę przepływów n8n oraz modele językowe (LLM) do budowy efektywnych chatbotów i agentów AI, optymalizujących procesy biznesowe.",
      en: "I create intelligent automation systems using Qadrant vector databases, n8n workflows, and language models (LLM) to build effective chatbots and AI agents that optimize business processes.",
    },
  },
  {
    name: { pl: "Java - podstawy", en: "Java - basics" },
    level: 45,
    description: {
      pl: "Podstawowa znajomość Javy wykorzystywana głównie w kontekście automatyzacji testów i integracji z narzędziami jak Selenium WebDriver.",
      en: "Basic knowledge of Java used primarily in the context of test automation and integration with tools like Selenium WebDriver."
    }
  },
  {
    name: { pl: "React - podstawy", en: "React - basics" },
    level: 55,
    description: {
      pl: "Znajomość podstaw React pozwalająca na lepsze zrozumienie testowanych aplikacji oraz tworzenie prostych komponentów i rozszerzeń.",
      en: "Understanding of React basics allowing for better comprehension of tested applications and creation of simple components and extensions."
    }
  },
  {
    name: { pl: ".NET - podstawy", en: ".NET - basics" },
    level: 40,
    description: {
      pl: "Podstawowa znajomość .NET Framework pozwalająca na współpracę z zespołami programistycznymi i lepsze zrozumienie testowanych aplikacji.",
      en: "Basic knowledge of .NET Framework enabling collaboration with development teams and better understanding of tested applications."
    }
  },
];

export const learning: LearningItem[] = [
  {
    name: { pl: "React + TypeScript", en: "React + TypeScript" },
    level: 60,
    description: {
      pl: "Uczę się łączyć komponenty i zarządzać stanem za pomocą Redux.",
      en: "Learning to combine components and manage state with Redux.",
    },
  },
  {
    name: { pl: ".NET C#", en: ".NET C#" },
    level: 40,
    description: {
      pl: "Pracuję nad rozwijaniem backendu w .NET, poznałem podstawy ASP.NET Core.",
      en: "Developing backend in .NET and familiar with ASP.NET Core basics.",
    },
  },
  {
    name: { pl: "RabbitMQ", en: "RabbitMQ" },
    level: 30,
    description: {
      pl: "Rozpoczynam naukę asynchronicznej komunikacji przy pomocy RabbitMQ.",
      en: "Starting to learn asynchronous communication with RabbitMQ.",
    },
  },
  {
    name: { pl: "Redux Saga", en: "Redux Saga" },
    level: 35,
    description: {
      pl: "Zmieniam sposób zarządzania side effectami w aplikacji, ucząc się Redux Saga.",
      en: "Changing side effect management with Redux Saga.",
    },
  },
  {
    name: { pl: "CI/CD i DevOps", en: "CI/CD and DevOps" },
    level: 45,
    description: {
      pl: "Rozwijam umiejętności konfiguracji GitHub Actions do automatycznego deploymentu na serwerze VPS. Pracuję nad automatyzacją procesu od testów po wdrożenie, włączając wdrażanie SSL i backupy.",
      en: "Developing skills in GitHub Actions configuration for automatic deployment to VPS servers. Working on automating the process from testing to deployment, including SSL implementation and backups."
    }
  },
  {
    name: { pl: "Next.js i SSR", en: "Next.js and SSR" },
    level: 50,
    description: {
      pl: "Eksperymentuję z Next.js do renderowania aplikacji React po stronie serwera, z naciskiem na optymalizację SEO i wydajności.",
      en: "Experimenting with Next.js for server-side rendering of React applications, focusing on SEO and performance optimization."
    }
  },
];

export const skillsMessages: SkillsMessages = {
  skillsTab: { pl: "Umiejętności", en: "Skills" },
  learningTab: { pl: "Uczenie się", en: "Learning" },
  learningDescription: {
    pl: "Rozwój to dla mnie kluczowy element kariery zawodowej. Obecnie pracuję nad nową aplikacją do faktur aby podnieść swoje kwalifikacje:",
    en: "Growth is a key part of my career. I am currently developing a new invoicing app:",
  },
};
