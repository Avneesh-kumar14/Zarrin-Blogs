import { FaFeatherAlt } from "react-icons/fa";

export default function ZarrinLogo({
  variant = "light", // light | soft | dark
  size = "md",       // sm | md | lg
}) {
  const sizeMap = {
    sm: {
      icon: 14,
      text: "text-sm",
      box: "p-1.5",
    },
    md: {
      icon: 18,
      text: "text-xl",
      box: "p-2.5",
    },
    lg: {
      icon: 24,
      text: "text-3xl",
      box: "p-3",
    },
  };

  const styles = {
    light: {
      wrapper: "text-black",
      box: "bg-black text-white",
      blogText: "text-gray-500",
    },
    soft: {
      wrapper: "bg-gray-100 px-4 py-2 rounded-xl sm:px-6 sm:py-3",
      box: "bg-black text-white",
      blogText: "text-gray-500",
    },
    dark: {
      wrapper: "bg-[#1a1a1a] px-4 py-2 rounded-xl sm:px-6 sm:py-3",
      box: "bg-gray-800 text-white",
      blogText: "text-gray-300",
    },
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${styles[variant].wrapper}`}>
      <div
        className={`${styles[variant].box} rounded-lg sm:rounded-xl flex items-center justify-center`}
      >
        <FaFeatherAlt size={sizeMap[size].icon} />
      </div>

      <h1 className={`font-bold tracking-tight ${sizeMap[size].text}`}>
        <span>Zarrin</span>
        <span className={`ml-1 ${styles[variant].blogText}`}>Blogs</span>
      </h1>
    </div>
  );
}
