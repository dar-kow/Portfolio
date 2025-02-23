import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "pl" | "en";

type LanguageContextType = {
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from localStorage (or navigator) once
  const getInitialLang = (): Language => {
    const stored = localStorage.getItem("lang");
    if (stored === "pl" || stored === "en") return stored as Language;
    return navigator.language.startsWith("pl") ? "pl" : "en";
  };

  const [lang, setLangState] = useState<Language>(getInitialLang());

  // Whenever language changes, save it to localStorage.
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  const toggleLang = () => {
    setLang(lang === "pl" ? "en" : "pl");
  };

  // (Optional) Listen for changes in localStorage if needed

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
