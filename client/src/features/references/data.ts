import { LocalizedString } from "../articles/data";

export type ReferencesMessages = {
  title: LocalizedString;
  description: LocalizedString;
  downloadButton: LocalizedString;
  longDescription: LocalizedString;
};

export const referencesMessages: ReferencesMessages = {
  title: { pl: "Referencje", en: "References" },
  description: {
    pl: "zapisani.pl - aplikacja do zarządzania eventami, konferencjami, placówkami edukacyjnymi, koloniami itp",
    en: "zapisani.pl - a comprehensive management platform for events, conferences, educational institutions, summer camps, and various group activities.",
  },
  longDescription: {
    pl: "Projekt osiągnął fazę dojrzałości produktowej i został pomyślnie wdrożony w środowisku produkcyjnym. Obecnie moja rola ewoluowała do eksperta nadzorującego jakość i stabilność aplikacji poprzez monitoring procesów testowych oraz wprowadzanie niezbędnych optymalizacji. Ta strategia zapewnia ciągłość wysokiej jakości produktu przy jednoczesnym efektywnym wykorzystaniu zasobów.",
    en: "The project has reached product maturity and has been successfully deployed to production. My role has evolved to that of an expert overseeing application quality and stability through test process monitoring and implementing necessary optimizations. This strategy ensures continuous product quality while maintaining efficient resource utilization.",
  },
  downloadButton: { pl: "Pobierz PDF", en: "Download PDF" },
};