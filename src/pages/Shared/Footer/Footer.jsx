import React from "react";
import { Link } from "react-router";
import { FiMail, FiPhone, FiMapPin, FiSend, FiPackage } from "react-icons/fi";
import { quickLinks, socialLinks } from "../../../data/data";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 relative overflow-hidden">
      {/* Top gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Banner */}
        <div className="py-10 border-b border-gray-800">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                Subscribe to our Newsletter
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Get the latest updates on new products and promotions.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 md:w-64 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                <FiSend className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">GarmentFlow</h2>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Smart Garments Order & Production Tracking System. Manage orders,
              production stages, and delivery efficiently — all in one place.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-9 h-9 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-white ${social.color} hover:border-transparent transition-all duration-300 hover:scale-110`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-2 group transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                "Order Management",
                "Production Tracking",
                "Inventory Control",
                "Quality Assurance",
                "Delivery Management",
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm text-gray-400 hover:text-white flex items-center gap-2 group cursor-pointer transition-colors duration-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@garmentflow.com"
                  className="flex items-start gap-3 text-sm hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                    <FiMail className="w-4 h-4" />
                  </div>
                  support@garmentflow.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801000000000"
                  className="flex items-center gap-3 text-sm hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:border-purple-600 transition-all">
                    <FiPhone className="w-4 h-4" />
                  </div>
                  +880 1XXX-XXXXXX
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-4 h-4" />
                </div>
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {currentYear}{" "}
            <span className="text-white font-semibold">GarmentFlow</span>. All
            rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
