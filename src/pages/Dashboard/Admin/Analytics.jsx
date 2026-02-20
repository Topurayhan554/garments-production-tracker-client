import React, { useState, useEffect, useCallback } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import { PulsingText } from "../../../components/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");
  const [activeChart, setActiveChart] = useState("revenue");
  const [analyticsData, setAnalyticsData] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    document.title = "Dashboard - Analytics | GarmentTrack";
    return () => {
      document.title = "GarmentTrack";
    };
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        axiosSecure.get("/orders"),
        axiosSecure.get("/users"),
        axiosSecure.get("/products"),
      ]);

      const orders = ordersRes.data || [];
      const users = usersRes.data || [];
      const products = productsRes.data || [];

      const now = new Date();
      const getDays = () =>
        ({
          "7days": 7,
          "30days": 30,
          "3months": 90,
          "6months": 180,
          "1year": 365,
        })[timeRange];

      const filterByRange = (items, field = "createdAt") => {
        if (timeRange === "all") return items;
        const cutoff = new Date(now - getDays() * 86400000);
        return items.filter((i) => new Date(i[field]) >= cutoff);
      };

      const filteredOrders = filterByRange(orders);
      const filteredUsers = filterByRange(users);

      const activeOrders = filteredOrders.filter(
        (o) => o.status !== "cancelled",
      );
      const totalRevenue = activeOrders.reduce((s, o) => s + (o.total || 0), 0);
      const totalOrders = filteredOrders.length;
      const totalCustomers = filteredUsers.filter(
        (u) => u.role === "buyer",
      ).length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const prevOrders = (() => {
        if (timeRange === "all") return [];
        const days = getDays();
        const cutoff = new Date(now - days * 86400000);
        const prevCutoff = new Date(now - days * 2 * 86400000);
        return orders.filter((o) => {
          const d = new Date(o.createdAt);
          return d >= prevCutoff && d < cutoff;
        });
      })();
      const prevRevenue = prevOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + (o.total || 0), 0);
      const prevAvg =
        prevOrders.length > 0 ? prevRevenue / prevOrders.length : 0;

      const calcGrowth = (cur, prev) => {
        if (prev === 0) return cur > 0 ? 100 : 0;
        return parseFloat((((cur - prev) / prev) * 100).toFixed(1));
      };

      const monthlyData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
        const y = d.getFullYear(),
          m = d.getMonth();
        const mo = orders.filter((o) => {
          const od = new Date(o.createdAt);
          return (
            od.getFullYear() === y &&
            od.getMonth() === m &&
            o.status !== "cancelled"
          );
        });
        return {
          date: d.toLocaleString("default", { month: "short" }),
          revenue: mo.reduce((s, o) => s + (o.total || 0), 0),
          orders: mo.length,
        };
      });

      const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);
      const maxOrders = Math.max(...monthlyData.map((m) => m.orders), 1);

      const statusConfig = {
        delivered: { name: "Delivered", color: "green" },
        "in-transit": { name: "Shipped", color: "blue" },
        "out-for-delivery": { name: "Out for Delivery", color: "cyan" },
        "in-production": { name: "In Production", color: "purple" },
        "quality-check": { name: "Quality Check", color: "indigo" },
        confirmed: { name: "Confirmed", color: "teal" },
        packed: { name: "Packed", color: "orange" },
        pending: { name: "Pending", color: "yellow" },
        cancelled: { name: "Cancelled", color: "red" },
      };

      const orderStatusData = Object.entries(statusConfig)
        .map(([key, info]) => ({
          ...info,
          value: filteredOrders.filter((o) => o.status === key).length,
        }))
        .filter((s) => s.value > 0)
        .sort((a, b) => b.value - a.value);

      const productMap = {};
      filteredOrders
        .filter((o) => o.status !== "cancelled" && o.productName)
        .forEach((o) => {
          if (!productMap[o.productName])
            productMap[o.productName] = { sales: 0, revenue: 0 };
          productMap[o.productName].sales += o.quantity || 1;
          productMap[o.productName].revenue += o.total || 0;
        });

      const topProducts = Object.entries(productMap)
        .map(([name, d]) => ({ name, ...d }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const recentTransactions = [...filteredOrders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((o) => ({
          id: o.orderId || o._id?.toString().slice(-6).toUpperCase(),
          customer: o.customer?.name || "Unknown",
          amount: o.total || 0,
          status: o.status,
          date: o.createdAt,
        }));

      const paymentMap = {};
      filteredOrders.forEach((o) => {
        const m = o.paymentMethod || "Unknown";
        paymentMap[m] = (paymentMap[m] || 0) + 1;
      });

      setAnalyticsData({
        stats: {
          totalRevenue,
          revenueGrowth: calcGrowth(totalRevenue, prevRevenue),
          totalOrders,
          ordersGrowth: calcGrowth(totalOrders, prevOrders.length),
          totalCustomers,
          customersGrowth: 0,
          avgOrderValue,
          avgOrderGrowth: calcGrowth(avgOrderValue, prevAvg),
          deliveredOrders: filteredOrders.filter(
            (o) => o.status === "delivered",
          ).length,
          cancelledOrders: filteredOrders.filter(
            (o) => o.status === "cancelled",
          ).length,
          totalProducts: products.length,
          activeUsers: users.filter((u) => u.status === "active").length,
        },
        monthlyData,
        maxRevenue,
        maxOrders,
        orderStatusData,
        topProducts,
        recentTransactions,
        paymentMap,
      });
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PulsingText text="Loading analytics..." size="lg" />
      </div>
    );
  }

  if (!analyticsData) return null;

  const {
    stats,
    monthlyData,
    maxRevenue,
    maxOrders,
    orderStatusData,
    topProducts,
    recentTransactions,
    paymentMap,
  } = analyticsData;

  const colorClass = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    teal: "bg-teal-500",
    indigo: "bg-indigo-500",
    cyan: "bg-cyan-500",
  };
  const strokeColor = {
    green: "#10b981",
    blue: "#3b82f6",
    purple: "#8b5cf6",
    yellow: "#eab308",
    red: "#ef4444",
    orange: "#f97316",
    teal: "#14b8a6",
    indigo: "#6366f1",
    cyan: "#06b6d4",
  };

  const statusBadge = (s) => {
    const m = {
      delivered:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      m[s] || "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    );
  };

  const GrowthBadge = ({ value }) => (
    <div
      className={`flex items-center gap-1 text-sm font-semibold ${value >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
    >
      {value >= 0 ? (
        <FiTrendingUp className="w-4 h-4" />
      ) : (
        <FiTrendingDown className="w-4 h-4" />
      )}
      <span>{Math.abs(value)}%</span>
    </div>
  );

  const totalStatusCount = orderStatusData.reduce((s, o) => s + o.value, 0);

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
          <div className="flex gap-3 flex-wrap">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={fetchAnalytics}
              title="Refresh"
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => alert("Export coming soon!")}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
            >
              <FiDownload className="w-5 h-5" /> Export
            </button>
          </div>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            {
              icon: <FiDollarSign className="w-6 h-6" />,
              gradient: "from-green-400 to-green-600",
              label: "Total Revenue",
              value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              growth: stats.revenueGrowth,
            },
            {
              icon: <FiShoppingBag className="w-6 h-6" />,
              gradient: "from-blue-400 to-blue-600",
              label: "Total Orders",
              value: stats.totalOrders.toLocaleString(),
              growth: stats.ordersGrowth,
            },
            {
              icon: <FiUsers className="w-6 h-6" />,
              gradient: "from-purple-400 to-purple-600",
              label: "Total Buyers",
              value: stats.totalCustomers,
              growth: stats.customersGrowth,
            },
            {
              icon: <FiPackage className="w-6 h-6" />,
              gradient: "from-yellow-400 to-yellow-600",
              label: "Avg Order Value",
              value: `$${stats.avgOrderValue.toFixed(2)}`,
              growth: stats.avgOrderGrowth,
            },
          ].map((c, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${c.gradient} rounded-xl flex items-center justify-center text-white`}
                >
                  {c.icon}
                </div>
                <GrowthBadge value={c.growth} />
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                {c.label}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {c.value}
              </p>
            </div>
          ))}
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Delivered",
              value: stats.deliveredOrders,
              color: "text-green-600 dark:text-green-400",
            },
            {
              label: "Cancelled",
              value: stats.cancelledOrders,
              color: "text-red-600 dark:text-red-400",
            },
            {
              label: "Products",
              value: stats.totalProducts,
              color: "text-blue-600 dark:text-blue-400",
            },
            {
              label: "Active Users",
              value: stats.activeUsers,
              color: "text-purple-600 dark:text-purple-400",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl px-5 py-4 shadow-lg flex items-center justify-between"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {s.label}
              </span>
              <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Monthly Chart + Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Monthly Overview
              </h2>
              <div className="flex gap-2">
                {["revenue", "orders"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveChart(t)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold capitalize transition ${activeChart === t ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {monthlyData.every(
              (m) => (activeChart === "revenue" ? m.revenue : m.orders) === 0,
            ) ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <FiShoppingBag className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">No data for this period</p>
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyData.map((item, i) => {
                  const val =
                    activeChart === "revenue" ? item.revenue : item.orders;
                  const maxVal =
                    activeChart === "revenue" ? maxRevenue : maxOrders;
                  const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                          {item.date}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {activeChart === "revenue"
                            ? `$${val.toLocaleString()}`
                            : `${val} orders`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
              Order Status
            </h2>
            {orderStatusData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <p className="text-sm">No order data</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {orderStatusData.map((s, i) => {
                    const pct =
                      totalStatusCount > 0
                        ? ((s.value / totalStatusCount) * 100).toFixed(1)
                        : 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${colorClass[s.color] || "bg-gray-400"}`}
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {s.name}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${colorClass[s.color] || "bg-gray-400"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center">
                  <div className="relative w-40 h-40">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      {orderStatusData.map((s, i) => {
                        const pct = (s.value / totalStatusCount) * 100;
                        const circ = 2 * Math.PI * 30;
                        const offset = orderStatusData
                          .slice(0, i)
                          .reduce(
                            (sum, p) =>
                              sum + (p.value / totalStatusCount) * 100,
                            0,
                          );
                        return (
                          <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r="30"
                            fill="none"
                            stroke={strokeColor[s.color] || "#9ca3af"}
                            strokeWidth="20"
                            strokeDasharray={`${(pct / 100) * circ} ${circ}`}
                            strokeDashoffset={-((offset / 100) * circ)}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {totalStatusCount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Orders
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Top Products + Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Top Products
            </h2>
            {topProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <FiPackage className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">No product data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {p.sales} units sold
                      </p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      $
                      {p.revenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Transactions
            </h2>
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <FiShoppingBag className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold flex-shrink-0">
                        {t.customer?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {t.customer}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          #{t.id} · {new Date(t.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ${t.amount.toFixed(2)}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge(t.status)}`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        {Object.keys(paymentMap).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Payment Methods
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(paymentMap).map(([method, count], i) => {
                const pct =
                  stats.totalOrders > 0
                    ? ((count / stats.totalOrders) * 100).toFixed(1)
                    : 0;
                const gradients = [
                  "from-blue-400 to-blue-600",
                  "from-green-400 to-green-600",
                  "from-purple-400 to-purple-600",
                  "from-orange-400 to-orange-600",
                ];
                return (
                  <div
                    key={i}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${gradients[i % 4]} rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-2`}
                    >
                      {method.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {method}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {count}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {pct}% of orders
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
