import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import MobileMenu from "./components/MobileMenu";
import DesktopSidebar from "./components/DesktopSidebar";
import ContactModal from "../contact/ContactModal";
import { useLanguage } from "../../shared/components/common/LanguageContext";

const Sidebar = () => {
  const { lang, toggleLang } = useLanguage();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const threshold = 100;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY - lastScrollY > threshold) {
            setShowMobileMenu(false);
            lastScrollY = currentScrollY;
          } else if (lastScrollY - currentScrollY > threshold) {
            setShowMobileMenu(true);
            lastScrollY = currentScrollY;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isContactOpen={isContactOpen}
        setIsContactOpen={setIsContactOpen}
        showMobileMenu={showMobileMenu}
      />

      <DesktopSidebar
        location={location}
        setIsContactOpen={setIsContactOpen}
        toggleLang={toggleLang}
        lang={lang}
      />

      {isContactOpen && <ContactModal onClose={() => setIsContactOpen(false)} />}
    </>
  );
};

export default Sidebar;