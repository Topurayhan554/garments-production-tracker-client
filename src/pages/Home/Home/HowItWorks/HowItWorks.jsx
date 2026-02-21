import React from "react";
import { motion } from "framer-motion";
import { steps } from "../../../../data/data";

const HowItWorks = () => {
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
    <div>
      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Simple steps to get started with GarmentTrack
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 -z-10">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                )}

                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative inline-block mb-6"
                  >
                    <div
                      className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-4xl shadow-xl`}
                    >
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-white shadow-lg border-4 border-blue-600">
                      {step.step}
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
