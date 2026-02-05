import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiCalendar,
  FiFilter,
  FiDownload,
} from "react-icons/fi";
import { PulsingText } from "../../../components/Loading";

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Mock data
  const stats = {
    totalRevenue: 45234.5,
    revenueGrowth: 23.5,
    totalOrders: 1234,
    ordersGrowth: 12.3,
    totalCustomers: 89,
    customersGrowth: 15.7,
    avgOrderValue: 36.65,
    avgOrderGrowth: 8.2,
  };

  // Revenue chart data
  const revenueData = [
    { date: "Jan", revenue: 3400, orders: 45 },
    { date: "Feb", revenue: 4200, orders: 52 },
    { date: "Mar", revenue: 3800, orders: 48 },
    { date: "Apr", revenue: 5100, orders: 65 },
    { date: "May", revenue: 4800, orders: 58 },
    { date: "Jun", revenue: 6200, orders: 75 },
    { date: "Jul", revenue: 5800, orders: 70 },
  ];

  // Order status distribution
  const orderStatus = [
    { name: "Delivered", value: 45, color: "green" },
    { name: "Shipped", value: 20, color: "blue" },
    { name: "Processing", value: 18, color: "purple" },
    { name: "Pending", value: 12, color: "yellow" },
    { name: "Cancelled", value: 5, color: "red" },
  ];

  // Top products
  const topProducts = [
    { name: "Premium T-Shirt", sales: 245, revenue: 6372.55 },
    { name: "Denim Jacket", sales: 189, revenue: 16999.11 },
    { name: "Sports Jersey", sales: 156, revenue: 6232.44 },
    { name: "Winter Hoodie", sales: 134, revenue: 7368.66 },
    { name: "Casual Polo", sales: 98, revenue: 3232.02 },
  ];

  // Recent transactions
  const recentTransactions = [
    {
      id: "#1234",
      customer: "Sarah Johnson",
      amount: 51.98,
      status: "completed",
      date: "2024-02-03",
    },
    {
      id: "#1233",
      customer: "Mike Chen",
      amount: 89.99,
      status: "completed",
      date: "2024-02-03",
    },
    {
      id: "#1232",
      customer: "Emily Rodriguez",
      amount: 119.97,
      status: "pending",
      date: "2024-02-02",
    },
    {
      id: "#1231",
      customer: "David Lee",
      amount: 54.99,
      status: "completed",
      date: "2024-02-02",
    },
    {
      id: "#1230",
      customer: "Lisa Park",
      amount: 65.98,
      status: "completed",
      date: "2024-02-01",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PulsingText text="Loading analytics..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your business performance and insights
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>

            <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
              <FiDownload className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                <FiDollarSign />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  stats.revenueGrowth >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stats.revenueGrowth >= 0 ? (
                  <FiTrendingUp className="w-4 h-4" />
                ) : (
                  <FiTrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(stats.revenueGrowth)}%</span>
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl">
                <FiShoppingBag />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  stats.ordersGrowth >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stats.ordersGrowth >= 0 ? (
                  <FiTrendingUp className="w-4 h-4" />
                ) : (
                  <FiTrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(stats.ordersGrowth)}%</span>
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalOrders.toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                <FiUsers />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  stats.customersGrowth >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stats.customersGrowth >= 0 ? (
                  <FiTrendingUp className="w-4 h-4" />
                ) : (
                  <FiTrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(stats.customersGrowth)}%</span>
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">
              Total Customers
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalCustomers}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white text-2xl">
                <FiPackage />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  stats.avgOrderGrowth >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stats.avgOrderGrowth >= 0 ? (
                  <FiTrendingUp className="w-4 h-4" />
                ) : (
                  <FiTrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(stats.avgOrderGrowth)}%</span>
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">
              Avg Order Value
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${stats.avgOrderValue}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Revenue Overview
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold">
                  Revenue
                </button>
                <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600">
                  Orders
                </button>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {revenueData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.date}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${item.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(item.revenue / 7000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Order Status
            </h2>

            <div className="space-y-4">
              {orderStatus.map((status, index) => {
                const total = orderStatus.reduce((sum, s) => sum + s.value, 0);
                const percentage = ((status.value / total) * 100).toFixed(1);

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status.color === "green"
                              ? "bg-green-500"
                              : status.color === "blue"
                                ? "bg-blue-500"
                                : status.color === "purple"
                                  ? "bg-purple-500"
                                  : status.color === "yellow"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {status.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          status.color === "green"
                            ? "bg-green-500"
                            : status.color === "blue"
                              ? "bg-blue-500"
                              : status.color === "purple"
                                ? "bg-purple-500"
                                : status.color === "yellow"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Donut Chart Representation */}
            <div className="mt-6 flex justify-center">
              <div className="relative w-48 h-48">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {orderStatus.map((status, index) => {
                    const total = orderStatus.reduce(
                      (sum, s) => sum + s.value,
                      0,
                    );
                    const percentage = (status.value / total) * 100;
                    const circumference = 2 * Math.PI * 30;
                    const offset = orderStatus
                      .slice(0, index)
                      .reduce((sum, s) => sum + (s.value / total) * 100, 0);

                    return (
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r="30"
                        fill="none"
                        stroke={
                          status.color === "green"
                            ? "#10b981"
                            : status.color === "blue"
                              ? "#3b82f6"
                              : status.color === "purple"
                                ? "#8b5cf6"
                                : status.color === "yellow"
                                  ? "#eab308"
                                  : "#ef4444"
                        }
                        strokeWidth="20"
                        strokeDasharray={`${(percentage / 100) * circumference} ${circumference}`}
                        strokeDashoffset={-((offset / 100) * circumference)}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {orderStatus.reduce((sum, s) => sum + s.value, 0)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Total Orders
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Top Products
            </h2>

            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      ${product.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Transactions
            </h2>

            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                        transaction.status === "completed"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {transaction.status === "completed" ? "✓" : "⏱"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {transaction.customer}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.id} •{" "}
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs font-semibold ${
                        transaction.status === "completed"
                          ? "text-green-600 dark:text-green-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
