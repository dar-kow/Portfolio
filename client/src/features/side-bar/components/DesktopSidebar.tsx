import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import SidebarNavLink from "../components/SidebarNavLink";
import { menuItems, contactMessages, socialLinks, LocalizedLabel } from "../data";
import { articles } from "@/features/articles/data";
import { projects } from "@/features/projects/data";
import { extractRepoInfo, fetchLastCommitDateWithCache, isRecentCommit } from "@/shared/services/github-api";

type Lang = keyof LocalizedLabel;

interface DesktopSidebarProps {
    location: string;
    setIsContactOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleLang: () => void;
    lang: Lang;
}

function DesktopSidebar({ location, setIsContactOpen, toggleLang, lang }: DesktopSidebarProps): JSX.Element {
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

        menuItems.forEach(item => {
            if (item.subMenu && location.startsWith(item.path)) {
                setExpandedMenu(item.path);
            }
        });
    }, [location]);

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
                                <div className="relative">
                                    <SidebarNavLink
                                        href={item.path}
                                        onClick={() => { }}
                                        icon={item.icon}
                                        label={item.label[lang]}
                                        className={`sidebar-nav-link ${location === item.path ? "sidebar-nav-link-active" : "sidebar-nav-link-inactive"}`}
                                    />

                                    {/* Display notification bubble for articles menu if there are new articles */}
                                    {item.path === "/articles" && hasNewArticles && (
                                        <span className="absolute right-0 top-0 transform translate-x-1 -translate-y-1 flex h-5 px-1.5 items-center justify-center text-xs font-bold rounded bg-[#22b455] text-[var(--matrix-bg)]">
                                            {lang === "en" ? "NEW" : "NOWY"}
                                        </span>
                                    )}

                                    {/* Display notification bubble for projects menu if there are recent updates */}
                                    {item.path === "/projects" && hasNewProjects && (
                                        <span className="absolute right-0 top-0 transform translate-x-1 -translate-y-1 flex h-5 px-1.5 items-center justify-center text-xs font-bold rounded bg-[#22b455] text-[var(--matrix-bg)]">
                                            {lang === "en" ? "UPD" : "UPD"}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Podmenu */}
                            <AnimatePresence>
                                {item.subMenu && expandedMenu === item.path && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0, y: 10 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="ml-5 overflow-hidden"
                                    >
                                        {item.subMenu.map((subItem) => (
                                            <Link
                                                key={subItem.path}
                                                href={subItem.path}
                                            >
                                                <a className={`sidebar-nav-link text-sm py-1.5 ${location === subItem.path ? 'sidebar-nav-link-active' : 'sidebar-nav-link-inactive'}`}>
                                                    <span className="ml-2">{subItem.label[lang]}</span>
                                                </a>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>

                <div className="mb-4 flex justify-center">
                    <button
                        onClick={toggleLang}
                        className="lang-toggle-button border border-[var(--matrix-primary)] rounded px-3 py-1 text-sm text-[var(--matrix-primary)] bg-[var(--matrix-bg)] hover:bg-[var(--matrix-dark)] hover:text-[var(--matrix-hover)] transition-colors"
                    >
                        {lang === 'pl' ? 'EN' : 'PL'}
                    </button>
                </div>

                <div className="mb-4">
                    <button onClick={() => setIsContactOpen(true)} className="sidebar-desktop-kontakt">
                        {contactMessages.contactButton[lang]}
                    </button>
                </div>

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