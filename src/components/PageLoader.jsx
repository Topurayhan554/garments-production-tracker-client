import React from "react";
import Loading, { PulsingText, SkeletonTable } from "./Loading";

const PageLoader = ({
  text = "Loading page content...",
  rows = 3,
  showSkeleton = true,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Spinner */}
      <Loading size="xl" color="blue" />

      {/* Pulsing Text */}
      <div className="mt-4">
        <PulsingText text={text} color="gray" size="lg" />
      </div>

      {/* Optional Skeleton Table */}
      {showSkeleton && (
        <div className="mt-6 w-full max-w-3xl px-4">
          <SkeletonTable rows={rows} />
        </div>
      )}
    </div>
  );
};

export default PageLoader;
