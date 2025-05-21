import ReactGA from "react-ga4";

// Function to initialize Google Analytics
export const initializeGA = (appName: string = "main-site"): void => {
  const gaId = import.meta.env.VITE_GA_ID;
  if (
    !gaId ||
    gaId === "" ||
    gaId === "GA_MEASUREMENT_ID" // also skip if left as placeholder
  ) {
    // Optionally log a warning in development
    if (import.meta.env.MODE !== "production") {
      console.warn("Google Analytics not initialized: VITE_GA_ID is missing.");
    }
    return;
  }

  // Initialize GA only in production or if local GA testing is enabled
  if (import.meta.env.MODE === "production" || import.meta.env.VITE_ENABLE_GA_DEV === "true") {
    ReactGA.initialize(gaId, {
      gaOptions: {
        siteSpeedSampleRate: 100,
        cookieDomain: "auto",
      },
    });

    // Set app_name parameter for all events
    ReactGA.set({
      app_name: appName,
    });

    // console.log(`Google Analytics initialized for app: ${appName}`);
  } else {
    // console.log('Google Analytics not initialized in development mode');
  }
};

// Function to track page views
export const trackPageView = (path: string): void => {
  if (import.meta.env.MODE === "production" || import.meta.env.VITE_ENABLE_GA_DEV === "true") {
    ReactGA.send({ hitType: "pageview", page: path });
    // console.log(`Page view tracked: ${path}`);
  }
};

// Function to track events
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
