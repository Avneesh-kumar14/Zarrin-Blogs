import React from "react";

/**
 * HEADING COMPONENT
 * 
 * Renders semantic heading elements with professional typography.
 * Uses design system typography scale.
 * 
 * Usage:
 *   <Headings type="h1">Title</Headings>
 *   <Headings type="h2" className="custom-class">Subtitle</Headings>
 */

const Heading = {
  h1: "text-h1 font-display font-bold text-text-primary",
  h2: "text-h2 font-display font-bold text-text-primary",
  h3: "text-h3 font-display font-semibold text-text-primary",
  h4: "text-h4 font-display font-semibold text-text-primary",
  h5: "text-h5 font-display font-semibold text-text-primary",
  h6: "text-h6 font-display font-semibold text-text-primary",
};

export default function Headings({ type = "h1", className = "", children, id = null }) {
  const Tag = type;

  return (
    <Tag 
      id={id}
      className={`${Heading[type] || ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
