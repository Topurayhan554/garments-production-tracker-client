import React from "react";

// ============================================
// LOADING TEXT WITH ELLIPSIS - Classic style
// ============================================

export const ButtonLoader = ({
  text = "Loading",
  size = "md",
  color = "gray",
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const colorClasses = {
    gray: "text-gray-600 dark:text-gray-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    green: "text-green-600 dark:text-green-400",
  };

  return (
    <div
      className={`inline-flex items-baseline ${sizeClasses[size]} ${colorClasses[color]} font-medium`}
    >
      <span>{text}</span>
      <span className="inline-flex ml-1">
        <span className="animate-pulse">.</span>
        <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>
          .
        </span>
        <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>
          .
        </span>
      </span>
    </div>
  );
};

export default ButtonLoader;
