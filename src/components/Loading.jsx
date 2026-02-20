import React from "react";

// ---------------- PulsingText ----------------
export const PulsingText = ({
  text = "Loading...",
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
    <p
      className={`${sizeClasses[size]} ${colorClasses[color]} font-medium animate-pulse`}
    >
      {text}
    </p>
  );
};

// ---------------- Loading Spinner ----------------
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-20">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

// ---------------- Skeleton Table ----------------
export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {[1, 2, 3, 4].map((i) => (
                <th key={i} className="py-3 px-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-100 dark:border-gray-700"
              >
                {[1, 2, 3, 4].map((colIndex) => (
                  <td key={colIndex} className="py-3 px-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loading;
