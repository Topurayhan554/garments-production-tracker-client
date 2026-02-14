import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FiSearch,
  FiEye,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDownload,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiPhone,
  FiMail,
  FiShoppingBag,
} from "react-icons/fi";
import { SkeletonTable } from "../../../components/Loading";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Mock orders data for buyer
  const mockOrders = [
    {
      id: "#1238",
      product: "Casual Polo Shirt",
      productImage:
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=100",
      quantity: 2,
      size: "M",
      color: "White",
      amount: 65.98,
      status: "delivered",
      orderDate: "2024-01-30",
      deliveryDate: "2024-02-06",
      estimatedDelivery: "2024-02-11",
      address: "654 Pine Ave, Uttara, Dhaka-1230",
      paymentMethod: "Rocket",
      paymentStatus: "paid",
      trackingNumber: "TRK-2024-004",
      notes: "Leave at reception",
    },
    {
      id: "#1237",
      product: "Winter Hoodie",
      productImage:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100",
      quantity: 1,
      size: "L",
      color: "Black",
      amount: 54.99,
      status: "shipped",
      orderDate: "2024-02-02",
      deliveryDate: null,
      estimatedDelivery: "2024-02-12",
      address: "321 Elm St, Banani, Dhaka-1213",
      paymentMethod: "Cash on Delivery",
      paymentStatus: "pending",
      trackingNumber: "TRK-2024-003",
      notes: "Call before delivery",
    },
    {
      id: "#1236",
      product: "Sports Jersey",
      productImage:
        "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=100",
      quantity: 3,
      size: "XL",
      color: "Red",
      amount: 119.97,
      status: "in-production",
      orderDate: "2024-02-02",
      deliveryDate: null,
      estimatedDelivery: "2024-02-08",
      address: "789 Oak Rd, Dhanmondi, Dhaka-1205",
      paymentMethod: "Nagad",
      paymentStatus: "paid",
      trackingNumber: null,
      notes: "",
    },
    {
      id: "#1234",
      product: "Premium Cotton T-Shirt",
      productImage:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
      quantity: 2,
      size: "L",
      color: "Navy Blue",
      amount: 51.98,
      status: "pending",
      orderDate: "2024-02-03",
      deliveryDate: null,
      estimatedDelivery: "2024-02-10",
      address: "123 Main St, Mirpur, Dhaka-1216",
      paymentMethod: "Cash on Delivery",
      paymentStatus: "pending",
      trackingNumber: null,
      notes: "Please deliver between 2-5 PM",
    },
    {
      id: "#1229",
      product: "Formal Business Shirt",
      productImage:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100",
      quantity: 1,
      size: "L",
      color: "Sky Blue",
      amount: 45.99,
      status: "cancelled",
      orderDate: "2024-01-29",
      deliveryDate: null,
      estimatedDelivery: null,
      address: "987 Maple Dr, Motijheel, Dhaka-1000",
      paymentMethod: "Cash on Delivery",
      paymentStatus: "refunded",
      trackingNumber: null,
      notes: "Cancelled due to unavailability",
    },
  ];

  const orderStatuses = [
    { id: "all", name: "All Orders" },
    { id: "pending", name: "Pending" },
    { id: "in-production", name: "In Production" },
    { id: "shipped", name: "Shipped" },
    { id: "delivered", name: "Delivered" },
    { id: "cancelled", name: "Cancelled" },
  ];

  // Load orders
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter orders
  const getFilteredOrders = () => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.product.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Handle view details
  const handleViewDetails = (order) => {
    setSelectedOrderDetails(order);
    setShowDetailsModal(true);
  };

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProduction: orders.filter((o) => o.status === "in-production").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalSpent: orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.amount, 0),
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          color:
            "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
          icon: <FiClock className="w-4 h-4" />,
        };
      case "in-production":
        return {
          color:
            "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
          icon: <FiPackage className="w-4 h-4" />,
        };
      case "shipped":
        return {
          color:
            "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
          icon: <FiTruck className="w-4 h-4" />,
        };
      case "delivered":
        return {
          color:
            "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
          icon: <FiCheckCircle className="w-4 h-4" />,
        };
      case "cancelled":
        return {
          color: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
          icon: <FiXCircle className="w-4 h-4" />,
        };
      default:
        return {
          color:
            "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
          icon: <FiClock className="w-4 h-4" />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <FiShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                <FiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pending}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Pending
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.inProduction}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Production
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
                <FiTruck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.shipped}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Shipped
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.delivered}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Delivered
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.cancelled}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Cancelled
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalSpent.toFixed(0)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Total Spent
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {orderStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Grid/List */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <SkeletonTable rows={5} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't placed any orders yet
            </p>
            <Link
              to="/all-products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <FiShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={order.productImage}
                          alt={order.product}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {order.product}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}
                            >
                              {statusInfo.icon}
                              {order.status
                                .split("-")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                                )
                                .join(" ")}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div>
                              <span className="font-semibold">Order ID:</span>{" "}
                              {order.id}
                            </div>
                            <div>
                              <span className="font-semibold">Qty:</span>{" "}
                              {order.quantity}
                            </div>
                            <div>
                              <span className="font-semibold">Size:</span>{" "}
                              {order.size}
                            </div>
                            <div>
                              <span className="font-semibold">Color:</span>{" "}
                              {order.color}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiCalendar className="inline w-4 h-4 mr-1" />
                            Ordered:{" "}
                            {new Date(order.orderDate).toLocaleDateString()}
                            {order.estimatedDelivery && (
                              <span className="ml-4">
                                <FiTruck className="inline w-4 h-4 mr-1" />
                                Est. Delivery:{" "}
                                {new Date(
                                  order.estimatedDelivery,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {order.trackingNumber && (
                            <div className="mt-2">
                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-mono">
                                <FiPackage className="w-4 h-4" />
                                {order.trackingNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${order.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.paymentStatus === "paid" ? (
                              <span className="text-green-600 dark:text-green-400">
                                ✓ Paid
                              </span>
                            ) : order.paymentStatus === "pending" ? (
                              <span className="text-yellow-600 dark:text-yellow-400">
                                ⏳ Pending
                              </span>
                            ) : (
                              <span className="text-red-600 dark:text-red-400">
                                ✗ Refunded
                              </span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                        >
                          <FiEye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Active Orders */}
                  {!["delivered", "cancelled"].includes(order.status) && (
                    <div className="px-6 pb-6">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            order.status === "pending"
                              ? "w-1/4 bg-yellow-500"
                              : order.status === "in-production"
                                ? "w-1/2 bg-blue-500"
                                : order.status === "shipped"
                                  ? "w-3/4 bg-indigo-500"
                                  : "w-full bg-green-500"
                          }`}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <span
                          className={
                            order.status === "pending" ? "font-bold" : ""
                          }
                        >
                          Pending
                        </span>
                        <span
                          className={
                            order.status === "in-production" ? "font-bold" : ""
                          }
                        >
                          Production
                        </span>
                        <span
                          className={
                            order.status === "shipped" ? "font-bold" : ""
                          }
                        >
                          Shipped
                        </span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
              <FiDownload className="w-4 h-4" />
              Download Receipt
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order Details {selectedOrderDetails.id}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Product Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiPackage className="w-5 h-5" />
                  Product Details
                </h3>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={selectedOrderDetails.productImage}
                    alt={selectedOrderDetails.product}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                      {selectedOrderDetails.product}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Quantity
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedOrderDetails.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Size</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedOrderDetails.size}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Color
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedOrderDetails.color}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Total Amount
                        </p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          ${selectedOrderDetails.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiTruck className="w-5 h-5" />
                  Order Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold mt-1 ${getStatusInfo(selectedOrderDetails.status).color}`}
                    >
                      {selectedOrderDetails.status
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </span>
                  </div>
                  {selectedOrderDetails.trackingNumber && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tracking Number
                      </p>
                      <p className="font-mono font-semibold text-blue-600 dark:text-blue-400 mt-1">
                        {selectedOrderDetails.trackingNumber}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Order Date
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white mt-1">
                      {new Date(
                        selectedOrderDetails.orderDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedOrderDetails.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Est. Delivery
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white mt-1">
                        {new Date(
                          selectedOrderDetails.estimatedDelivery,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiMapPin className="w-5 h-5" />
                  Delivery Address
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedOrderDetails.address}
                </p>
                {selectedOrderDetails.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Special Notes
                    </p>
                    <p className="text-gray-900 dark:text-white italic">
                      "{selectedOrderDetails.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiDollarSign className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment Method
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment Status
                    </p>
                    <p
                      className={`font-semibold ${
                        selectedOrderDetails.paymentStatus === "paid"
                          ? "text-green-600 dark:text-green-400"
                          : selectedOrderDetails.paymentStatus === "pending"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {selectedOrderDetails.paymentStatus
                        .charAt(0)
                        .toUpperCase() +
                        selectedOrderDetails.paymentStatus.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {selectedOrderDetails.trackingNumber && (
                <button className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center justify-center gap-2">
                  <FiTruck className="w-5 h-5" />
                  Track Order
                </button>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
