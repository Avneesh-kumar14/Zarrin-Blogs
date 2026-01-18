import React from "react";

const Heading = {
  h1: "text-5xl md:text-6xl font-bold text-primary leading-tight font-font1",
  h2: "text-4xl md:text-5xl font-bold text-primary leading-tight font-font1",
  h3: "text-3xl md:text-4xl font-bold text-primary leading-snug font-font1",
  h4: "text-2xl md:text-3xl font-semibold text-primary leading-snug font-font1",
  h5: "text-xl md:text-2xl font-semibold text-primary leading-tight font-font1",
  h6: "text-lg font-semibold text-primary font-font1",
};

export default function Headings({ type = "h1", className = "", children }) {
  const Tag = type;

  return (
    <Tag className={`${Heading[type] || ""} ${className}`}>
      {children}
    </Tag>
  );
}
