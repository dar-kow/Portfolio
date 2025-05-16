import { LocalizedString } from "../articles/data";

export type ReferenceEntry = {
  title: LocalizedString;
  description: LocalizedString;
  longDescription: LocalizedString;
  downloadButton: LocalizedString;
  file: string;
  previewLabel: LocalizedString;
};

export const referencesList: ReferenceEntry[] = [
  {
    title: { pl: "Referencje Vanto", en: "Vanto References" },
    description: {
      pl: "Kompleksowy system ERP dla kluczowego gracza w branży motoryzacyjnej, zoptymalizowany pod kątem efektywnego obiegu dokumentów w procesach magazynowych i sprzedażowych. Projekt obejmował pełną architekturę systemu oraz wdrożenie krytycznych funkcjonalności biznesowych wspierających strategiczne procesy operacyjne klienta. System pomyślnie dostarczony i wdrożony w środowisku produkcyjnym.",
      en: "Comprehensive ERP system for a key player in the automotive industry, optimized for efficient document workflow in warehouse and sales processes. The project encompassed complete system architecture and implementation of critical business functionalities supporting the client's strategic operational processes. System successfully delivered and implemented in production environment.",
    },
    longDescription: {
      pl: "Pełniłem strategiczną rolę architekta procesów jakościowych, projektując i implementując kompleksową strategię QA od podstaw. Obejmowało to opracowanie specjalistycznej dokumentacji testowej, wdrożenie zaawansowanych testów automatycznych (Playwright + TypeScript) oraz rozwój dedykowanych narzędzi diagnostycznych. Zastosowane przeze mnie metodologie zapewniły najwyższe standardy jakości wdrożenia, znaczącą redukcję ryzyka biznesowego oraz 98% pokrycie testami regresyjnymi kluczowych funkcjonalności. Projekt został zakończony sukcesem i przekazany klientowi zgodnie z harmonogramem.",
      en: "I served in the strategic role of quality process architect, designing and implementing a comprehensive QA strategy from the ground up. This included developing specialized test documentation, implementing advanced automated tests (Playwright + TypeScript), and evolving dedicated diagnostic tools. The methodologies I applied ensured the highest implementation quality standards, significant business risk reduction, and 98% regression test coverage of key functionalities. The project was successfully completed and handed over to the client according to schedule.",
    },
    downloadButton: { pl: "Pobierz PDF Vanto", en: "Download Vanto PDF" },
    file: "/assets/referencje_vanto.pdf",
    previewLabel: { pl: "Podgląd referencji Vanto", en: "Vanto PDF Preview" },
  },
  {
    title: { pl: "Referencje zapisani.pl", en: "References zapisani.pl" },
    description: {
      pl: "zapisani.pl - zaawansowana platforma zarządzania eventami, osiągająca ponadprzeciętne wskaźniki konwersji dla organizatorów konferencji, instytucji edukacyjnych i wydarzeń grupowych. System skutecznie optymalizuje procesy rejestracji, płatności i komunikacji, zapewniając bezpieczeństwo danych i skalowalność.",
      en: "zapisani.pl - advanced event management platform achieving exceptional conversion metrics for conference organizers, educational institutions, and group activities. The system effectively optimizes registration, payment, and communication processes while ensuring data security and scalability.",
    },
    longDescription: {
      pl: "Przeprowadziłem strategiczną transformację infrastruktury testowej, migrując środowisko z Cypress do Playwright, co zaowocowało 65% przyspieszeniem cykli testowych i umożliwiło terminowe wdrożenie produkcyjne. Zaimplementowany przeze mnie framework testowy znacząco zwiększył stabilność aplikacji i zredukował wskaźnik defektów o 42% w obszarach krytycznych. Po osiągnięciu dojrzałości produktowej, zaprojektowałem zoptymalizowany model utrzymania jakości, umożliwiający efektywną alokację zasobów przy jednoczesnym zachowaniu rygorystycznych standardów. Aktualnie pełnię rolę konsultanta strategicznego w zakresie jakości, koncentrując się na długoterminowej stabilności platformy.",
      en: "I led a strategic transformation of the testing infrastructure, migrating the environment from Cypress to Playwright, which resulted in a 65% acceleration of testing cycles and enabled timely production deployment. The testing framework I implemented significantly increased application stability and reduced the defect rate by 42% in critical areas. After achieving product maturity, I designed an optimized quality maintenance model, enabling efficient resource allocation while maintaining rigorous standards. I currently serve as a strategic quality consultant, focusing on the long-term stability of the platform.",
    },
    downloadButton: { pl: "Pobierz PDF", en: "Download PDF" },
    file: "/assets/referencje.pdf",
    previewLabel: { pl: "Podgląd referencji", en: "PDF Preview" },
  },
];
