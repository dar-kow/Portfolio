import ReactGA from "react-ga4";

// Funkcja inicjalizująca Google Analytics
export const initializeGA = (appName: string = "main-site"): void => {
  // Inicjalizujemy GA tylko w środowisku produkcyjnym lub jeśli uruchomiono lokalne testowanie GA
  if (import.meta.env.MODE === "production" || import.meta.env.VITE_ENABLE_GA_DEV === "true") {
    ReactGA.initialize(import.meta.env.VITE_GA_ID, {
      gaOptions: {
        siteSpeedSampleRate: 100,
        cookieDomain: "auto",
      },
    });

    // Ustawienie parametru app_name dla wszystkich zdarzeń
    ReactGA.set({
      app_name: appName,
    });

    // console.log(`Google Analytics initialized for app: ${appName}`);
  } else {
    // console.log('Google Analytics not initialized in development mode');
  }
};

// Funkcja do śledzenia odsłon stron
export const trackPageView = (path: string): void => {
  if (import.meta.env.MODE === "production" || import.meta.env.VITE_ENABLE_GA_DEV === "true") {
    ReactGA.send({ hitType: "pageview", page: path });
    // console.log(`Page view tracked: ${path}`);
  }
};

// Funkcja do śledzenia zdarzeń
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
): void => {
  if (import.meta.env.MODE === "production" || import.meta.env.VITE_ENABLE_GA_DEV === "true") {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
    // console.log(`Event tracked: ${category} - ${action}`);
  }
};
