import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDownload,
  FiUser,
  FiPackage,
  FiDollarSign,
  FiMapPin,
} from "react-icons/fi";
import ButtonLoader from "../../../components/ButtonLoader";
import { SkeletonTable } from "../../../components/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import { toast } from "react-toastify";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [orderToProcess, setOrderToProcess] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const axiosSecure = useAxiosSecure(); // ✅ Initialize axios

  // Rejection reasons
  const rejectReasons = [
    "Out of stock",
    "Invalid delivery address",
    "Payment verification failed",
    "Product discontinued",
    "Duplicate order",
    "Suspicious activity",
    "Other reason",
  ];

  // Page title
  useEffect(() => {
    document.title = "Dashboard - Pending Orders | GarmentTrack";
    return () => {
      document.title = "GarmentTrack";
    };
  }, []);

  // ✅ Load orders from database
  useEffect(() => {
    const fetchPendingOrders = async () => {
      setIsLoading(true);
      try {
        // Fetch only pending orders
        const res = await axiosSecure.get("/orders?status=pending");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
        toast.error("Failed to load pending orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingOrders();
  }, [axiosSecure]);

  // Filter orders by search query
  const filteredOrders = orders.filter(
    (o) =>
      !searchQuery ||
      o.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate stats
  const stats = {
    total: orders.length,
    totalValue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    avgValue:
      orders.length > 0
        ? orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length
        : 0,
  };

  // Select all/none
  const handleSelectAll = (e) =>
    setSelectedOrders(e.target.checked ? filteredOrders.map((o) => o._id) : []);

  // Toggle single selection
  const handleSelectOrder = (id) =>
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  // Open approve modal
  const handleApproveClick = (order) => {
    setOrderToProcess(order);
    setShowApproveModal(true);
  };

  //  Approve single order - API call
  const handleApproveConfirm = async () => {
    setIsProcessing(true);

    try {
      const res = await axiosSecure.patch(
        `/orders/${orderToProcess._id}/status`,
        {
          status: "confirmed",
          confirmedAt: new Date(),
        },
      );

      if (res.data.success) {
        // Remove from local state
        setOrders((prev) => prev.filter((o) => o._id !== orderToProcess._id));
        toast.success(`Order ${orderToProcess.orderId} approved! ✅`);
        setShowApproveModal(false);
        setOrderToProcess(null);
      }
    } catch (error) {
      console.error("Approve order error:", error);
      toast.error(error.response?.data?.message || "Failed to approve order");
    } finally {
      setIsProcessing(false);
    }
  };

  // Open reject modal
  const handleRejectClick = (order) => {
    setOrderToProcess(order);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // Reject single order - API call
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      toast.warning("Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await axiosSecure.patch(
        `/orders/${orderToProcess._id}/status`,
        {
          status: "cancelled",
          cancelReason: rejectReason,
          cancelledAt: new Date(),
          cancelledBy: "admin",
        },
      );

      if (res.data.success) {
        // Remove from local state
        setOrders((prev) => prev.filter((o) => o._id !== orderToProcess._id));
        toast.success(`Order ${orderToProcess.orderId} rejected! 🚫`);
        setShowRejectModal(false);
        setOrderToProcess(null);
        setRejectReason("");
      }
    } catch (error) {
      console.error("Reject order error:", error);
      toast.error(error.response?.data?.message || "Failed to reject order");
    } finally {
      setIsProcessing(false);
    }
  };

  //Bulk approve orders
  const handleBulkApprove = async () => {
    if (selectedOrders.length === 0) return;

    if (!window.confirm(`Approve ${selectedOrders.length} orders?`)) return;

    setIsProcessing(true);

    try {
      // Call bulk approve API
      const res = await axiosSecure.post("/orders/bulk-approve", {
        orderIds: selectedOrders,
      });

      if (res.data.success) {
        // Remove approved orders from local state
        setOrders((prev) =>
          prev.filter((o) => !selectedOrders.includes(o._id)),
        );
        toast.success(`${res.data.approvedCount} orders approved! ✅`);
        setSelectedOrders([]);
      }
    } catch (error) {
      console.error("Bulk approve error:", error);
      toast.error(error.response?.data?.message || "Failed to approve orders");
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk reject orders
  const handleBulkReject = async () => {
    if (selectedOrders.length === 0) return;

    const reason = window.prompt(
      `Reject ${selectedOrders.length} orders?\n\nProvide reason:`,
    );

    if (!reason || !reason.trim()) {
      toast.warning("Rejection cancelled - no reason provided");
      return;
    }

    setIsProcessing(true);

    try {
      // Call bulk reject API
      const res = await axiosSecure.post("/orders/bulk-reject", {
        orderIds: selectedOrders,
        cancelReason: reason,
      });

      if (res.data.success) {
        // Remove rejected orders from local state
        setOrders((prev) =>
          prev.filter((o) => !selectedOrders.includes(o._id)),
        );
        toast.success(`${res.data.rejectedCount} orders rejected! 🚫`);
        setSelectedOrders([]);
      }
    } catch (error) {
      console.error("Bulk reject error:", error);
      toast.error(error.response?.data?.message || "Failed to reject orders");
    } finally {
      setIsProcessing(false);
    }
  };

  // View order details
  const handleViewDetails = (order) => {
    setSelectedOrderDetails(order);
    setShowDetailsModal(true);
  };

  const state = [
    {
      label: "Pending Orders",
      value: stats.total,
      icon: <FiClock className="w-6 h-6" />,
      color: "yellow",
    },
    {
      label: "Total Value",
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: "green",
    },
    {
      label: "Avg Order Value",
      value: `$${stats.avgValue.toFixed(2)}`,
      icon: <FiPackage className="w-6 h-6" />,
      color: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Pending Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {state.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === "yellow"
                      ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                      : stat.color === "green"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                        : "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Bulk Actions */}
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
            {selectedOrders.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleBulkApprove}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiCheckCircle className="w-5 h-5" />
                  Approve ({selectedOrders.length})
                </button>
                <button
                  onClick={handleBulkReject}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiXCircle className="w-5 h-5" />
                  Reject ({selectedOrders.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <SkeletonTable rows={6} />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Pending Orders
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? "No orders match your search"
                  : "All orders have been processed!"}
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
                          selectedOrders.length === filteredOrders.length &&
                          filteredOrders.length > 0
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
                      Qty
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {order.orderId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {order.customer?.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.customer?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {order.productName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.size} • {order.color}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {order.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${(order.total || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(
                          order.orderDate || order.createdAt,
                        ).toLocaleDateString()}
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
                            onClick={() => handleApproveClick(order)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                            title="Approve"
                          >
                            <FiCheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRejectClick(order)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Reject"
                          >
                            <FiXCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {filteredOrders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
              <button
                onClick={() => toast.info("Export feature coming soon!")}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
              >
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
                Order {selectedOrderDetails.orderId}
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
                  Customer Info
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Name
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.customer?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.customer?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.customer?.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment
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
                      {selectedOrderDetails.productName}
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
                      Total
                    </p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${(selectedOrderDetails.total || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Date
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(
                        selectedOrderDetails.orderDate ||
                          selectedOrderDetails.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiMapPin className="w-5 h-5" />
                  Delivery Address
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedOrderDetails.deliveryAddress?.street},{" "}
                  {selectedOrderDetails.deliveryAddress?.area},{" "}
                  {selectedOrderDetails.deliveryAddress?.city}
                  {selectedOrderDetails.deliveryAddress?.zip &&
                    ` - ${selectedOrderDetails.deliveryAddress.zip}`}
                </p>
                {selectedOrderDetails.notes && (
                  <div className="mt-4">
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

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleApproveClick(selectedOrderDetails);
                }}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <FiCheckCircle className="w-5 h-5" />
                Approve
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleRejectClick(selectedOrderDetails);
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <FiXCircle className="w-5 h-5" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && orderToProcess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Approve Order?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Approve order "{orderToProcess.orderId}" for{" "}
              {orderToProcess.customer?.name}?
              <br />
              <span className="font-semibold">
                Amount: ${(orderToProcess.total || 0).toFixed(2)}
              </span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setOrderToProcess(null);
                }}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveConfirm}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isProcessing ? (
                  <ButtonLoader text="Approving..." />
                ) : (
                  "Approve"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && orderToProcess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiXCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Reject Order?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Provide reason for rejecting "{orderToProcess.orderId}"
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Rejection Reason *
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
              >
                <option value="">Select a reason</option>
                {rejectReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>

              {rejectReason === "Other reason" && (
                <textarea
                  placeholder="Please specify the reason..."
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setOrderToProcess(null);
                  setRejectReason("");
                }}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={isProcessing || !rejectReason}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? <ButtonLoader text="Rejecting..." /> : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
