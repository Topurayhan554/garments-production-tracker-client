import React, { useState, useEffect } from "react";
import {
  FiSearch,
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
  FiUser,
  FiMapPin,
  FiSave,
  FiX,
} from "react-icons/fi";
import { SkeletonTable } from "../../../components/Loading";
import ButtonLoader from "../../../components/ButtonLoader";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // View modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const axiosSecure = useAxiosSecure();

  const statuses = [
    { id: "all", name: "All Orders" },
    { id: "pending", name: "Pending" },
    { id: "confirmed", name: "Confirmed" },
    { id: "in-production", name: "In Production" },
    { id: "quality-check", name: "Quality Check" },
    { id: "packed", name: "Packed" },
    { id: "in-transit", name: "In Transit" },
    { id: "out-for-delivery", name: "Out for Delivery" },
    { id: "delivered", name: "Delivered" },
    { id: "cancelled", name: "Cancelled" },
  ];

  // Page title
  useEffect(() => {
    document.title = "Dashboard - All Orders | GarmentTrack";
    return () => {
      document.title = "GarmentTrack";
    };
  }, []);

  // ✅ Fetch all orders from DB
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axiosSecure.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      !searchQuery ||
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    inProduction: orders.filter((o) => o.status === "in-production").length,
    inTransit: orders.filter((o) =>
      ["in-transit", "out-for-delivery"].includes(o.status),
    ).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
  };

  // ---- SELECT ----
  const handleSelectAll = (e) =>
    setSelectedOrders(e.target.checked ? filteredOrders.map((o) => o._id) : []);

  const handleSelectOrder = (id) =>
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  // ---- VIEW ----
  const handleView = (order) => {
    setViewOrder(order);
    setShowViewModal(true);
  };

  // ---- EDIT ----
  const handleEditClick = (order) => {
    setEditOrder(order);
    setEditForm({
      productName: order.productName || "",
      quantity: order.quantity || "",
      size: order.size || "",
      color: order.color || "",
      total: order.total || "",
      status: order.status || "pending",
      estimatedDelivery: order.estimatedDelivery
        ? new Date(order.estimatedDelivery).toISOString().split("T")[0]
        : "",
      notes: order.notes || "",
      "customer.name": order.customer?.name || "",
      "customer.email": order.customer?.email || "",
      "customer.phone": order.customer?.phone || "",
      "deliveryAddress.street": order.deliveryAddress?.street || "",
      "deliveryAddress.area": order.deliveryAddress?.area || "",
      "deliveryAddress.city": order.deliveryAddress?.city || "",
      "deliveryAddress.zip": order.deliveryAddress?.zip || "",
    });
    setShowEditModal(true);
  };

  // ✅ Save edited order
  const handleEditSave = async () => {
    setIsProcessing(true);
    try {
      // Build nested update object
      const updateData = {
        productName: editForm.productName,
        quantity: Number(editForm.quantity),
        size: editForm.size,
        color: editForm.color,
        total: Number(editForm.total),
        status: editForm.status,
        notes: editForm.notes,
        estimatedDelivery: editForm.estimatedDelivery || null,
        customer: {
          name: editForm["customer.name"],
          email: editForm["customer.email"],
          phone: editForm["customer.phone"],
        },
        deliveryAddress: {
          street: editForm["deliveryAddress.street"],
          area: editForm["deliveryAddress.area"],
          city: editForm["deliveryAddress.city"],
          zip: editForm["deliveryAddress.zip"],
        },
      };

      const res = await axiosSecure.patch(
        `/orders/${editOrder._id}`,
        updateData,
      );

      if (res.data.success) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o._id === editOrder._id ? res.data.data : o)),
        );
        toast.success(`Order ${editOrder.orderId} updated! ✏️`);
        setShowEditModal(false);
        setEditOrder(null);
      }
    } catch (error) {
      console.error("Edit order error:", error);
      toast.error(error.response?.data?.message || "Failed to update order");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---- DELETE ----
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  // ✅ Delete single order
  const handleDeleteConfirm = async () => {
    setIsProcessing(true);
    try {
      const res = await axiosSecure.delete(`/orders/${orderToDelete._id}`);
      if (res.data.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderToDelete._id));
        toast.success(`Order ${orderToDelete.orderId} deleted! 🗑️`);
        setShowDeleteModal(false);
        setOrderToDelete(null);
      }
    } catch (error) {
      console.error("Delete order error:", error);
      toast.error(error.response?.data?.message || "Failed to delete order");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Bulk delete
  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Delete ${selectedOrders.length} selected orders? This cannot be undone.`,
      )
    )
      return;
    setIsProcessing(true);
    try {
      // Delete one by one (or add a bulk-delete endpoint)
      await Promise.all(
        selectedOrders.map((id) => axiosSecure.delete(`/orders/${id}`)),
      );
      setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o._id)));
      toast.success(`${selectedOrders.length} orders deleted!`);
      setSelectedOrders([]);
    } catch (error) {
      toast.error("Some orders failed to delete");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---- HELPERS ----
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
      case "confirmed":
        return "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400";
      case "in-production":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      case "quality-check":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
      case "packed":
        return "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400";
      case "in-transit":
      case "out-for-delivery":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      case "delivered":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  const formatStatus = (status) =>
    status
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "";

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
          {[
            {
              label: "Total",
              value: stats.total,
              icon: <FiShoppingBag className="w-5 h-5" />,
              color: "blue",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: <FiClock className="w-5 h-5" />,
              color: "yellow",
            },
            {
              label: "Confirmed",
              value: stats.confirmed,
              icon: <FiCheckCircle className="w-5 h-5" />,
              color: "cyan",
            },
            {
              label: "Production",
              value: stats.inProduction,
              icon: <FiPackage className="w-5 h-5" />,
              color: "purple",
            },
            {
              label: "Shipping",
              value: stats.inTransit,
              icon: <FiTruck className="w-5 h-5" />,
              color: "indigo",
            },
            {
              label: "Delivered",
              value: stats.delivered,
              icon: <FiCheckCircle className="w-5 h-5" />,
              color: "green",
            },
            {
              label: "Cancelled",
              value: stats.cancelled,
              icon: <FiXCircle className="w-5 h-5" />,
              color: "red",
            },
            {
              label: "Revenue",
              value: `$${stats.totalRevenue.toFixed(0)}`,
              icon: <FiDollarSign className="w-5 h-5" />,
              color: "emerald",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center
                  ${
                    s.color === "yellow"
                      ? "bg-yellow-100 text-yellow-600"
                      : s.color === "cyan"
                        ? "bg-cyan-100 text-cyan-600"
                        : s.color === "purple"
                          ? "bg-purple-100 text-purple-600"
                          : s.color === "indigo"
                            ? "bg-indigo-100 text-indigo-600"
                            : s.color === "green"
                              ? "bg-green-100 text-green-600"
                              : s.color === "red"
                                ? "bg-red-100 text-red-600"
                                : s.color === "emerald"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {s.icon}
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {s.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {selectedOrders.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isProcessing}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
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
                {searchQuery || selectedStatus !== "all"
                  ? "Try adjusting your search or filter"
                  : "No orders yet"}
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
                    {[
                      "Order ID",
                      "Customer",
                      "Product",
                      "Qty",
                      "Amount",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        {h}
                      </th>
                    ))}
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
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {order.customer?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.customer?.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.size} • {order.color}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        ${(order.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(order.status)}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(order)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                            title="Edit Order"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(order)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Delete Order"
                          >
                            <FiTrash2 className="w-4 h-4" />
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
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
              <button
                onClick={() => toast.info("Export feature coming soon!")}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
              >
                <FiDownload className="w-4 h-4" /> Export
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===================== VIEW MODAL ===================== */}
      {showViewModal && viewOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order Details
                </h2>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  {viewOrder.orderId}
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Status Banner */}
              <div
                className={`px-4 py-3 rounded-xl text-center font-semibold text-sm ${getStatusColor(viewOrder.status)}`}
              >
                Status: {formatStatus(viewOrder.status)}
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiUser className="w-4 h-4" /> Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {viewOrder.customer?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {viewOrder.customer?.email || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {viewOrder.customer?.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {viewOrder.paymentMethod || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiPackage className="w-4 h-4" /> Product Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Product</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {viewOrder.productName || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {viewOrder.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Size</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {viewOrder.size || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Color</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {viewOrder.color || "—"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${(viewOrder.total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiMapPin className="w-4 h-4" /> Delivery Information
                </h3>
                <div className="text-sm space-y-2">
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {[
                        viewOrder.deliveryAddress?.street,
                        viewOrder.deliveryAddress?.area,
                        viewOrder.deliveryAddress?.city,
                        viewOrder.deliveryAddress?.zip,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(viewOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Est. Delivery</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {viewOrder.estimatedDelivery
                          ? new Date(
                              viewOrder.estimatedDelivery,
                            ).toLocaleDateString()
                          : "TBD"}
                      </p>
                    </div>
                  </div>
                  {viewOrder.trackingNumber && (
                    <div>
                      <p className="text-gray-500">Tracking #</p>
                      <p className="font-mono font-medium text-blue-600 dark:text-blue-400">
                        {viewOrder.trackingNumber}
                      </p>
                    </div>
                  )}
                  {viewOrder.notes && (
                    <div>
                      <p className="text-gray-500">Notes</p>
                      <p className="italic text-gray-900 dark:text-white">
                        "{viewOrder.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(viewOrder);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FiEdit className="w-4 h-4" /> Edit Order
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleDeleteClick(viewOrder);
                }}
                className="px-4 py-3 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EDIT MODAL ===================== */}
      {showEditModal && editOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Order
                </h2>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  {editOrder.orderId}
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiUser className="w-4 h-4" /> Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: "customer.name", label: "Name" },
                    { key: "customer.email", label: "Email", type: "email" },
                    { key: "customer.phone", label: "Phone" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {f.label}
                      </label>
                      <input
                        type={f.type || "text"}
                        value={editForm[f.key] || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, [f.key]: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiPackage className="w-4 h-4" /> Product Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Product Name
                    </label>
                    <input
                      value={editForm.productName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          productName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {[
                    { key: "quantity", label: "Quantity", type: "number" },
                    { key: "size", label: "Size" },
                    { key: "color", label: "Color" },
                    { key: "total", label: "Total ($)", type: "number" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {f.label}
                      </label>
                      <input
                        type={f.type || "text"}
                        value={editForm[f.key] || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, [f.key]: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses
                        .filter((s) => s.id !== "all")
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Est. Delivery Date
                    </label>
                    <input
                      type="date"
                      value={editForm.estimatedDelivery || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          estimatedDelivery: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiMapPin className="w-4 h-4" /> Delivery Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      key: "deliveryAddress.street",
                      label: "Street",
                      full: true,
                    },
                    { key: "deliveryAddress.area", label: "Area" },
                    { key: "deliveryAddress.city", label: "City" },
                    { key: "deliveryAddress.zip", label: "ZIP Code" },
                  ].map((f) => (
                    <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {f.label}
                      </label>
                      <input
                        value={editForm[f.key] || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, [f.key]: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Special Notes
                </label>
                <textarea
                  value={editForm.notes || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Any special instructions..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <ButtonLoader text="Saving..." />
                ) : (
                  <>
                    <FiSave className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== DELETE MODAL ===================== */}
      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Delete Order?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
              Are you sure you want to delete order{" "}
              <span className="font-semibold text-red-600">
                "{orderToDelete.orderId}"
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Customer: {orderToDelete.customer?.name} • $
              {(orderToDelete.total || 0).toFixed(2)}
            </p>
            <p className="text-xs text-red-500 text-center mb-6 font-medium">
              ⚠️ This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setOrderToDelete(null);
                }}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isProcessing ? (
                  <ButtonLoader text="Deleting..." />
                ) : (
                  "Delete Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
