
import React, { useState, useEffect } from "react";
import Headings from "../Common/Heading";
import { Link } from "react-router-dom";
import Button from "../Common/Button";

const SideBar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { label: "Dashboard", route: "analytics" },
    { label: "My Blogs", route: "myblogs" },
    { label: "Categories", route: "categories" }
  ];

  return (
    <>
      {/* Sidebar - Slides from left, disappears on scroll with overlay */}
      <aside
        className={`bg-primary text-tertiary w-64 h-[calc(100vh-64px)] flex flex-col p-6 fixed lg:static top-16 left-0 z-30 transform transition-transform duration-300 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:top-auto lg:h-auto lg:relative`}
      >
        <Headings type="h4" className="font-bold mb-10">
          Menu
        </Headings>

        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.route}
              to={`/dashboard/${item.route}`}
              className="block font-medium hover:text-secondary transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-primary/80"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay - Click to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-20 top-16"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideBar;
