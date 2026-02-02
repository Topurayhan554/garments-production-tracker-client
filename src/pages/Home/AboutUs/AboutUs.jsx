import React from "react";
import { Link } from "react-router";
import {
  FiTarget,
  FiEye,
  FiAward,
  FiUsers,
  FiHeart,
  FiShield,
  FiTrendingUp,
  FiGlobe,
  FiCheckCircle,
} from "react-icons/fi";

const AboutUs = () => {
  // Company statistics
  const stats = [
    { number: "10+", label: "Years Experience", icon: <FiAward /> },
    { number: "500+", label: "Happy Clients", icon: <FiUsers /> },
    { number: "10K+", label: "Products Delivered", icon: <FiCheckCircle /> },
    { number: "98%", label: "Satisfaction Rate", icon: <FiHeart /> },
  ];

  // Core values
  const values = [
    {
      icon: <FiShield />,
      title: "Quality First",
      description:
        "We never compromise on quality. Every product meets the highest standards of excellence.",
      color: "blue",
    },
    {
      icon: <FiHeart />,
      title: "Customer Focus",
      description:
        "Your satisfaction is our priority. We build lasting relationships with our clients.",
      color: "red",
    },
    {
      icon: <FiTrendingUp />,
      title: "Innovation",
      description:
        "We embrace new technologies and methods to stay ahead in the garment industry.",
      color: "green",
    },
    {
      icon: <FiGlobe />,
      title: "Sustainability",
      description:
        "Committed to eco-friendly practices and sustainable production methods.",
      color: "purple",
    },
  ];

  // Team members
  const team = [
    {
      name: "John Anderson",
      role: "CEO & Founder",
      image: "https://i.pravatar.cc/300?img=12",
      bio: "15+ years in garment industry",
    },
    {
      name: "Sarah Johnson",
      role: "Head of Operations",
      image: "https://i.pravatar.cc/300?img=1",
      bio: "Expert in production management",
    },
    {
      name: "Michael Chen",
      role: "Quality Assurance",
      image: "https://i.pravatar.cc/300?img=13",
      bio: "Ensuring excellence in every product",
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Relations",
      image: "https://i.pravatar.cc/300?img=5",
      bio: "Building strong client partnerships",
    },
  ];

  // Milestones
  const milestones = [
    {
      year: "2014",
      title: "Company Founded",
      description: "Started with a vision to revolutionize garment production",
    },
    {
      year: "2016",
      title: "First Major Contract",
      description: "Secured partnership with leading fashion brands",
    },
    {
      year: "2019",
      title: "Expansion",
      description: "Opened new production facilities and expanded team",
    },
    {
      year: "2022",
      title: "Digital Transformation",
      description: "Launched advanced tracking and management system",
    },
    {
      year: "2024",
      title: "Industry Leader",
      description: "Recognized as top garment production company",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About GarmentTrack
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner in garment production and order management
            since 2014
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"
                  alt="Our factory"
                  className="w-full h-96 object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl -z-10"></div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                Founded in 2014, GarmentTrack began with a simple mission: to
                streamline garment production and make order tracking effortless
                for businesses of all sizes.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                What started as a small operation with just 5 team members has
                grown into a leading platform serving hundreds of clients
                worldwide. We've processed over 10,000 orders and helped
                countless businesses scale their operations.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Today, we continue to innovate and adapt, combining traditional
                craftsmanship with cutting-edge technology to deliver
                exceptional results.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/all-products"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  View Products
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl text-white text-3xl mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </h3>
                <p className="text-blue-100 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-l-4 border-blue-600">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                  <FiTarget className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                To empower businesses with innovative garment production
                solutions, delivering quality products on time while maintaining
                the highest standards of customer service and sustainability.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-l-4 border-purple-600">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
                  <FiEye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Our Vision
                </h2>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                To become the world's most trusted garment production platform,
                known for innovation, quality, and our commitment to creating
                value for our clients and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${
                    value.color === "blue"
                      ? "from-blue-400 to-blue-600"
                      : value.color === "red"
                        ? "from-red-400 to-red-600"
                        : value.color === "green"
                          ? "from-green-400 to-green-600"
                          : "from-purple-400 to-purple-600"
                  } rounded-2xl flex items-center justify-center text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline/Milestones */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Key milestones in our growth story
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600"></div>

            {/* Milestones */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-3">
                        {milestone.year}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Year Badge (Desktop) */}
                  <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                    {index + 1}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The people behind our success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-6 inline-block">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-2xl object-cover shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of satisfied clients and experience the GarmentTrack
            difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
