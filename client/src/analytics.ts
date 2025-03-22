import ReactGA from 'react-ga4';

// Funkcja inicjalizująca Google Analytics
export const initializeGA = (appName: string = 'main-site'): void => {
    // Inicjalizujemy GA tylko w środowisku produkcyjnym lub jeśli uruchomiono lokalne testowanie GA
    if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_GA_DEV === 'true') {
        ReactGA.initialize('G-563H76S9WB', {
            gaOptions: {
                siteSpeedSampleRate: 100,
                cookieDomain: 'auto'
            }
        });

        // Ustawienie parametru app_name dla wszystkich zdarzeń
        ReactGA.set({
            app_name: appName
        });

        console.log(`Google Analytics initialized for app: ${appName}`);
    } else {
        console.log('Google Analytics not initialized in development mode');
    }
};

// Funkcja do śledzenia odsłon stron
export const trackPageView = (path: string): void => {
    if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_GA_DEV === 'true') {
        ReactGA.send({ hitType: 'pageview', page: path });
        console.log(`Page view tracked: ${path}`);
    }
};

// Funkcja do śledzenia zdarzeń
export const trackEvent = (
    category: string,
    action: string,
    label?: string,
    value?: number
): void => {
    if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_GA_DEV === 'true') {
        ReactGA.event({
            category,
            action,
            label,
            value
        });
        console.log(`Event tracked: ${category} - ${action}`);
    }
};