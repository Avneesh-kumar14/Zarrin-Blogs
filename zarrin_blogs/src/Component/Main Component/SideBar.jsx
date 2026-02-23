
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Tags,
  PenLine,
  User,
  LogOut
} from "lucide-react";
import Headings from "../Common/Heading";

const SideBar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", route: "analytics", icon: LayoutDashboard },
    { label: "My Blogs", route: "myblogs", icon: FileText },
    { label: "Categories", route: "categories", icon: Tags },
    { label: "My Drafts", route: "drafts", icon: PenLine },
    { label: "My Profile", route: "profile", icon: User }
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-16 left-0 z-30 h-[calc(100vh-64px)] w-64
        bg-surface-primary dark:bg-surface-dark border-r border-border-light dark:border-border-dark
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full px-4 py-6">

          {/* Title with Icon */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary rounded-lg">
              <LayoutDashboard size={20} className="text-on-primary" />
            </div>
            <Headings
              type="h4"
              className="text-sm font-bold text-primary uppercase tracking-wide"
            >
              Dashboard
            </Headings>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map(({ label, route, icon: Icon }) => {
              const isActive = location.pathname.includes(route);

              return (
                <Link
                  key={route}
                  to={`/dashboard/${route}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-primary text-on-primary shadow-md"
                        : "text-text-primary dark:text-text-secondary hover:bg-primary/10 dark:hover:bg-primary/20"
                    }`}
                >
                  <Icon size={18} className={isActive ? "" : "group-hover:text-primary"} />
                  {label}
                  {isActive && <div className="ml-auto w-1 h-6 bg-on-primary rounded-full"></div>}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="pt-4 border-t border-border-light dark:border-border-dark">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
              text-sm font-semibold text-error hover:bg-error/10 dark:hover:bg-error/20
              transition-all duration-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-20 top-16 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;
