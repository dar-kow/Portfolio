import ReactGA from "react-ga4";

const isGAEnabled = () => {
  const isProd = import.meta.env.MODE === "production";
  const enableDev = import.meta.env.VITE_ENABLE_GA_DEV === "true";
  return isProd || enableDev;
};

// Funkcja inicjalizująca Google Analytics
export const initializeGA = (appName: string = "main-site"): void => {
  if (!isGAEnabled()) return;

  ReactGA.initialize("G-563H76S9WB", {
    gaOptions: {
      siteSpeedSampleRate: 100,
      cookieDomain: "auto",
    },
  });

  ReactGA.set({
    app_name: appName,
  });
};

// Funkcja do śledzenia odsłon stron
export const trackPageView = (path: string): void => {
  if (!isGAEnabled()) return;
  ReactGA.send({ hitType: "pageview", page: path });
};

// Funkcja do śledzenia zdarzeń
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
): void => {
  if (!isGAEnabled()) return;
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};
