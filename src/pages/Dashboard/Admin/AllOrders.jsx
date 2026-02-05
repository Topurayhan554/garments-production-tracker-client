import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTruck,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiFileText,
} from "react-icons/fi";
import { SkeletonTable } from "../../../components/Loading";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Mock orders data - Replace with actual API call
  const mockOrders = [
    {
      id: "#1234",
      customer: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      product: "Premium Cotton T-Shirt",
      quantity: 2,
      amount: 51.98,
      status: "pending",
      paymentStatus: "paid",
      date: "2024-02-03",
      deliveryDate: "2024-02-10",
      address: "123 Main St, Dhaka",
      phone: "+880 1234-567890",
    },
    {
      id: "#1233",
      customer: "Mike Chen",
      customerEmail: "mike@example.com",
      product: "Classic Denim Jacket",
      quantity: 1,
      amount: 89.99,
      status: "approved",
      paymentStatus: "paid",
      date: "2024-02-02",
      deliveryDate: "2024-02-09",
      address: "456 Park Ave, Dhaka",
      phone: "+880 1234-567891",
    },
    {
      id: "#1232",
      customer: "Emily Rodriguez",
      customerEmail: "emily@example.com",
      product: "Sports Jersey",
      quantity: 3,
      amount: 119.97,
      status: "in-production",
      paymentStatus: "paid",
      date: "2024-02-01",
      deliveryDate: "2024-02-08",
      address: "789 Oak Rd, Dhaka",
      phone: "+880 1234-567892",
    },
    {
      id: "#1231",
      customer: "David Lee",
      customerEmail: "david@example.com",
      product: "Winter Hoodie",
      quantity: 1,
      amount: 54.99,
      status: "shipped",
      paymentStatus: "paid",
      date: "2024-01-31",
      deliveryDate: "2024-02-07",
      address: "321 Elm St, Dhaka",
      phone: "+880 1234-567893",
    },
    {
      id: "#1230",
      customer: "Lisa Park",
      customerEmail: "lisa@example.com",
      product: "Casual Polo Shirt",
      quantity: 2,
      amount: 65.98,
      status: "delivered",
      paymentStatus: "paid",
      date: "2024-01-30",
      deliveryDate: "2024-02-06",
      address: "654 Pine Ave, Dhaka",
      phone: "+880 1234-567894",
    },
    {
      id: "#1229",
      customer: "James Wilson",
      customerEmail: "james@example.com",
      product: "Formal Business Shirt",
      quantity: 1,
      amount: 45.99,
      status: "cancelled",
      paymentStatus: "refunded",
      date: "2024-01-29",
      deliveryDate: null,
      address: "987 Maple Dr, Dhaka",
      phone: "+880 1234-567895",
    },
    {
      id: "#1228",
      customer: "Anna Martinez",
      customerEmail: "anna@example.com",
      product: "Designer T-Shirt",
      quantity: 4,
      amount: 115.96,
      status: "pending",
      paymentStatus: "pending",
      date: "2024-01-28",
      deliveryDate: "2024-02-05",
      address: "147 Cedar Ln, Dhaka",
      phone: "+880 1234-567896",
    },
    {
      id: "#1227",
      customer: "Robert Taylor",
      customerEmail: "robert@example.com",
      product: "Leather Jacket",
      quantity: 1,
      amount: 199.99,
      status: "approved",
      paymentStatus: "paid",
      date: "2024-01-27",
      deliveryDate: "2024-02-04",
      address: "258 Birch Ct, Dhaka",
      phone: "+880 1234-567897",
    },
  ];

  const statuses = [
    { id: "all", name: "All Orders", color: "gray" },
    { id: "pending", name: "Pending", color: "yellow" },
    { id: "approved", name: "Approved", color: "blue" },
    { id: "in-production", name: "In Production", color: "purple" },
    { id: "shipped", name: "Shipped", color: "indigo" },
    { id: "delivered", name: "Delivered", color: "green" },
    { id: "cancelled", name: "Cancelled", color: "red" },
  ];

  // Load orders
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter orders
  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.product.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
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

  // Handle status change
  const handleStatusChangeClick = (order) => {
    setOrderToUpdate(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleStatusChangeConfirm = () => {
    // TODO: Implement actual status change API call
    setOrders(
      orders.map((o) =>
        o.id === orderToUpdate.id ? { ...o, status: newStatus } : o,
      ),
    );
    setShowStatusModal(false);
    setOrderToUpdate(null);
    setNewStatus("");
  };

  // Handle delete
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: Implement actual delete API call
    setOrders(orders.filter((o) => o.id !== orderToDelete.id));
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedOrders.length} selected orders?`)) {
      setOrders(orders.filter((o) => !selectedOrders.includes(o.id)));
      setSelectedOrders([]);
    }
  };

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved").length,
    inProduction: orders.filter((o) => o.status === "in-production").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.amount, 0),
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
      case "approved":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      case "in-production":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
      case "shipped":
        return "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400";
      case "delivered":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
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
            All Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
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
                <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.approved}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Approved
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
                  ${stats.totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Revenue
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
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

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2"
              >
                <FiTrash2 className="w-5 h-5" />
                Delete ({selectedOrders.length})
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <SkeletonTable rows={8} />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No orders found
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
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Status
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
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {order.customer}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.customerEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {order.product}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {order.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${order.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusChangeClick(order)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition hover:scale-105 ${getStatusColor(order.status)}`}
                        >
                          {order.status
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/order/${order.id.replace("#", "")}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/dashboard/edit-order/${order.id.replace("#", "")}`}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                            title="Edit"
                          >
                            <FiEdit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(order)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {filteredOrders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>

              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
                <FiDownload className="w-4 h-4" />
                Export
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Update Order Status
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Select a new status for order "{orderToUpdate?.id}"
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses
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
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChangeConfirm}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Delete Order?
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete order "{orderToDelete?.id}"? This
              action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
