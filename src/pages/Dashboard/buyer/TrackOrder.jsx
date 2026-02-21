import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  FiSearch,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiUser,
  FiAlertCircle,
  FiHome,
  FiBox,
  FiDownload,
  FiXCircle,
  FiRefreshCw,
  FiArrowLeft,
  FiShoppingBag,
} from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { STATUS_PIPELINE } from "../../../data/data";
import { SkeletonTable } from "../../../components/Loading";

const STATUS_ORDER = STATUS_PIPELINE.map((s) => s.key);

// Helpers

const buildTimeline = (order) => {
  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const historyMap = {};
  order.statusHistory?.forEach((h) => {
    historyMap[h.status] = h;
  });

  return STATUS_PIPELINE.map((step, idx) => {
    const entry = historyMap[step.key];
    const completed = idx <= currentIdx;
    const current = step.key === order.status;

    return {
      status: step.label,
      location: entry?.location || null,
      date: entry?.timestamp
        ? new Date(entry.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : completed && !current
          ? "Completed"
          : current
            ? new Date(order.updatedAt || order.createdAt).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" },
              )
            : "Upcoming",
      time: entry?.timestamp
        ? new Date(entry.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : current
          ? new Date(order.updatedAt || order.createdAt).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" },
            )
          : "",
      completed,
      current,
      icon: step.icon,
      description: entry?.note || step.description,
    };
  });
};

const getProgress = (timeline) => {
  if (!timeline?.length) return 0;
  return Math.round(
    (timeline.filter((h) => h.completed).length / timeline.length) * 100,
  );
};

const formatStatus = (status = "") =>
  status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const statusConfig = (status) => {
  switch (status) {
    case "delivered":
      return {
        gradient: "from-green-500 to-emerald-600",
        badge: "bg-green-500",
      };
    case "in-transit":
    case "out-for-delivery":
    case "shipped":
      return { gradient: "from-blue-600 to-indigo-600", badge: "bg-blue-500" };
    case "cancelled":
      return { gradient: "from-red-500 to-rose-600", badge: "bg-red-500" };
    case "in-production":
      return { gradient: "from-blue-500 to-cyan-500", badge: "bg-blue-500" };
    default:
      return {
        gradient: "from-yellow-500 to-orange-500",
        badge: "bg-yellow-500",
      };
  }
};


