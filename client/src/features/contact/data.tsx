import React from "react";

export type LocalizedString = {
  pl: string;
  en: string;
};

export type ContactFormMessages = {
  header: LocalizedString;
  namePlaceholder: LocalizedString;
  emailPlaceholder: LocalizedString;
  messagePlaceholder: LocalizedString;
  submitButton: LocalizedString;
};

export const contactFormMessages: ContactFormMessages = {
  header: { pl: "Kontakt", en: "Contact" },
  namePlaceholder: { pl: "Imię", en: "Name" },
  emailPlaceholder: { pl: "Adres email", en: "Email address" },
  messagePlaceholder: { pl: "Treść wiadomości", en: "Message" },
  submitButton: { pl: "Wyślij", en: "Send" },
};