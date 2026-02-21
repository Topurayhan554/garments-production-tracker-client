import React from "react";
import { motion } from "framer-motion";
import { stats } from "../../../../data/data";

const Stats = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
  return (
    <>
      {/* Stats Section with Counter Animation */}
      <section className="py-16 bg-white dark:bg-gray-800 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, delay: index * 0.2 }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4"
                >
                  {stat.icon}
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Stats;
