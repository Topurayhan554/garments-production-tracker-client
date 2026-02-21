import React, { useEffect } from "react";
import { Link, useNavigate, useRouteError } from "react-router";
import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiHome,
  FiRefreshCw,
  FiMail,
  FiArrowLeft,
} from "react-icons/fi";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Error | GarmentTrack";
    return () => {
      document.title = "GarmentTrack";
    };
  }, []);

  // Log error to console for debugging
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <FiAlertTriangle className="w-6 h-6 text-red-300 dark:text-red-900" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              delay: 0.2,
            }}
            className="mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-32 h-32 mx-auto bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <FiAlertTriangle className="w-16 h-16 text-white" />
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Oops! Something Went Wrong
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              We encountered an unexpected error. Don't worry, our team has been
              notified and we're working on fixing it!
            </p>
          </motion.div>

          {/* Error Details Card */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 max-w-2xl mx-auto"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
                <FiAlertTriangle className="w-5 h-5 text-red-600" />
                Error Details
              </h3>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 text-left">
                <p className="text-sm font-mono text-gray-800 dark:text-gray-300 mb-2">
                  <span className="font-semibold">Status:</span>{" "}
                  {error.status || "Unknown"}
                </p>
                <p className="text-sm font-mono text-gray-800 dark:text-gray-300 mb-2">
                  <span className="font-semibold">Message:</span>{" "}
                  {error.statusText || error.message || "An error occurred"}
                </p>
                {error.data && (
                  <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-2">
                    {error.data}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Helpful Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              What you can try:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {[
                {
                  icon: <FiRefreshCw />,
                  title: "Refresh the page",
                  desc: "Sometimes a simple refresh fixes everything",
                },
                {
                  icon: <FiHome />,
                  title: "Go to homepage",
                  desc: "Start fresh from our main page",
                },
                {
                  icon: <FiArrowLeft />,
                  title: "Go back",
                  desc: "Return to the previous page",
                },
                {
                  icon: <FiMail />,
                  title: "Contact support",
                  desc: "We're here to help you",
                },
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {tip.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tip.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <FiRefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Refresh Page
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="group px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                Go to Home
              </Link>
            </motion.div>
          </motion.div>

          {/* Support Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-12"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need immediate assistance?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              <FiMail className="w-5 h-5" />
              Contact Support Team
            </Link>
          </motion.div>

          {/* Error ID */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-8 text-sm text-gray-500 dark:text-gray-500"
          >
            <p>
              Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <p className="mt-1 text-xs">
              Please include this ID when contacting support
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;
