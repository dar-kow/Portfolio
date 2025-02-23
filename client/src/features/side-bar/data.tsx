import React from "react";
import { Home, Folder, BookOpen, Code, FileText } from "lucide-react";

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

export type MenuItem = {
    path: string;
    label: LocalizedLabel;
    icon: React.ReactNode;
};

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
];

export const socialLinks = {
    github: "https://github.com/darek9k?tab=repositories",
    linkedin: "https://www.linkedin.com/in/darecki9k/",
};