import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router";
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiShoppingBag,
  FiPlusCircle,
  FiList,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiBarChart,
  FiSettings,
  FiTrendingUp,
} from "react-icons/fi";
import { ToastContainer } from "react-toastify";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: Get from your auth context
  // const { user, logout } = useAuth();
  const user = {
    name: "John Doe",
    email: "john@example.com",
    photoURL: "https://i.pravatar.cc/150?img=12",
    role: "manager", // Change to 'admin' or 'manager' to test different views
    status: "approved",
  };

  // Handle logout
  const handleLogout = () => {
    // TODO: Implement logout
    navigate("/login");
  };

  // Admin Navigation
  const adminNavigation = [
    { name: "Overview", path: "/dashboard", icon: <FiHome />, exact: true },
    {
      name: "Manage Users",
      path: "/dashboard/manage-users",
      icon: <FiUsers />,
    },
    {
      name: "All Products",
      path: "/all-products",
      icon: <FiPackage />,
    },
    {
      name: "All Orders",
      path: "/dashboard/all-orders",
      icon: <FiShoppingBag />,
    },
    { name: "Analytics", path: "/dashboard/analytics", icon: <FiBarChart /> },
  ];

  // Manager Navigation
  const managerNavigation = [
    { name: "Overview", path: "/dashboard", icon: <FiHome />, exact: true },
    {
      name: "Add Product",
      path: "/dashboard/add-product",
      icon: <FiPlusCircle />,
    },
    {
      name: "Manage Products",
      path: "/dashboard/manage-products",
      icon: <FiList />,
    },
    {
      name: "Pending Orders",
      path: "/dashboard/pending-orders",
      icon: <FiClock />,
    },
    {
      name: "Approved Orders",
      path: "/dashboard/approved-orders",
      icon: <FiCheckCircle />,
    },
  ];

  // Buyer Navigation
  const buyerNavigation = [
    { name: "Overview", path: "/dashboard", icon: <FiHome />, exact: true },
    {
      name: "My Orders",
      path: "/dashboard/my-orders",
      icon: <FiShoppingBag />,
    },
    {
      name: "Track Order",
      path: "/dashboard/track-order",
      icon: <FiTrendingUp />,
    },
  ];

  // Get navigation based on role
  const getNavigation = () => {
    switch (user?.role) {
      case "admin":
        return adminNavigation;
      case "manager":
        return managerNavigation;
      case "buyer":
        return buyerNavigation;
      default:
        return buyerNavigation;
    }
  };

  const navigation = getNavigation();

  // Check if route is active
  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GarmentTrack
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dashboard
                </p>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.photoURL ||
                  "https://ui-avatars.com/api/?name=" + user?.name
                }
                alt={user?.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Role Badge */}
            <div className="mt-3 flex gap-2">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                  user?.role === "admin"
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    : user?.role === "manager"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                }`}
              >
                {user?.role}
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                  user?.status === "approved"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : user?.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {user?.status}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive(item.path, item.exact)
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <Link
              to="/dashboard/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all duration-200"
            >
              <FiUser className="text-xl" />
              <span>My Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all duration-200"
            >
              <FiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {/* Page Title */}
            <div className="flex-1 lg:flex-none">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {navigation.find((item) => isActive(item.path, item.exact))
                  ?.name || "Dashboard"}
              </h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <FiSettings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
