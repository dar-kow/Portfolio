import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Menu, X, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { menuItems, contactMessages, socialLinks } from "../data";
import { useLanguage } from "../../../shared/components/common/LanguageContext";
import React, { useState, useEffect } from "react";
import { articles } from "@/features/articles/data";
import { projects } from "@/features/projects/data";
import { extractRepoInfo, fetchLastCommitDateWithCache, isRecentCommit } from "@/shared/services/github-api";

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
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const [hasNewArticles, setHasNewArticles] = useState(false);
    const [hasNewProjects, setHasNewProjects] = useState(false);

    useEffect(() => {
        // Check if any articles are less than 7 days old
        const currentDate = new Date();
        const hasNew = articles.some(article => {
            const articleDate = new Date(article.date);
            const diffTime = Math.abs(currentDate.getTime() - articleDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
        });

        setHasNewArticles(hasNew);
    }, []);

    useEffect(() => {
        // Check if any projects have recent commits (< 7 days)
        const checkProjectUpdates = async () => {
            for (const project of projects) {
                if (!project.link || project.link.trim() === '') continue;

                const repoInfo = extractRepoInfo(project.link);
                if (!repoInfo) continue;

                try {
                    const lastCommitDate = await fetchLastCommitDateWithCache(repoInfo.owner, repoInfo.repo);
                    if (lastCommitDate && isRecentCommit(lastCommitDate)) {
                        setHasNewProjects(true);
                        return;
                    }
                } catch (error) {
                    console.error(`Error checking commit date for ${project.title.en}:`, error);
                }
            }
        };

        checkProjectUpdates();
    }, []);

    const toggleSubMenu = (path: string, e: React.MouseEvent) => {
        e.preventDefault();
        setExpandedMenu(expandedMenu === path ? null : path);
    };

    return (
        <>
            {/* Pasek nawigacyjny mobilny - zawsze widoczny z odpowiednim z-index */}
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: showMobileMenu ? 0 : -100 }}
                transition={{ duration: 0.3 }}
                className="sidebar-mobile-icons mobile-menu md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 z-50"
            >
                {/* Lewy kontener z hamburgerem - z odpowiednim z-index */}
                <div className="hamburger-container relative z-[60]">
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
                </div>
            </motion.div>

            {/* Menu mobilne - warstwa poniżej hamburgerka */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mobile-menu-modal"
                        style={{ zIndex: 55 }}
                    >
                        <div className="mobile-menu-modal-overlay" onClick={() => setIsOpen(false)} />
                        {/* TO DO pobawić się z miejscem pojawiania się menu */}
                        <motion.div className="mobile-menu-modal-content w-[250px] max-w-[300px]" initial={{ x: 35, y: -35 }} animate={{ y: 0 }}>
                            <nav className="space-y-4">
                                {menuItems.map((item) => (
                                    <div key={item.path} className="flex flex-col">
                                        {item.subMenu ? (
                                            // Pozycja z podmenu
                                            <a
                                                href="#"
                                                className={`sidebar-nav-link ${window.location.pathname.startsWith(item.path) ? "sidebar-nav-link-active" : "sidebar-nav-link-inactive"}`}
                                                onClick={(e) => toggleSubMenu(item.path, e)}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        {item.icon}
                                                        <span className="ml-2">{item.label[lang]}</span>

                                                        {/* New articles notification */}
                                                        {item.path === "/articles" && hasNewArticles && (
                                                            <span className="ml-2 flex h-5 px-1.5 items-center justify-center text-xs font-bold rounded bg-[#22b455] text-[var(--matrix-bg)]">
                                                                {lang === "en" ? "NEW" : "NOWY"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {expandedMenu === item.path ?
                                                        <ChevronUp className="w-4 h-4" /> :
                                                        <ChevronDown className="w-4 h-4" />
                                                    }
                                                </div>
                                            </a>
                                        ) : (
                                            // Zwykła pozycja menu
                                            <Link href={item.path}>
                                                <a
                                                    className={`sidebar-nav-link ${window.location.pathname === item.path ? "sidebar-nav-link-active" : "sidebar-nav-link-inactive"}`}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <div className="flex items-center">
                                                        {item.icon}
                                                        <span className="ml-2">{item.label[lang]}</span>

                                                        {/* New articles notification */}
                                                        {item.path === "/articles" && hasNewArticles && (
                                                            <span className="ml-2 flex h-5 px-1.5 items-center justify-center text-xs font-bold rounded bg-[#22b455] text-[var(--matrix-bg)]">
                                                                {lang === "en" ? "NEW" : "NOWY"}
                                                            </span>
                                                        )}

                                                        {/* New projects notification */}
                                                        {item.path === "/projects" && hasNewProjects && (
                                                            <span className="ml-2 flex h-5 px-1.5 items-center justify-center text-xs font-bold rounded bg-[#22b455] text-[var(--matrix-bg)]">
                                                                {lang === "en" ? "UPD" : "UPD"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </a>
                                            </Link>
                                        )}

                                        {/* Podmenu */}
                                        <AnimatePresence>
                                            {item.subMenu && expandedMenu === item.path && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="ml-6 mt-1 overflow-hidden"
                                                >
                                                    {item.subMenu.map((subItem) => (
                                                        <Link key={subItem.path} href={subItem.path}>
                                                            <a
                                                                className={`sidebar-nav-link text-sm py-1.5 pl-2 ${window.location.pathname === subItem.path ? 'sidebar-nav-link-active' : 'sidebar-nav-link-inactive'}`}
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                <span>{subItem.label[lang]}</span>
                                                            </a>
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fixed Mobile Language Toggle Button - zachowany bez zmian */}
            <div className="md:hidden">
                <button
                    onClick={toggleLang}
                    className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full text-sm font-medium bg-[var(--matrix-bg)] border-2 border-[var(--matrix-primary)] text-[var(--matrix-primary)] hover:bg-[var(--matrix-dark)] hover:text-[var(--matrix-hover)] transition-colors shadow-lg"
                >
                    {lang === 'pl' ? 'EN' : 'PL'}
                </button>
            </div>
        </>
    );
}

export default MobileMenu;