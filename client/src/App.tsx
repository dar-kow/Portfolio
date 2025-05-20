import React, { Suspense, lazy, useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/shared/components/ui/toaster";
import { LanguageProvider } from "@/shared/components/common/LanguageContext";
import { BackgroundProvider } from "@/shared/components/common/BackgroundContext";
import Sidebar from "@/features/side-bar/Sidebar";
import MatrixLoader from "@/shared/components/common/MatrixLoader"; // Matrix-style loading component
import { initializeGA, trackPageView } from "./analytics";

// Lazy loading of components - loaded only when needed
const Home = lazy(() => import("@/features/home/Home"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Articles = lazy(() => import("@/features/articles/Articles"));
const ArticlePage = lazy(() => import("@/features/articles/ArticlePage"));
const Projects = lazy(() => import("@/features/projects/Projects"));
const Skills = lazy(() => import("@/features/skills/Skills"));
const References = lazy(() => import("@/features/references/References"));
const HowIDoItPage = lazy(() => import("./features/how-i-do-it/HowIDoItPage"));

// Component tracking page changes
const PageTracker: React.FC = () => {
  const [location] = useLocation();

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return null;
};

// Router component with Suspense support - shows loader while loading components
function Router() {
  return (
    <Suspense fallback={<MatrixLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/articles" component={Articles} />
        <Route path="/articles/:slug" component={ArticlePage} />
        <Route path="/projects" component={Projects} />
        <Route path="/skills" component={Skills} />
        <Route path="/references" component={References} />
        <Route path="/how-i-do-it/:page*" component={HowIDoItPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Initialize Google Analytics
    initializeGA('portfolio');

    // Simulate a short delay to show the loading animation
    const timer = setTimeout(() => setAppReady(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BackgroundProvider>
          {!appReady ? (
            <MatrixLoader />
          ) : (
            <>
              <PageTracker />
              <Sidebar />
              <Router />
              <Toaster />
            </>
          )}
        </BackgroundProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;