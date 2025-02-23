import { Link } from "wouter";
import { motion } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Menu, X } from "lucide-react";
import { Mail } from "lucide-react";
import { menuItems, contactMessages, socialLinks } from "../data";
import { useLanguage } from "../../../shared/components/common/LanguageContext";
import React from "react";

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isContactOpen: boolean;
    setIsContactOpen: React.Dispatch<React.SetStateAction<boolean>>;
    showMobileMenu: boolean;
}

function MobileMenu({
    isOpen,
    setIsOpen,
    isContactOpen,
    setIsContactOpen,
    showMobileMenu,
}: MobileMenuProps): JSX.Element {
    const { lang, toggleLang } = useLanguage();

    return (
        <>
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: showMobileMenu ? 0 : -100 }}
                transition={{ duration: 0.3 }}
                className="sidebar-mobile-icons mobile-menu md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 z-50"
            >
                {/* Lewy kontener z hamburgerem */}
                <div className="hamburger-container">
                    <button onClick={() => setIsOpen(!isOpen)} className="sidebar-hamburger">
                        {isOpen ? (
                            <X className="w-6 h-6 text-[var(--matrix-hover)]" />
                        ) : (
                            <Menu className="w-6 h-6 text-[var(--matrix-hover)]" />
                        )}
                    </button>
                </div>
                {/* Prawy kontener z ikonami oraz przyciskiem zmiany języka */}
                <div className="right-icons flex items-center space-x-4">
                    <button onClick={() => setIsContactOpen(true)} className="sidebar-mobile-button">
                        <Mail className="w-5 h-5" />
                        <span className="hidden sm:inline">{contactMessages.contactButton[lang]}</span>
                    </button>
                    <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sidebar-mobile-icon-button"
                    >
                        <SiGithub className="w-6 h-6" />
                    </a>
                    <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sidebar-mobile-icon-button"
                    >
                        <SiLinkedin className="w-6 h-6" />
                    </a>
                    {/* Możesz usunąć przycisk zmiany języka z tego kontenera,
              jeśli chcesz, aby był wyświetlany tylko jako fixed component */}
                </div>
            </motion.div>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mobile-menu-modal"
                >
                    <div className="mobile-menu-modal-overlay" onClick={() => setIsOpen(false)} />
                    <motion.div className="mobile-menu-modal-content" initial={{ y: -30 }} animate={{ y: 0 }}>
                        <nav className="space-y-4">
                            {menuItems.map((item) => (
                                <Link key={item.path} href={item.path}>
                                    <a
                                        className={`sidebar-nav-link ${window.location.pathname === item.path ? "sidebar-nav-link-active" : "sidebar-nav-link-inactive"
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.icon}
                                        <span>{item.label[lang]}</span>
                                    </a>
                                </Link>
                            ))}
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsContactOpen(true);
                                }}
                                className="sidebar-nav-link-contact"
                            >
                                <Mail className="w-5 h-5" />
                                <span>{contactMessages.contactButton[lang]}</span>
                            </button>
                        </nav>
                    </motion.div>
                </motion.div>
            )}

            {/* Fixed Mobile Language Toggle Button */}
            <div className="md:hidden">
                <button
                    onClick={toggleLang}
                    className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full text-sm font-medium bg-[var(--matrix-bg)] border-2 border-[var(--matrix-primary)] text-[var(--matrix-primary)] hover:bg-[var(--matrix-dark)] hover:text-[var(--matrix-hover)] transition-colors shadow-lg"
                >
                    {lang.toUpperCase()}
                </button>
            </div>
        </>
    );
}

export default MobileMenu;