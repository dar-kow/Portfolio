import React from "react";

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
    name: { pl: "Testy automatyzujące (Playwright)", en: "Test Automation (Playwright)" },
    level: 80,
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
    name: { pl: "AI jako wsparcie w testach i inżynierii promptów", en: "AI-Augmented Test Automation & Prompt Engineering" },
    level: 60,
    description: {
      pl: "Wykorzystuję AI do optymalizacji testów automatycznych i analizy kodu, usprawniając procesy QA. Korzystam z narzędzi AI do generowania scenariuszy testowych, analizy logów i wykrywania anomalii, jednocześnie dbając o ich walidację i poprawność.",
      en: "I utilize AI to optimize automated testing and code analysis, improving QA processes. I leverage AI tools for test scenario generation, log analysis, and anomaly detection while ensuring their validation and accuracy.",
    },
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
];

export const skillsMessages: SkillsMessages = {
  skillsTab: { pl: "Umiejętności", en: "Skills" },
  learningTab: { pl: "Uczenie się", en: "Learning" },
  learningDescription: {
    pl: "Rozwój to dla mnie kluczowy element kariery zawodowej. Obecnie pracuję nad nową aplikacją do faktur aby podnieść swoje kwalifikacje:",
    en: "Growth is a key part of my career. I am currently developing a new invoicing app:",
  },
};
