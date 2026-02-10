import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FiSearch,
  FiEye,
  FiTruck,
  FiCheckCircle,
  FiPackage,
  FiDownload,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiPhone,
  FiMail,
  FiClock,
} from "react-icons/fi";

import { SkeletonTable } from "../../../components/Loading";
import ButtonLoader from "../../../components/ButtonLoader";

const ApprovedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock approved orders data
  const mockOrders = [
    {
      id: "#1233",
      customer: "Mike Chen",
      customerEmail: "mike@example.com",
      phone: "+880 1234-567891",
      product: "Classic Denim Jacket",
      quantity: 1,
      size: "M",
      color: "Blue",
      amount: 89.99,
      status: "approved",
      productionStatus: "pending",
      approvedDate: "2024-02-03",
      estimatedDelivery: "2024-02-15",
      address: "456 Park Ave, Gulshan, Dhaka-1212",
      paymentMethod: "bKash",
      paymentStatus: "paid",
      notes: "Gift wrap requested",
      avatar: "https://i.pravatar.cc/100?img=13",
      trackingNumber: null,
    },
    {
      id: "#1227",
      customer: "Robert Taylor",
      customerEmail: "robert@example.com",
      phone: "+880 1234-567897",
      product: "Leather Jacket",
      quantity: 1,
      size: "L",
      color: "Brown",
      amount: 199.99,
      status: "approved",
      productionStatus: "in-progress",
      approvedDate: "2024-02-02",
      estimatedDelivery: "2024-02-14",
      address: "258 Birch Ct, Dhanmondi, Dhaka-1205",
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      notes: "",
      avatar: "https://i.pravatar.cc/100?img=15",
      trackingNumber: "TRK-2024-001",
    },
    {
      id: "#1226",
      customer: "Anna Martinez",
      customerEmail: "anna@example.com",
      phone: "+880 1234-567896",
      product: "Designer T-Shirt",
      quantity: 4,
      size: "L",
      color: "Black",
      amount: 115.96,
      status: "approved",
      productionStatus: "completed",
      approvedDate: "2024-02-01",
      estimatedDelivery: "2024-02-13",
      address: "147 Cedar Ln, Banani, Dhaka-1213",
      paymentMethod: "Nagad",
      paymentStatus: "paid",
      notes: "",
      avatar: "https://i.pravatar.cc/100?img=20",
      trackingNumber: "TRK-2024-002",
    },
    {
      id: "#1225",
      customer: "David Lee",
      customerEmail: "david@example.com",
      phone: "+880 1234-567893",
      product: "Winter Hoodie",
      quantity: 1,
      size: "L",
      color: "Black",
      amount: 54.99,
      status: "approved",
      productionStatus: "ready-to-ship",
      approvedDate: "2024-01-31",
      estimatedDelivery: "2024-02-12",
      address: "321 Elm St, Banani, Dhaka-1213",
      paymentMethod: "Cash on Delivery",
      paymentStatus: "pending",
      notes: "Call before delivery",
      avatar: "https://i.pravatar.cc/100?img=8",
      trackingNumber: "TRK-2024-003",
    },
    {
      id: "#1224",
      customer: "Lisa Park",
      customerEmail: "lisa@example.com",
      phone: "+880 1234-567894",
      product: "Casual Polo Shirt",
      quantity: 2,
      size: "M",
      color: "White",
      amount: 65.98,
      status: "approved",
      productionStatus: "shipped",
      approvedDate: "2024-01-30",
      estimatedDelivery: "2024-02-11",
      address: "654 Pine Ave, Uttara, Dhaka-1230",
      paymentMethod: "Rocket",
      paymentStatus: "paid",
      notes: "Leave at reception",
      avatar: "https://i.pravatar.cc/100?img=9",
      trackingNumber: "TRK-2024-004",
    },
  ];

  const productionStatuses = [
    { id: "all", name: "All Status" },
    { id: "pending", name: "Pending Production" },
    { id: "in-progress", name: "In Progress" },
    { id: "completed", name: "Production Complete" },
    { id: "ready-to-ship", name: "Ready to Ship" },
    { id: "shipped", name: "Shipped" },
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
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.product.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (order) => order.productionStatus === selectedStatus,
      );
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // Handle select order
  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Handle view details
  const handleViewDetails = (order) => {
    setSelectedOrderDetails(order);
    setShowDetailsModal(true);
  };

  // Handle status update
  const handleStatusUpdateClick = (order) => {
    setOrderToUpdate(order);
    setNewStatus(order.productionStatus);
    setShowStatusModal(true);
  };

  const handleStatusUpdateConfirm = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setOrders(
      orders.map((o) =>
        o.id === orderToUpdate.id ? { ...o, productionStatus: newStatus } : o,
      ),
    );

    setShowStatusModal(false);
    setOrderToUpdate(null);
    setIsProcessing(false);
  };

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.productionStatus === "pending").length,
    inProgress: orders.filter((o) => o.productionStatus === "in-progress")
      .length,
    completed: orders.filter((o) => o.productionStatus === "completed").length,
    readyToShip: orders.filter((o) => o.productionStatus === "ready-to-ship")
      .length,
    shipped: orders.filter((o) => o.productionStatus === "shipped").length,
    totalValue: orders.reduce((sum, o) => sum + o.amount, 0),
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
      case "in-progress":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      case "completed":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
      case "ready-to-ship":
        return "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400";
      case "shipped":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Approved Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track approved orders in production
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                  {stats.inProgress}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completed}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Completed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.readyToShip}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Ready
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <FiTruck className="w-5 h-5 text-green-600 dark:text-green-400" />
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
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID, customer, or product..."
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
              {productionStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <SkeletonTable rows={5} />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No approved orders found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedOrders.length === filteredOrders.length
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Production Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Delivery Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.avatar}
                            alt={order.customer}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {order.customer}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {order.product}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {order.quantity} • {order.size}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${order.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusUpdateClick(order)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition hover:scale-105 ${getStatusColor(order.productionStatus)}`}
                        >
                          {order.productionStatus
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdateClick(order)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                            title="Update Status"
                          >
                            <FiTruck className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredOrders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredOrders.length} of {orders.length} approved
                orders
              </p>

              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
                <FiDownload className="w-4 h-4" />
                Export
              </button>
            </div>
          )}
        </div>
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
              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiUser className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Name
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.customer}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.customerEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment Method
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiPackage className="w-5 h-5" />
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Product
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.product}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Size
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.size}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Color
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.color}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Amount
                    </p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${selectedOrderDetails.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Production Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(selectedOrderDetails.productionStatus)}`}
                    >
                      {selectedOrderDetails.productionStatus
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiMapPin className="w-5 h-5" />
                  Delivery Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Address
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedOrderDetails.address}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Approved Date
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(
                          selectedOrderDetails.approvedDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Est. Delivery
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(
                          selectedOrderDetails.estimatedDelivery,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {selectedOrderDetails.trackingNumber && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tracking Number
                      </p>
                      <p className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {selectedOrderDetails.trackingNumber}
                      </p>
                    </div>
                  )}
                  {selectedOrderDetails.notes && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Special Notes
                      </p>
                      <p className="text-gray-900 dark:text-white italic">
                        "{selectedOrderDetails.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleStatusUpdateClick(selectedOrderDetails);
                }}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FiTruck className="w-5 h-5" />
                Update Production Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Update Production Status
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Update status for order "{orderToUpdate?.id}"
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Production Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {productionStatuses
                  .filter((s) => s.id !== "all")
                  .map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdateConfirm}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isProcessing ? (
                  <ButtonLoader text="Updating..." />
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedOrders;
