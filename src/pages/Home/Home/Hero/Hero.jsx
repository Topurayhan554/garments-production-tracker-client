import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { Link } from "react-router";
import { bannerImages } from "../../../../data/data";

const Hero = () => {
  const [activeBannerImage, setActiveBannerImage] = useState(0);

  return (
    <div>
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to
            <motion.span
              className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mt-2"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              GarmentTrack
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto"
        >
          Your complete solution for managing garment production and orders.
          Track, manage, and deliver with confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/all-products"
            className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <FiZap className="w-5 h-5" />
            <span>Browse Products</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/register"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
          >
            Get Started Free
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-white/80"
        >
          {[
            { icon: <FiShield />, text: "Secure Payments" },
            { icon: <FiCheckCircle />, text: "Quality Guaranteed" },
            { icon: <FiClock />, text: "Fast Delivery" },
          ].map((badge, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              {badge.icon}
              <span>{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Banner Image Navigation Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 flex justify-center gap-3"
        >
          {bannerImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveBannerImage(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`rounded-full transition-all duration-300 ${
                index === activeBannerImage
                  ? "bg-white w-8 h-3"
                  : "bg-white/50 w-3 h-3 hover:bg-white/75"
              }`}
            />
          ))}
        </motion.div>

        {/* Banner Image Info */}
        <motion.div
          key={activeBannerImage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-white"
        >
          <h3 className="text-2xl font-bold">
            {bannerImages[activeBannerImage].caption}
          </h3>
          <p className="text-blue-100 mt-2">
            {bannerImages[activeBannerImage].description}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
