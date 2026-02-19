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
} from "react-icons/fi";

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Mock featured products - Replace with actual API call
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      description: "High-quality cotton fabric with comfortable fit",
      price: "$25.99",
      category: "T-Shirts",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      description: "Durable denim with modern styling",
      price: "$89.99",
      category: "Jackets",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Formal Business Shirt",
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
      description: "Professional attire for business meetings",
      price: "$45.99",
      category: "Shirts",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Casual Polo Shirt",
      image:
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
      description: "Comfortable casual wear for everyday use",
      price: "$32.99",
      category: "Polo",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Sports Jersey",
      image:
        "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=400",
      description: "Breathable fabric for athletic performance",
      price: "$39.99",
      category: "Sports",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Winter Hoodie",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
      description: "Warm and cozy for cold weather",
      price: "$54.99",
      category: "Hoodies",
      rating: 4.9,
    },
  ];

  // How it works steps
  const steps = [
    {
      step: "01",
      title: "Browse Products",
      description: "Explore our wide range of high-quality garment products",
      icon: <FiPackage />,
      color: "blue",
    },
    {
      step: "02",
      title: "Place Order",
      description: "Select your items and place your order with ease",
      icon: <FiShoppingCart />,
      color: "green",
    },
    {
      step: "03",
      title: "Track Production",
      description: "Monitor your order status in real-time",
      icon: <FiTrendingUp />,
      color: "purple",
    },
    {
      step: "04",
      title: "Receive Product",
      description: "Get your quality products delivered on time",
      icon: <FiCheckCircle />,
      color: "yellow",
    },
  ];

  // Customer testimonials
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Retailer",
      image: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      comment:
        "GarmentTrack has revolutionized how we manage our production. The tracking system is incredibly intuitive and has saved us countless hours!",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Boutique Owner",
      image: "https://i.pravatar.cc/150?img=2",
      rating: 5,
      comment:
        "Outstanding quality and service! The platform makes it so easy to keep track of all our orders. Highly recommended for anyone in the garment business.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Online Store Manager",
      image: "https://i.pravatar.cc/150?img=3",
      rating: 5,
      comment:
        "The best investment we've made for our business. Real-time tracking and excellent customer support make all the difference.",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Stats
  const stats = [
    { number: "10K+", label: "Happy Customers", icon: <FiUsers /> },
    { number: "50K+", label: "Products Delivered", icon: <FiPackage /> },
    { number: "98%", label: "Satisfaction Rate", icon: <FiAward /> },
    { number: "24/7", label: "Support Available", icon: <FiClock /> },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            Welcome to
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent mt-2">
              GarmentTrack
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Your complete solution for managing garment production and orders.
            Track, manage, and deliver with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/all-products"
              className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span>Browse Products</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/register"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
            >
              Get Started Free
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <FiShield className="w-5 h-5" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-5 h-5" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-5 h-5" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explore our premium collection of high-quality garments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {product.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      ({product.rating})
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {product.price}
                    </span>

                    <Link
                      to={`/product/${product.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/all-products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>View All Products</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Simple steps to get started with GarmentTrack
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connecting Line (except last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 -z-10"></div>
                )}

                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div
                      className={`w-32 h-32 bg-gradient-to-br ${
                        step.color === "blue"
                          ? "from-blue-400 to-blue-600"
                          : step.color === "green"
                            ? "from-green-400 to-green-600"
                            : step.color === "purple"
                              ? "from-purple-400 to-purple-600"
                              : "from-yellow-400 to-yellow-600"
                      } rounded-full flex items-center justify-center text-white text-4xl shadow-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-white shadow-lg">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real feedback from real customers
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 relative">
              {/* Quote Icon */}
              <div className="absolute top-8 left-8 text-blue-600 opacity-20">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex flex-col items-center text-center mb-8">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-20 h-20 rounded-full border-4 border-blue-600 mb-4"
                  />

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonials[activeTestimonial].rating)].map(
                      (_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-yellow-400"
                        />
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
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeTestimonial
                          ? "bg-blue-600 w-8"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and streamline your garment
            production today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Create Free Account
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CSS for animations */}
      {/* <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style> */}
    </div>
  );
};

export default Home;
