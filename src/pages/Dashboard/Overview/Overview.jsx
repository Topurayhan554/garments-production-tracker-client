import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPlus,
  FiEye,
  FiEdit,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";
import { PulsingText } from "../../../components/Loading";
const Overview = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock user - Replace with actual user from context/auth
  const user = {
    name: "John Doe",
    email: "john@example.com",
    role: "manager", // 'admin', 'manager', or 'buyer'
    avatar: "https://i.pravatar.cc/100?img=12",
  };

  // Mock data - Replace with actual API calls
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData(getMockData(user.role));
      setIsLoading(false);
    }, 1000);
  }, [user.role]);

  // Get mock data based on role
  const getMockData = (role) => {
    if (role === "admin") {
      return {
        stats: [
          {
            label: "Total Products",
            value: "248",
            change: "+12%",
            trend: "up",
            icon: <FiPackage />,
            color: "blue",
          },
          {
            label: "Total Orders",
            value: "1,234",
            change: "+8%",
            trend: "up",
            icon: <FiShoppingCart />,
            color: "green",
          },
          {
            label: "Total Users",
            value: "89",
            change: "+15%",
            trend: "up",
            icon: <FiUsers />,
            color: "purple",
          },
          {
            label: "Total Revenue",
            value: "$45.2K",
            change: "+23%",
            trend: "up",
            icon: <FiDollarSign />,
            color: "yellow",
          },
        ],
        recentActivities: [
          {
            id: 1,
            message: "New order #1234 placed by Sarah Johnson",
            time: "5 minutes ago",
            icon: <FiShoppingCart />,
            color: "green",
          },
          {
            id: 2,
            message: "New manager registered: Mike Chen",
            time: "15 minutes ago",
            icon: <FiUsers />,
            color: "blue",
          },
          {
            id: 3,
            message: 'Product "Premium T-Shirt" stock low (5 remaining)',
            time: "1 hour ago",
            icon: <FiAlertCircle />,
            color: "yellow",
          },
          {
            id: 4,
            message: "Order #1230 marked as delivered",
            time: "2 hours ago",
            icon: <FiCheckCircle />,
            color: "green",
          },
          {
            id: 5,
            message: "New product added: Winter Jacket",
            time: "3 hours ago",
            icon: <FiPlus />,
            color: "purple",
          },
        ],
        recentOrders: [
          {
            id: "#1234",
            customer: "Sarah Johnson",
            product: "Premium T-Shirt",
            amount: "$25.99",
            status: "pending",
            date: "2024-02-03",
          },
          {
            id: "#1233",
            customer: "Mike Chen",
            product: "Denim Jacket",
            amount: "$89.99",
            status: "approved",
            date: "2024-02-03",
          },
          {
            id: "#1232",
            customer: "Emily Rodriguez",
            product: "Sports Jersey",
            amount: "$39.99",
            status: "delivered",
            date: "2024-02-02",
          },
          {
            id: "#1231",
            customer: "David Lee",
            product: "Winter Hoodie",
            amount: "$54.99",
            status: "approved",
            date: "2024-02-02",
          },
          {
            id: "#1230",
            customer: "Lisa Park",
            product: "Casual Polo",
            amount: "$32.99",
            status: "delivered",
            date: "2024-02-01",
          },
        ],
        quickActions: [
          {
            label: "Manage Users",
            icon: <FiUsers />,
            link: "/dashboard/manage-users",
            color: "blue",
          },
          {
            label: "All Products",
            icon: <FiPackage />,
            link: "/dashboard/all-products",
            color: "purple",
          },
          {
            label: "All Orders",
            icon: <FiShoppingCart />,
            link: "/dashboard/all-orders",
            color: "green",
          },
          {
            label: "Analytics",
            icon: <FiTrendingUp />,
            link: "/dashboard/analytics",
            color: "yellow",
          },
        ],
      };
    } else if (role === "manager") {
      return {
        stats: [
          {
            label: "My Products",
            value: "45",
            change: "+5%",
            trend: "up",
            icon: <FiPackage />,
            color: "blue",
          },
          {
            label: "Pending Orders",
            value: "23",
            change: "+12%",
            trend: "up",
            icon: <FiClock />,
            color: "yellow",
          },
          {
            label: "Approved Orders",
            value: "156",
            change: "+8%",
            trend: "up",
            icon: <FiCheckCircle />,
            color: "green",
          },
          {
            label: "Revenue",
            value: "$12.5K",
            change: "+18%",
            trend: "up",
            icon: <FiDollarSign />,
            color: "purple",
          },
        ],
        recentActivities: [
          {
            id: 1,
            message: 'New order for "Premium T-Shirt" received',
            time: "10 minutes ago",
            icon: <FiShoppingCart />,
            color: "green",
          },
          {
            id: 2,
            message: 'You added "Winter Jacket" to inventory',
            time: "1 hour ago",
            icon: <FiPlus />,
            color: "blue",
          },
          {
            id: 3,
            message: "Order #1230 approved successfully",
            time: "2 hours ago",
            icon: <FiCheckCircle />,
            color: "green",
          },
          {
            id: 4,
            message: 'Stock updated for "Casual Polo"',
            time: "4 hours ago",
            icon: <FiEdit />,
            color: "purple",
          },
          {
            id: 5,
            message: 'Low stock alert for "Sports Jersey"',
            time: "5 hours ago",
            icon: <FiAlertCircle />,
            color: "yellow",
          },
        ],
        recentOrders: [
          {
            id: "#1234",
            customer: "Sarah Johnson",
            product: "Premium T-Shirt",
            amount: "$25.99",
            status: "pending",
            date: "2024-02-03",
          },
          {
            id: "#1233",
            customer: "Mike Chen",
            product: "Denim Jacket",
            amount: "$89.99",
            status: "pending",
            date: "2024-02-03",
          },
          {
            id: "#1232",
            customer: "Emily Rodriguez",
            product: "Sports Jersey",
            amount: "$39.99",
            status: "approved",
            date: "2024-02-02",
          },
          {
            id: "#1231",
            customer: "David Lee",
            product: "Winter Hoodie",
            amount: "$54.99",
            status: "approved",
            date: "2024-02-02",
          },
          {
            id: "#1230",
            customer: "Lisa Park",
            product: "Casual Polo",
            amount: "$32.99",
            status: "approved",
            date: "2024-02-01",
          },
        ],
        quickActions: [
          {
            label: "Add Product",
            icon: <FiPlus />,
            link: "/dashboard/add-product",
            color: "blue",
          },
          {
            label: "Manage Products",
            icon: <FiPackage />,
            link: "/dashboard/manage-products",
            color: "purple",
          },
          {
            label: "Pending Orders",
            icon: <FiClock />,
            link: "/dashboard/pending-orders",
            color: "yellow",
          },
          {
            label: "Approved Orders",
            icon: <FiCheckCircle />,
            link: "/dashboard/approved-orders",
            color: "green",
          },
        ],
      };
    } else {
      // buyer
      return {
        stats: [
          {
            label: "Total Orders",
            value: "24",
            change: "+6%",
            trend: "up",
            icon: <FiShoppingBag />,
            color: "blue",
          },
          {
            label: "Pending",
            value: "3",
            change: "-2%",
            trend: "down",
            icon: <FiClock />,
            color: "yellow",
          },
          {
            label: "Approved",
            value: "18",
            change: "+10%",
            trend: "up",
            icon: <FiCheckCircle />,
            color: "green",
          },
          {
            label: "In Transit",
            value: "3",
            change: "+5%",
            trend: "up",
            icon: <FiTrendingUp />,
            color: "purple",
          },
        ],
        recentActivities: [
          {
            id: 1,
            message: "Your order #1234 has been approved",
            time: "30 minutes ago",
            icon: <FiCheckCircle />,
            color: "green",
          },
          {
            id: 2,
            message: "Order #1230 is out for delivery",
            time: "2 hours ago",
            icon: <FiTrendingUp />,
            color: "blue",
          },
          {
            id: 3,
            message: "Order #1228 delivered successfully",
            time: "1 day ago",
            icon: <FiCheckCircle />,
            color: "green",
          },
          {
            id: 4,
            message: "New order #1235 placed",
            time: "2 days ago",
            icon: <FiShoppingCart />,
            color: "purple",
          },
          {
            id: 5,
            message: "Payment confirmed for order #1233",
            time: "3 days ago",
            icon: <FiDollarSign />,
            color: "yellow",
          },
        ],
        recentOrders: [
          {
            id: "#1234",
            product: "Premium T-Shirt",
            amount: "$25.99",
            status: "approved",
            date: "2024-02-03",
          },
          {
            id: "#1233",
            product: "Denim Jacket",
            amount: "$89.99",
            status: "pending",
            date: "2024-02-02",
          },
          {
            id: "#1232",
            product: "Sports Jersey",
            amount: "$39.99",
            status: "in-transit",
            date: "2024-02-01",
          },
          {
            id: "#1231",
            product: "Winter Hoodie",
            amount: "$54.99",
            status: "approved",
            date: "2024-01-31",
          },
          {
            id: "#1230",
            product: "Casual Polo",
            amount: "$32.99",
            status: "delivered",
            date: "2024-01-30",
          },
        ],
        quickActions: [
          {
            label: "Browse Products",
            icon: <FiShoppingBag />,
            link: "/all-products",
            color: "blue",
          },
          {
            label: "My Orders",
            icon: <FiPackage />,
            link: "/dashboard/my-orders",
            color: "purple",
          },
          {
            label: "Track Order",
            icon: <FiTrendingUp />,
            link: "/dashboard/track-order",
            color: "green",
          },
          {
            label: "My Profile",
            icon: <FiUsers />,
            link: "/dashboard/profile",
            color: "yellow",
          },
        ],
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PulsingText text="Loading dashboard..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {user.role === "admin"
                ? "Manage your entire platform from here"
                : user.role === "manager"
                  ? "Manage your products and orders efficiently"
                  : "Track your orders and explore new products"}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  stat.color === "blue"
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : stat.color === "green"
                      ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                      : stat.color === "purple"
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                        : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {stat.icon}
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stat.trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Activities
              </h2>
              <Link
                to="/dashboard/activities"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold flex items-center gap-1"
              >
                View All
                <FiArrowRight />
              </Link>
            </div>

            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.color === "green"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                        : activity.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : activity.color === "yellow"
                            ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                            : "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {activity.message}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <FiClock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {dashboardData.quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`flex items-center gap-3 p-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 ${
                    action.color === "blue"
                      ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                      : action.color === "purple"
                        ? "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800"
                        : action.color === "green"
                          ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                          : "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl ${
                      action.color === "blue"
                        ? "bg-blue-600"
                        : action.color === "purple"
                          ? "bg-purple-600"
                          : action.color === "green"
                            ? "bg-green-600"
                            : "bg-yellow-600"
                    }`}
                  >
                    {action.icon}
                  </div>
                  <span
                    className={`font-semibold ${
                      action.color === "blue"
                        ? "text-blue-900 dark:text-blue-300"
                        : action.color === "purple"
                          ? "text-purple-900 dark:text-purple-300"
                          : action.color === "green"
                            ? "text-green-900 dark:text-green-300"
                            : "text-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <Link
            to={
              user.role === "buyer"
                ? "/dashboard/my-orders"
                : "/dashboard/all-orders"
            }
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold flex items-center gap-1"
          >
            View All
            <FiArrowRight />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Order ID
                </th>
                {user.role !== "buyer" && (
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Customer
                  </th>
                )}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dashboardData.recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {order.id}
                  </td>
                  {user.role !== "buyer" && (
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {order.customer}
                    </td>
                  )}
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        order.status === "delivered"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : order.status === "approved"
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : order.status === "in-transit"
                              ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                              : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/dashboard/order/${order.id.replace("#", "")}`}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FiEye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
