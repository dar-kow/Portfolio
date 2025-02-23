import { motion } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
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
                        <SidebarNavLink
                            key={item.path}
                            href={item.path}
                            onClick={() => { }}
                            icon={item.icon}
                            label={item.label[lang]}
                            className={`sidebar-nav-link ${location === item.path ? "sidebar-nav-link-active" : "sidebar-nav-link-inactive"}`}
                        />
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