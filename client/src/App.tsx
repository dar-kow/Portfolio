import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/shared/components/ui/toaster";
import { LanguageProvider } from "@/shared/components/common/LanguageContext";
import Sidebar from "@/features/side-bar/Sidebar";
import NotFound from "@/pages/not-found";
import Home from "@/features/home/Home";
import Articles from "@/features/articles/Articles";
import Projects from "@/features/projects/Projects";
import Skills from "@/features/skills/Skills";
import ArticlePage from "@/features/articles/ArticlePage";
import References from "@/features/references/References";
import HowIDoItPage from "./features/how-i-do-it/HowIDoItPage";
import { initializeGA, trackPageView } from "./analytics";

import { useEffect } from "react";


const PageTracker: React.FC = () => {
  // useLocation z wouter zwraca [location, navigate]
  const [location] = useLocation();

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return null;
};

function Router() {
  return (
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
  );
}

function App() {
  useEffect(() => {
    // Zainicjuj Google Analytics
    initializeGA('portfolio');
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <PageTracker />
        <Sidebar />
        <Router />
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
