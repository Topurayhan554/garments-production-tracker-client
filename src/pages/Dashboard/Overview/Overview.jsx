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
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import { toast } from "react-toastify";

const Overview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Page title
  useEffect(() => {
    document.title = "Dashboard - Overview | GarmentTrack";
    return () => {
      document.title = "GarmentTrack";
    };
  }, []);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.role) return;

      setIsLoading(true);
      try {
        const data = await getDashboardData(user.role, user.email);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role, user?.email]);

  //  Fetch data based on role
  const getDashboardData = async (role, email) => {
    if (role === "admin") {
      return await getAdminDashboard();
    } else if (role === "manager") {
      return await getManagerDashboard();
    } else {
      return await getBuyerDashboard(email);
    }
  };

  // Admin Dashboard Data
  const getAdminDashboard = async () => {
    try {
      // Fetch all required data in parallel
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axiosSecure.get("/products"),
        axiosSecure.get("/orders"),
        axiosSecure.get("/users"),
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;
      const users = usersRes.data;

      // Calculate statistics
      const totalRevenue = orders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + (o.total || 0), 0);

      const stats = [
        {
          label: "Total Products",
          value: products.length.toString(),
          change: "+12%",
          trend: "up",
          icon: <FiPackage />,
          color: "blue",
        },
        {
          label: "Total Orders",
          value: orders.length.toString(),
          change: "+8%",
          trend: "up",
          icon: <FiShoppingCart />,
          color: "green",
        },
        {
          label: "Total Users",
          value: users.length.toString(),
          change: "+15%",
          trend: "up",
          icon: <FiUsers />,
          color: "purple",
        },
        {
          label: "Total Revenue",
          value: `$${(totalRevenue / 1000).toFixed(1)}K`,
          change: "+23%",
          trend: "up",
          icon: <FiDollarSign />,
          color: "yellow",
        },
      ];

      // Recent activities - last 5 orders
      const recentActivities = orders.slice(0, 5).map((order, index) => ({
        id: index + 1,
        message: `New order ${order.orderId} placed by ${order.customer?.name || "Customer"}`,
        time: getTimeAgo(order.createdAt),
        icon: <FiShoppingCart />,
        color: "green",
      }));

      // Recent orders - last 5
      const recentOrders = orders.slice(0, 5).map((order) => ({
        id: order.orderId,
        customer: order.customer?.name || "N/A",
        product: order.productName,
        amount: `$${(order.total || 0).toFixed(2)}`,
        status: order.status,
        date: order.orderDate || order.createdAt,
      }));

      const quickActions = [
        {
          label: "Manage Users",
          icon: <FiUsers />,
          link: "/dashboard/manage-users",
          color: "blue",
        },
        {
          label: "All Products",
          icon: <FiPackage />,
          link: "/all-products",
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
      ];

      return { stats, recentActivities, recentOrders, quickActions };
    } catch (error) {
      console.error("Admin dashboard error:", error);
      throw error;
    }
  };

  // Manager Dashboard Data
  const getManagerDashboard = async () => {
    try {
      const [productsRes, ordersRes, pendingStatsRes] = await Promise.all([
        axiosSecure.get("/products"),
        axiosSecure.get("/orders/approved"),
        axiosSecure.get("/orders/pending-stats"),
      ]);

      const products = productsRes.data;
      const approvedOrders = ordersRes.data;
      const pendingStats = pendingStatsRes.data;

      const totalRevenue = approvedOrders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + (o.total || 0), 0);

      const stats = [
        {
          label: "Total Products",
          value: products.length.toString(),
          change: "+5%",
          trend: "up",
          icon: <FiPackage />,
          color: "blue",
        },
        {
          label: "Pending Orders",
          value: pendingStats.totalPending?.toString() || "0",
          change: "+12%",
          trend: "up",
          icon: <FiClock />,
          color: "yellow",
        },
        {
          label: "Approved Orders",
          value: approvedOrders.length.toString(),
          change: "+8%",
          trend: "up",
          icon: <FiCheckCircle />,
          color: "green",
        },
        {
          label: "Revenue",
          value: `$${(totalRevenue / 1000).toFixed(1)}K`,
          change: "+18%",
          trend: "up",
          icon: <FiDollarSign />,
          color: "purple",
        },
      ];

      const recentActivities = approvedOrders
        .slice(0, 5)
        .map((order, index) => ({
          id: index + 1,
          message: `Order ${order.orderId} - ${order.productName}`,
          time: getTimeAgo(order.createdAt),
          icon: <FiShoppingCart />,
          color: "green",
        }));

      const recentOrders = approvedOrders.slice(0, 5).map((order) => ({
        id: order.orderId,
        customer: order.customer?.name || "N/A",
        product: order.productName,
        amount: `$${(order.total || 0).toFixed(2)}`,
        status: order.status,
        date: order.orderDate || order.createdAt,
      }));

      const quickActions = [
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
      ];

      return { stats, recentActivities, recentOrders, quickActions };
    } catch (error) {
      console.error("Manager dashboard error:", error);
      throw error;
    }
  };

  // Buyer Dashboard Data
  const getBuyerDashboard = async (email) => {
    try {
      if (!email) {
        throw new Error("User email not found");
      }

      const ordersRes = await axiosSecure.get(`/orders?email=${email}`);
      const orders = ordersRes.data;

      const pendingOrders = orders.filter((o) => o.status === "pending");
      const approvedOrders = orders.filter((o) =>
        ["confirmed", "in-production", "quality-check", "packed"].includes(
          o.status,
        ),
      );
      const inTransitOrders = orders.filter((o) =>
        ["in-transit", "out-for-delivery"].includes(o.status),
      );

      const stats = [
        {
          label: "Total Orders",
          value: orders.length.toString(),
          change: "+6%",
          trend: "up",
          icon: <FiShoppingBag />,
          color: "blue",
        },
        {
          label: "Pending",
          value: pendingOrders.length.toString(),
          change: "-2%",
          trend: pendingOrders.length > 0 ? "up" : "down",
          icon: <FiClock />,
          color: "yellow",
        },
        {
          label: "Approved",
          value: approvedOrders.length.toString(),
          change: "+10%",
          trend: "up",
          icon: <FiCheckCircle />,
          color: "green",
        },
        {
          label: "In Transit",
          value: inTransitOrders.length.toString(),
          change: "+5%",
          trend: "up",
          icon: <FiTrendingUp />,
          color: "purple",
        },
      ];

      const recentActivities = orders.slice(0, 5).map((order, index) => {
        let message = "";
        let icon = <FiShoppingCart />;
        let color = "green";

        if (order.status === "confirmed") {
          message = `Your order ${order.orderId} has been approved`;
          icon = <FiCheckCircle />;
          color = "green";
        } else if (["in-transit", "out-for-delivery"].includes(order.status)) {
          message = `Order ${order.orderId} is out for delivery`;
          icon = <FiTrendingUp />;
          color = "blue";
        } else if (order.status === "delivered") {
          message = `Order ${order.orderId} delivered successfully`;
          icon = <FiCheckCircle />;
          color = "green";
        } else if (order.status === "pending") {
          message = `New order ${order.orderId} placed`;
          icon = <FiShoppingCart />;
          color = "purple";
        } else {
          message = `Order ${order.orderId} - ${order.status}`;
          icon = <FiPackage />;
          color = "blue";
        }

        return {
          id: index + 1,
          message,
          time: getTimeAgo(order.createdAt),
          icon,
          color,
        };
      });

      const recentOrders = orders.slice(0, 5).map((order) => ({
        id: order.orderId,
        product: order.productName,
        amount: `$${(order.total || 0).toFixed(2)}`,
        status: order.status,
        date: order.orderDate || order.createdAt,
      }));

      const quickActions = [
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
      ];

      return { stats, recentActivities, recentOrders, quickActions };
    } catch (error) {
      console.error("Buyer dashboard error:", error);
      throw error;
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (date) => {
    if (!date) return "Just now";

    const now = new Date();
    const orderDate = new Date(date);
    const diffMs = now - orderDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return orderDate.toLocaleDateString();
  };

  //  Loading state
  if (isLoading || !dashboardData) {
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
              Welcome back, {user?.displayName || user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {user?.role === "admin"
                ? "Manage your entire platform from here"
                : user?.role === "manager"
                  ? "Manage your products and orders efficiently"
                  : "Track your orders and explore new products"}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${user?.displayName || user?.name}`
                }
                alt={user?.displayName || user?.name}
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user?.displayName || user?.name}`;
                }}
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

            {dashboardData.recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No recent activities
                </p>
              </div>
            ) : (
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
            )}
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
              user?.role === "buyer"
                ? "/dashboard/my-orders"
                : "/dashboard/all-orders"
            }
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold flex items-center gap-1"
          >
            View All
            <FiArrowRight />
          </Link>
        </div>

        {dashboardData.recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Order ID
                  </th>
                  {user?.role !== "buyer" && (
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
                    {user?.role !== "buyer" && (
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
                            : [
                                  "confirmed",
                                  "in-production",
                                  "quality-check",
                                  "packed",
                                ].includes(order.status)
                              ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : ["in-transit", "out-for-delivery"].includes(
                                    order.status,
                                  )
                                ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                : order.status === "cancelled"
                                  ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                  : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {order.status
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/dashboard/order/${order.id?.replace("#", "")}`}
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
        )}
      </div>
    </div>
  );
};

export default Overview;
