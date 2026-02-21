import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { testimonials } from "../../../../data/data";
import { FiStar } from "react-icons/fi";

const Testimonal = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/* Customer Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real feedback from real customers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full filter blur-3xl"></div>

              {/* Quote Icon */}
              <div className="absolute top-8 left-8 text-blue-600 opacity-10">
                <svg
                  className="w-20 h-20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>
              </div>

              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <div className="flex flex-col items-center text-center mb-8">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-24 h-24 rounded-full border-4 border-blue-600 mb-4 shadow-xl"
                  />

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonials[activeTestimonial].rating)].map(
                      (_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <FiStar className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      ),
                    )}
                  </div>

                  <p className="text-xl text-gray-700 dark:text-gray-300 italic mb-6">
                    "{testimonials[activeTestimonial].comment}"
                  </p>

                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>

                {/* Dots Navigation */}
                <div className="flex justify-center gap-2">
                  {testimonials.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`rounded-full transition-all duration-300 ${
                        index === activeTestimonial
                          ? "bg-blue-600 w-8 h-3"
                          : "bg-gray-300 dark:bg-gray-600 w-3 h-3"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Testimonal;
