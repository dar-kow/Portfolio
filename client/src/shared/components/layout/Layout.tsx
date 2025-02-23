import React from "react";
import Sidebar from "../../../features/side-bar/Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="layout-container flex min-h-screen bg-[var(--matrix-bg)] text-[var(--matrix-light)]">
            <Sidebar />
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
};

export default Layout;