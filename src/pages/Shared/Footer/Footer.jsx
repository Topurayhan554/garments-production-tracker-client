import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">GarmentFlow</h2>
          <p className="mt-3 text-sm">
            Smart Garments Order & Production Tracking System. Manage orders,
            production stages, and delivery efficiently.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Useful Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Home</li>
            <li>All Products</li>
            <li>Dashboard</li>
            <li>About Us</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm">Email: support@garmentflow.com</p>
          <p className="text-sm">Phone: +880 1XXX-XXXXXX</p>
          <p className="text-sm">Dhaka, Bangladesh</p>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} GarmentFlow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
