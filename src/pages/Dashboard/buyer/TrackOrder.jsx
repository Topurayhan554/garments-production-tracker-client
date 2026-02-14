import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FiSearch,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiCalendar,
  FiPhone,
  FiMail,
  FiUser,
  FiAlertCircle,
  FiHome,
  FiBox,
  FiArrowRight,
} from "react-icons/fi";
import { PulsingText } from "../../../components/Loading";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState(orderId || "");
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock order tracking data
  const mockOrderData = {
    "#1234": {
      orderId: "#1234",
      trackingNumber: "TRK-2024-001",
      product: "Premium Cotton T-Shirt",
      productImage:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
      quantity: 2,
      size: "L",
      color: "Navy Blue",
      amount: 51.98,
      status: "in-transit",
      orderDate: "2024-02-03",
      estimatedDelivery: "2024-02-10",
      currentLocation: "Dhaka Distribution Center",
      destination: "123 Main St, Mirpur, Dhaka-1216",
      customer: {
        name: "Sarah Johnson",
        phone: "+880 1234-567890",
        email: "sarah@example.com",
      },
      trackingHistory: [
        {
          status: "Order Placed",
          location: "Online",
          date: "2024-02-03",
          time: "10:30 AM",
          completed: true,
          icon: <FiCheckCircle className="w-5 h-5" />,
          description: "Your order has been placed successfully",
        },
        {
          status: "Order Confirmed",
          location: "Warehouse",
          date: "2024-02-03",
          time: "02:15 PM",
          completed: true,
          icon: <FiCheckCircle className="w-5 h-5" />,
          description: "Order confirmed and being prepared",
        },
        {
          status: "In Production",
          location: "Manufacturing Unit",
          date: "2024-02-04",
          time: "09:00 AM",
          completed: true,
          icon: <FiBox className="w-5 h-5" />,
          description: "Product is being manufactured",
        },
        {
          status: "Quality Check",
          location: "QC Department",
          date: "2024-02-06",
          time: "03:45 PM",
          completed: true,
          icon: <FiCheckCircle className="w-5 h-5" />,
          description: "Quality inspection completed",
        },
        {
          status: "Packed",
          location: "Warehouse",
          date: "2024-02-07",
          time: "11:20 AM",
          completed: true,
          icon: <FiPackage className="w-5 h-5" />,
          description: "Order packed and ready for shipment",
        },
        {
          status: "In Transit",
          location: "Dhaka Distribution Center",
          date: "2024-02-08",
          time: "08:00 AM",
          completed: true,
          icon: <FiTruck className="w-5 h-5" />,
          description: "Package is on the way to your location",
          current: true,
        },
        {
          status: "Out for Delivery",
          location: "Local Delivery Hub",
          date: "2024-02-10",
          time: "Estimated",
          completed: false,
          icon: <FiTruck className="w-5 h-5" />,
          description: "Package will be out for delivery",
        },
        {
          status: "Delivered",
          location: "123 Main St, Mirpur",
          date: "2024-02-10",
          time: "Estimated",
          completed: false,
          icon: <FiHome className="w-5 h-5" />,
          description: "Package will be delivered to your address",
        },
      ],
    },
    "TRK-2024-002": {
      orderId: "#1227",
      trackingNumber: "TRK-2024-002",
      product: "Leather Jacket",
      productImage:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300",
      quantity: 1,
      size: "L",
      color: "Brown",
      amount: 199.99,
      status: "delivered",
      orderDate: "2024-02-02",
      estimatedDelivery: "2024-02-08",
      deliveryDate: "2024-02-08",
      currentLocation: "Delivered",
      destination: "258 Birch Ct, Dhanmondi, Dhaka-1205",
      customer: {
        name: "Robert Taylor",
        phone: "+880 1234-567897",
        email: "robert@example.com",
      },
      trackingHistory: [
        {
          status: "Order Placed",
          location: "Online",
          date: "2024-02-02",
          time: "09:15 AM",
          completed: true,
          icon: <FiCheckCircle className="w-5 h-5" />,
        },
        {
          status: "Delivered",
          location: "258 Birch Ct, Dhanmondi",
          date: "2024-02-08",
          time: "02:30 PM",
          completed: true,
          icon: <FiHome className="w-5 h-5" />,
          description:
            "Package delivered successfully. Signed by: Robert Taylor",
          current: true,
        },
      ],
    },
  };

  // Handle track order
  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError("Please enter an Order ID or Tracking Number");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const data =
        mockOrderData[trackingId] || mockOrderData[trackingId.toUpperCase()];

      if (data) {
        setOrderData(data);
        setError("");
      } else {
        setOrderData(null);
        setError(
          "Order not found. Please check your Order ID or Tracking Number.",
        );
      }
      setIsLoading(false);
    }, 1500);
  };

  // Load order if orderId from URL
  useEffect(() => {
    if (orderId) {
      setTrackingId(orderId);
      const data = mockOrderData[orderId];
      if (data) {
        setOrderData(data);
      }
    }
  }, [orderId]);

  // Get progress percentage
  const getProgress = () => {
    if (!orderData) return 0;
    const completed = orderData.trackingHistory.filter(
      (h) => h.completed,
    ).length;
    const total = orderData.trackingHistory.length;
    return (completed / total) * 100;
  };

  // Get current status color
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "in-transit":
      case "out-for-delivery":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your Order ID or Tracking Number to track your shipment
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <form
            onSubmit={handleTrackOrder}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g., #1234) or Tracking Number (e.g., TRK-2024-001)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <FiSearch className="w-5 h-5" />
                  <span>Track Order</span>
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <PulsingText text="Fetching order details..." size="lg" />
          </div>
        )}

        {/* Order Details */}
        {!isLoading && orderData && (
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      Order {orderData.orderId}
                    </h2>
                    <p className="text-blue-100">
                      Tracking: {orderData.trackingNumber}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      orderData.status === "delivered"
                        ? "bg-green-500"
                        : orderData.status === "in-transit"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    } text-white`}
                  >
                    {orderData.status
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-white h-full transition-all duration-1000 rounded-full"
                      style={{ width: `${getProgress()}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-100 mt-2">
                    {Math.round(getProgress())}% Complete
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiPackage className="w-5 h-5" />
                      Product Details
                    </h3>
                    <div className="flex items-start gap-4">
                      <img
                        src={orderData.productImage}
                        alt={orderData.product}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                          {orderData.product}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <p>Quantity: {orderData.quantity}</p>
                          <p>Size: {orderData.size}</p>
                          <p>Color: {orderData.color}</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                            ${orderData.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiMapPin className="w-5 h-5" />
                      Delivery Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <FiUser className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Customer
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {orderData.customer.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiMapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Delivery Address
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {orderData.destination}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiCalendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Estimated Delivery
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {new Date(
                              orderData.estimatedDelivery,
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      {orderData.deliveryDate && (
                        <div className="flex items-start gap-3">
                          <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              Delivered On
                            </p>
                            <p className="font-semibold text-green-600 dark:text-green-400">
                              {new Date(
                                orderData.deliveryDate,
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FiTruck className="w-6 h-6" />
                Tracking History
              </h3>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                {/* Timeline Items */}
                <div className="space-y-6">
                  {orderData.trackingHistory.map((item, index) => (
                    <div
                      key={index}
                      className="relative flex items-start gap-4"
                    >
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          item.completed
                            ? item.current
                              ? "bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900"
                              : "bg-green-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                        } z-10 transition-all duration-500`}
                      >
                        {item.icon}
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 pb-8 ${
                          item.current
                            ? "border-l-4 border-blue-500 pl-4 -ml-0.5"
                            : ""
                        }`}
                      >
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4
                                className={`font-bold ${
                                  item.completed
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-400 dark:text-gray-500"
                                }`}
                              >
                                {item.status}
                              </h4>
                              <p
                                className={`text-sm ${
                                  item.completed
                                    ? "text-gray-600 dark:text-gray-400"
                                    : "text-gray-400 dark:text-gray-500"
                                }`}
                              >
                                {item.location}
                              </p>
                            </div>
                            <div
                              className={`text-right text-sm ${
                                item.completed
                                  ? "text-gray-600 dark:text-gray-400"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            >
                              <p>{item.date}</p>
                              <p>{item.time}</p>
                            </div>
                          </div>
                          {item.description && (
                            <p
                              className={`text-sm mt-2 ${
                                item.completed
                                  ? "text-gray-600 dark:text-gray-400"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            >
                              {item.description}
                            </p>
                          )}
                          {item.current && (
                            <div className="mt-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                              <span className="text-sm font-semibold">
                                Current Status
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

            {/* Need Help Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Need Help?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    If you have any questions about your order or delivery, feel
                    free to contact us.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`tel:${orderData.customer.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:shadow-md transition"
                    >
                      <FiPhone className="w-4 h-4" />
                      <span>Call Support</span>
                    </a>
                    <a
                      href={`mailto:${orderData.customer.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:shadow-md transition"
                    >
                      <FiMail className="w-4 h-4" />
                      <span>Email Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/dashboard/my-orders")}
                className="flex-1 min-w-[200px] px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
              >
                View All Orders
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 min-w-[200px] px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center justify-center gap-2"
              >
                <FiDownload className="w-5 h-5" />
                Print Details
              </button>
            </div>
          </div>
        )}

        {/* Sample Tracking IDs (for testing) */}
        {!orderData && !isLoading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Try These Sample Orders:
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setTrackingId("#1234");
                  const e = { preventDefault: () => {} };
                  setTimeout(() => handleTrackOrder(e), 100);
                }}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition text-left"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  #1234
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Premium Cotton T-Shirt (In Transit)
                </p>
              </button>
              <button
                onClick={() => {
                  setTrackingId("TRK-2024-002");
                  const e = { preventDefault: () => {} };
                  setTimeout(() => handleTrackOrder(e), 100);
                }}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition text-left"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  TRK-2024-002
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Leather Jacket (Delivered)
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
