import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FiArrowRight,
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiCheckCircle,
  FiStar,
  FiUsers,
  FiAward,
  FiClock,
  FiShield,
  FiZap,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { ProductCard } from "../../Product/AllProducts/AllProducts";
import { bannerImages } from "../../../data/data";
import Testimonal from "./Testimonal/Testimonials";
import HowItWorks from "./HowItWorks/HowItWorks";
import Stats from "./Stats/Stats";
import Hero from "./Hero/Hero";

const Home = () => {
  const [activeBannerImage, setActiveBannerImage] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // console.log("featured products", featuredProducts);

  // Fetch products from database (max 6)
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axiosSecure.get("/products");

        // Ensure response.data is array
        const products = Array.isArray(response.data)
          ? response.data.slice(0, 6)
          : [];

        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load featured products");
        setFeaturedProducts([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [axiosSecure]);

  // Auto-rotate banner images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBannerImage((prev) => (prev + 1) % bannerImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Stats
  const stats = [
    { number: "10K+", label: "Happy Customers", icon: <FiUsers /> },
    { number: "50K+", label: "Products Delivered", icon: <FiPackage /> },
    { number: "98%", label: "Satisfaction Rate", icon: <FiAward /> },
    { number: "24/7", label: "Support Available", icon: <FiClock /> },
  ];

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
    <div className="bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-1 bg-gradient-to-br from-blue-400 via-purple-200 to-pink-200 animate-gradient-xy"></div>

        {/* Featured Image Carousel */}
        <div className="absolute inset-0">
          {bannerImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === activeBannerImage ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover opacity-40"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
            </motion.div>
          ))}
        </div>

        {/* Animated Blobs */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"
          ></motion.div>
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl"
          ></motion.div>
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl"
          ></motion.div>
        </div>

        {/* Floating Products Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                y: [100, -100],
                x: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                delay: i * 2,
              }}
              className="absolute"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
            >
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FiPackage className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <Hero />

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section with Counter Animation */}
      <Stats />

      {/* Featured Products Section - DB Integration */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explore our premium collection of high-quality garments
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                >
                  <ProductCard product={product} viewMode="grid" />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/all-products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>View All Products</span>
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* how is works section */}
      <HowItWorks />

      {/* testimonials */}
      <Testimonal />

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and streamline your garment
            production today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Create Free Account
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
