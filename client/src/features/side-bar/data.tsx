import React from "react";
import { Home, Folder, BookOpen, Code, FileText, HelpCircle, FileCode2 } from "lucide-react";

export const contactMessages = {
    contactButton: {
        pl: "Kontakt",
        en: "Contact",
    },
};

export type LocalizedLabel = {
    pl: string;
    en: string;
};

export type SubMenuItem = {
    path: string;
    label: LocalizedLabel;
};

export type MenuItem = {
    path: string;
    label: LocalizedLabel;
    icon: React.ReactNode;
    subMenu?: SubMenuItem[];
};

export const howIDoItSubMenu: SubMenuItem[] = [
    { path: "/how-i-do-it/test-plan", label: { pl: "Plan testów", en: "Test Plan" } },
    { path: "/how-i-do-it/test-case", label: { pl: "Przypadek testowy", en: "Test Case" } },
    { path: "/how-i-do-it/test-architecture", label: { pl: "Architektura testów", en: "Test Architecture" } },
    { path: "/how-i-do-it/playwright-class", label: { pl: "Playwright (TS klasy)", en: "Playwright (TS Classes)" } },
    { path: "/how-i-do-it/playwright-func", label: { pl: "Playwright (TS funkcje)", en: "Playwright (TS Functions)" } },
    { path: "/how-i-do-it/bug-reporting", label: { pl: "Zgłaszanie błędów", en: "Bug Reporting" } },
];

export const menuItems: MenuItem[] = [
    { path: "/", label: { pl: "Home", en: "Home" }, icon: <Home className="w-5 h-5" /> },
    { path: "/projects", label: { pl: "Projekty", en: "Projects" }, icon: <Folder className="w-5 h-5" /> },
    { path: "/articles", label: { pl: "Artykuły", en: "Articles" }, icon: <BookOpen className="w-5 h-5" /> },
    { path: "/skills", label: { pl: "Umiejętności", en: "Skills" }, icon: <Code className="w-5 h-5" /> },
    {
        path: "/references",
        label: { pl: "Referencje", en: "References" },
        icon: <FileText className="w-5 h-5" />,
    },
    {
        path: "/how-i-do-it",
        label: { pl: "Jak to robię:", en: "How I Do It:" },
        icon: <HelpCircle className="w-5 h-5" />,
        subMenu: howIDoItSubMenu,
    },
];

export const socialLinks = {
    github: "https://github.com/darek9k?tab=repositories",
    linkedin: "https://www.linkedin.com/in/darecki9k/",
};