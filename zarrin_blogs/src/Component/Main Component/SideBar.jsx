
// import React from "react";
// import Headings from "../Common/Heading";
// import { Link } from "react-router-dom";

// const SideBar = ({ isOpen, setIsOpen }) => {
//   const menuItems = [
//     { label: "Dashboard", route: "analytics" },
//     { label: "My Blogs", route: "myblogs" },
//     { label: "Categories", route: "categories" },
//     { label: "My Drafts", route: "drafts" },
//     { label: "My Profile", route: "profile" }
//   ];

//   return (
//     <>
//       {/* Sidebar - Slides from left, disappears on scroll with overlay */}
//       <aside
//         className={`bg-primary text-tertiary w-64 h-[calc(100vh-64px)] flex flex-col p-6 fixed lg:static top-16 left-0 z-30 transform transition-transform duration-300 overflow-y-auto
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:top-auto lg:h-auto lg:relative`}
//       >
//         <Headings type="h4" className="font-bold mb-10">
//           Menu
//         </Headings>

//         <nav className="space-y-4">
//           {menuItems.map((item) => (
//             <Link
//               key={item.route}
//               to={`/dashboard/${item.route}`}
//               className="block font-medium hover:text-secondary transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-primary/80"
//               onClick={() => setIsOpen(false)}
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>
//       </aside>

//       {/* Mobile Overlay - Click to close */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 lg:hidden z-20 top-16"
//           onClick={() => setIsOpen(false)}
//         ></div>
//       )}
//     </>
//   );
// };

// export default SideBar;
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
        bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full px-4 py-6">

          {/* Title */}
          <Headings
            type="h4"
            className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-6"
          >
            Dashboard
          </Headings>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map(({ label, route, icon: Icon }) => {
              const isActive = location.pathname.includes(route);

              return (
                <Link
                  key={route}
                  to={`/dashboard/${route}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg
              text-sm font-medium text-red-600 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20 transition"
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
          className="fixed inset-0 bg-black/40 lg:hidden z-20 top-16"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;
