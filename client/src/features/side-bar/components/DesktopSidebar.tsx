import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { ChevronDown, ChevronUp } from "lucide-react";
import SidebarNavLink from "../components/SidebarNavLink";
import { menuItems, contactMessages, socialLinks, LocalizedLabel } from "../data";

type Lang = keyof LocalizedLabel;

interface DesktopSidebarProps {
    location: string;
    setIsContactOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleLang: () => void;
    lang: Lang;
}

function DesktopSidebar({ location, setIsContactOpen, toggleLang, lang }: DesktopSidebarProps): JSX.Element {
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    const toggleSubMenu = (path: string) => {
        setExpandedMenu(expandedMenu === path ? null : path);
    };

    return (
        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ delay: 2, duration: 0.5, ease: "easeOut" }}
            className="sidebar-desktop"
        >
            <div className="flex flex-col h-full">
                <nav className="space-y-2 flex-grow">
                    {menuItems.map((item) => (
                        <div key={item.path} className="flex flex-col">
                            {/* Główna pozycja menu */}
                            {item.subMenu ? (
                                <div
                                    className={`sidebar-nav-link cursor-pointer ${location.startsWith(item.path) ? "sidebar-nav-link-active" : "sidebar-nav-link-inactive"}`}
                                    onClick={() => toggleSubMenu(item.path)}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            {item.icon}
                                            <span className="ml-3">{item.label[lang]}</span>
                                        </div>
                                        {expandedMenu === item.path ?
                                            <ChevronUp className="w-4 h-4" /> :
                                            <ChevronDown className="w-4 h-4" />
                                        }
                                    </div>
                                </div>
                            ) : (
                                <SidebarNavLink
                                    href={item.path}
                                    onClick={() => { }}
                                    icon={item.icon}
                                    label={item.label[lang]}
                                    className={`sidebar-nav-link ${location === item.path ? "sidebar-nav-link-active" : "sidebar-nav-link-inactive"}`}
                                />
                            )}

                            {/* Podmenu */}
                            <AnimatePresence>
                                {item.subMenu && expandedMenu === item.path && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="ml-5 overflow-hidden"
                                    >
                                        {item.subMenu.map((subItem) => (
                                            <a
                                                key={subItem.path}
                                                href={subItem.path}
                                                className={`sidebar-nav-link text-sm py-1.5 ${location === subItem.path ? 'sidebar-nav-link-active' : 'sidebar-nav-link-inactive'}`}
                                            >
                                                <span className="ml-2">{subItem.label[lang]}</span>
                                            </a>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>

                {/* Language Toggle Button for Desktop */}
                <div className="mb-4 flex justify-center">
                    <button
                        onClick={toggleLang}
                        className="lang-toggle-button border border-[var(--matrix-primary)] rounded px-3 py-1 text-sm text-[var(--matrix-primary)] bg-[var(--matrix-bg)] hover:bg-[var(--matrix-dark)] hover:text-[var(--matrix-hover)] transition-colors"
                    >
                        {lang.toUpperCase()}
                    </button>
                </div>

                {/* Kontakt Button on Desktop */}
                <div className="mb-4">
                    <button onClick={() => setIsContactOpen(true)} className="sidebar-desktop-kontakt">
                        {contactMessages.contactButton[lang]}
                    </button>
                </div>

                {/* Social Icons on Desktop */}
                <div className="sidebar-desktop-social flex justify-center space-x-4">
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="sidebar-mobile-icon-button">
                        <SiGithub className="w-6 h-6" />
                    </a>
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="sidebar-mobile-icon-button">
                        <SiLinkedin className="w-6 h-6" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}

export default DesktopSidebar;