const TrackOrder = () => {
  // trackingNumber is OPTIONAL — undefined when visiting /track-order
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [searchInput, setSearchInput] = useState(trackingNumber || "");
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // isDirectMode = came from MyOrders with trackingNumber in URL
  const isDirectMode = Boolean(trackingNumber);

  useEffect(() => {
    document.title = trackingNumber
      ? `Track Order - ${trackingNumber} | GarmentTrack`
      : "Dashboard - Track Order | GarmentTrack";
    return () => {
      document.title = "GarmentTrack";
    };
  }, [trackingNumber]);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchOrder = useCallback(
    async (query) => {
      const q = (query || "").trim();
      if (!q) return;

      setIsLoading(true);
      setError("");
      if (!isDirectMode) setOrder(null);

      try {
        const res = await axiosSecure.get(`/orders/track/${q}`);
        const data = res.data;

        if (!data?._id) {
          setError(
            "Order not found. Please check your Order ID or Tracking Number.",
          );
          return;
        }

        setOrder(data);
        setTimeline(buildTimeline(data));
        setLastRefreshed(new Date());
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Order not found. Please check your Order ID or Tracking Number.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [axiosSecure, isDirectMode],
  );

  // Auto-fetch when URL has trackingNumber
  useEffect(() => {
    if (isDirectMode) fetchOrder(trackingNumber);
  }, [isDirectMode, trackingNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  const { gradient, badge } = statusConfig(order?.status || "pending");
  const progress = getProgress(timeline);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back nav */}
        <div className="mb-6">
          <Link
            to="/dashboard/my-orders"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition font-medium"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to My Orders
          </Link>
        </div>

        {/*search mode*/}
        {!isDirectMode && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Track Your Order
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your Order ID or Tracking Number to track your shipment
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
              <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-4"
              >
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter Order ID (e.g., ORD-000001) or Tracking Number"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !searchInput.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Tracking...
                    </>
                  ) : (
                    <>
                      <FiSearch className="w-5 h-5" /> Track Order
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Empty state */}
            {!order && !isLoading && !error && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 text-center">
                <FiSearch className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Enter your Order ID or Tracking Number above
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You can find them in the{" "}
                  <button
                    onClick={() => navigate("/dashboard/my-orders")}
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    My Orders
                  </button>{" "}
                  page.
                </p>
              </div>
            )}
          </>
        )}

        {/* error */}
        {isDirectMode && isLoading && <SkeletonTable />}

        {isDirectMode && !isLoading && error && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => fetchOrder(trackingNumber)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FiRefreshCw className="w-4 h-4" /> Try Again
              </button>
              <Link
                to="/dashboard/my-orders"
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
              >
                <FiShoppingBag className="w-4 h-4" /> My Orders
              </Link>
            </div>
          </div>
        )}

        {/* order result */}
        {!isLoading && order && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-white/70 text-sm font-medium mb-1">
                      Tracking Number
                    </p>
                    <h1 className="text-3xl font-bold tracking-wide">
                      {order.trackingNumber || order.orderId}
                    </h1>
                    <p className="text-white/80 mt-1 text-sm">
                      Order ID: {order.orderId}
                    </p>
                  </div>
                  <span
                    className={`self-start sm:self-auto px-4 py-2 rounded-xl font-bold text-white text-sm ${badge}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>

                {order.status !== "cancelled" && (
                  <div className="mt-6">
                    <div className="flex justify-between text-xs text-white/70 mb-2">
                      <span>Order Placed</span>
                      <span>{progress}% Complete</span>
                      <span>Delivered</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-1000 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {order.status === "cancelled" && (
                  <div className="mt-4 p-3 bg-white/20 rounded-xl flex items-center gap-2">
                    <FiXCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Reason: {order.cancelReason || "Not specified"}
                    </span>
                  </div>
                )}
              </div>

              {/* Info strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-700">
                {[
                  {
                    label: "Order Date",
                    value: new Date(
                      order.orderDate || order.createdAt,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }),
                  },
                  {
                    label: "Est. Delivery",
                    value: order.estimatedDelivery
                      ? new Date(order.estimatedDelivery).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                      : "—",
                  },
                  {
                    label: "Payment",
                    value: order.paymentStatus
                      ? order.paymentStatus.charAt(0).toUpperCase() +
                        order.paymentStatus.slice(1)
                      : "—",
                    color:
                      order.paymentStatus === "paid"
                        ? "text-green-600 dark:text-green-400"
                        : order.paymentStatus === "refunded"
                          ? "text-red-600 dark:text-red-400"
                          : "text-yellow-600 dark:text-yellow-400",
                  },
                  {
                    label: "Total",
                    value: `$${(order.total || order.amount || 0).toFixed(2)}`,
                    bold: true,
                  },
                ].map(({ label, value, color, bold }) => (
                  <div key={label} className="p-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {label}
                    </p>
                    <p
                      className={`text-sm ${bold ? "font-bold text-gray-900 dark:text-white" : color ? color + " font-semibold" : "font-semibold text-gray-900 dark:text-white"}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Product + Delivery */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiPackage className="w-5 h-5 text-blue-500" /> Product
                  Details
                </h2>
                <div className="flex items-start gap-4">
                  <img
                    src={order.productImage || "/placeholder.png"}
                    alt={order.productName}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 truncate">
                      {order.productName}
                    </h3>
                    <div className="space-y-1.5 text-sm">
                      {[
                        ["Qty", order.quantity],
                        ["Size", order.size],
                        ["Color", order.color],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            {k}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {v}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">
                          Total
                        </span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          ${(order.total || order.amount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiMapPin className="w-5 h-5 text-blue-500" /> Delivery Info
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      icon: (
                        <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ),
                      bg: "bg-blue-100 dark:bg-blue-900/20",
                      label: "Customer",
                      value: order.customerName || user?.displayName || "—",
                    },
                    order.deliveryAddress && {
                      icon: (
                        <FiHome className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ),
                      bg: "bg-blue-100 dark:bg-blue-900/20",
                      label: "Address",
                      value: [
                        order.deliveryAddress.street,
                        order.deliveryAddress.area,
                        order.deliveryAddress.city,
                        order.deliveryAddress.zip,
                      ]
                        .filter(Boolean)
                        .join(", "),
                    },
                    order.notes && {
                      icon: (
                        <FiAlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      ),
                      bg: "bg-yellow-100 dark:bg-yellow-900/20",
                      label: "Special Notes",
                      value: `"${order.notes}"`,
                      italic: true,
                    },
                    order.status === "delivered" &&
                      order.deliveredAt && {
                        icon: (
                          <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ),
                        bg: "bg-green-100 dark:bg-green-900/20",
                        label: "Delivered On",
                        value: new Date(order.deliveredAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        ),
                        color: "text-green-600 dark:text-green-400",
                      },
                  ]
                    .filter(Boolean)
                    .map(({ icon, bg, label, value, italic, color }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          {icon}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {label}
                          </p>
                          <p
                            className={`text-sm font-semibold ${color || "text-gray-900 dark:text-white"} ${italic ? "italic" : ""}`}
                          >
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            {order.status !== "cancelled" && timeline.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FiTruck className="w-5 h-5 text-blue-500" /> Shipment
                  Timeline
                </h2>
                <div className="relative">
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-4">
                    {timeline.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-start gap-4"
                      >
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                            item.completed
                              ? item.current
                                ? "bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900 shadow-lg shadow-blue-200 dark:shadow-blue-900"
                                : "bg-green-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1 pb-4">
                          <div
                            className={`rounded-xl p-4 transition-all ${
                              item.current
                                ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700"
                                : item.completed
                                  ? "bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900"
                                  : "bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4
                                  className={`font-bold text-sm ${item.completed ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}
                                >
                                  {item.status}
                                </h4>
                                {item.location && (
                                  <p
                                    className={`text-xs mt-0.5 ${item.completed ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}
                                  >
                                    📍 {item.location}
                                  </p>
                                )}
                              </div>
                              <div
                                className={`text-right text-xs flex-shrink-0 ${item.completed ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}
                              >
                                <p className="font-medium">{item.date}</p>
                                {item.time && <p>{item.time}</p>}
                              </div>
                            </div>
                            {item.description && (
                              <p
                                className={`text-xs mt-2 ${item.completed ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}
                              >
                                {item.description}
                              </p>
                            )}
                            {item.current && (
                              <div className="mt-2 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold">
                                  Live Status
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/dashboard/my-orders"
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <FiArrowLeft className="w-4 h-4" /> My Orders
              </Link>
              <button
                onClick={() =>
                  fetchOrder(order.trackingNumber || order.orderId)
                }
                className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center justify-center gap-2"
              >
                <FiRefreshCw className="w-4 h-4" />
                Refresh
                {lastRefreshed && (
                  <span className="text-xs opacity-60 ml-1">
                    ·{" "}
                    {lastRefreshed.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 px-6 py-3 bg-gray-800 dark:bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-900 dark:hover:bg-gray-500 transition flex items-center justify-center gap-2"
              >
                <FiDownload className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
