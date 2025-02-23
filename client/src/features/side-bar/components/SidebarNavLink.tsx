import React from "react";
import { Link } from "wouter";

type SidebarNavLinkProps = {
    href: string;
    className: string;
    onClick?: () => void;
    icon: React.ReactNode;
    label: string;
};

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
    href,
    className,
    onClick,
    icon,
    label,
}) => (
    <Link href={href}>
        <div className={className} onClick={onClick}>
            {icon}
            <span>{label}</span>
        </div>
    </Link>
);

export default SidebarNavLink;
