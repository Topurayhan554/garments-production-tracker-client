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
import { ButtonLoader } from "../../../components/ButtonLoader";
import { SkeletonTable } from "../../../components/Loading";

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

  const mockOrders = [
    {
      id: "#1234",
      customer: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      phone: "+880 1234-567890",
      product: "Premium Cotton T-Shirt",
      quantity: 2,
      size: "L",
      color: "Navy Blue",
      amount: 51.98,
      date: "2024-02-03",
      address: "123 Main St, Mirpur, Dhaka-1216",
      paymentMethod: "Cash on Delivery",
      notes: "Please deliver between 2-5 PM",
      avatar: "https://i.pravatar.cc/100?img=5",
    },
    {
      id: "#1235",
      customer: "Mike Chen",
      customerEmail: "mike@example.com",
      phone: "+880 1234-567891",
      product: "Classic Denim Jacket",
      quantity: 1,
      size: "M",
      color: "Blue",
      amount: 89.99,
      date: "2024-02-03",
      address: "456 Park Ave, Gulshan, Dhaka-1212",
      paymentMethod: "bKash",
      notes: "Gift wrap requested",
      avatar: "https://i.pravatar.cc/100?img=13",
    },
    {
      id: "#1236",
      customer: "Emily Rodriguez",
      customerEmail: "emily@example.com",
      phone: "+880 1234-567892",
      product: "Sports Jersey",
      quantity: 3,
      size: "XL",
      color: "Red",
      amount: 119.97,
      date: "2024-02-02",
      address: "789 Oak Rd, Dhanmondi, Dhaka-1205",
      paymentMethod: "Nagad",
      notes: "",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: "#1237",
      customer: "David Lee",
      customerEmail: "david@example.com",
      phone: "+880 1234-567893",
      product: "Winter Hoodie",
      quantity: 1,
      size: "L",
      color: "Black",
      amount: 54.99,
      date: "2024-02-02",
      address: "321 Elm St, Banani, Dhaka-1213",
      paymentMethod: "Cash on Delivery",
      notes: "Call before delivery",
      avatar: "https://i.pravatar.cc/100?img=8",
    },
    {
      id: "#1238",
      customer: "Lisa Park",
      customerEmail: "lisa@example.com",
      phone: "+880 1234-567894",
      product: "Casual Polo Shirt",
      quantity: 2,
      size: "M",
      color: "White",
      amount: 65.98,
      date: "2024-02-01",
      address: "654 Pine Ave, Uttara, Dhaka-1230",
      paymentMethod: "Rocket",
      notes: "Leave at reception",
      avatar: "https://i.pravatar.cc/100?img=9",
    },
    {
      id: "#1239",
      customer: "James Wilson",
      customerEmail: "james@example.com",
      phone: "+880 1234-567895",
      product: "Formal Business Shirt",
      quantity: 1,
      size: "L",
      color: "Sky Blue",
      amount: 45.99,
      date: "2024-02-01",
      address: "987 Maple Dr, Motijheel, Dhaka-1000",
      paymentMethod: "Cash on Delivery",
      notes: "Urgent delivery needed",
      avatar: "https://i.pravatar.cc/100?img=15",
    },
  ];

  // title
  useEffect(() => {
    document.title = "Dashboard - Pending Orders | GarmentTrack";

    return () => {
      document.title = "GarmentTrack";
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = orders.filter(
    (o) =>
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.product.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: orders.length,
    totalValue: orders.reduce((sum, o) => sum + o.amount, 0),
    avgValue:
      orders.length > 0
        ? orders.reduce((sum, o) => sum + o.amount, 0) / orders.length
        : 0,
  };

  const handleSelectAll = (e) =>
    setSelectedOrders(e.target.checked ? filteredOrders.map((o) => o.id) : []);
  const handleSelectOrder = (id) =>
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const handleApproveClick = (order) => {
    setOrderToProcess(order);
    setShowApproveModal(true);
  };
  const handleApproveConfirm = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setOrders(orders.filter((o) => o.id !== orderToProcess.id));
    setShowApproveModal(false);
    setOrderToProcess(null);
    setIsProcessing(false);
  };

  const handleRejectClick = (order) => {
    setOrderToProcess(order);
    setRejectReason("");
    setShowRejectModal(true);
  };
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason");
      return;
    }
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setOrders(orders.filter((o) => o.id !== orderToProcess.id));
    setShowRejectModal(false);
    setOrderToProcess(null);
    setRejectReason("");
    setIsProcessing(false);
  };

  const handleBulkApprove = async () => {
    if (confirm(`Approve ${selectedOrders.length} orders?`)) {
      setIsProcessing(true);
      await new Promise((r) => setTimeout(r, 2000));
      setOrders(orders.filter((o) => !selectedOrders.includes(o.id)));
      setSelectedOrders([]);
      setIsProcessing(false);
    }
  };

  const handleBulkReject = async () => {
    const reason = prompt(`Reject ${selectedOrders.length} orders?\nReason:`);
    if (reason) {
      setIsProcessing(true);
      await new Promise((r) => setTimeout(r, 2000));
      setOrders(orders.filter((o) => !selectedOrders.includes(o.id)));
      setSelectedOrders([]);
      setIsProcessing(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrderDetails(order);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Pending Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve customer orders
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Pending Orders",
              value: stats.total,
              icon: <FiClock />,
              color: "yellow",
            },
            {
              label: "Total Value",
              value: `$${stats.totalValue.toFixed(2)}`,
              icon: <FiDollarSign />,
              color: "green",
            },
            {
              label: "Avg Order Value",
              value: `$${stats.avgValue.toFixed(2)}`,
              icon: <FiPackage />,
              color: "blue",
            },
          ].map((stat, i) => (
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

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
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
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <FiCheckCircle className="w-5 h-5" />
                  Approve ({selectedOrders.length})
                </button>
                <button
                  onClick={handleBulkReject}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <FiXCircle className="w-5 h-5" />
                  Reject ({selectedOrders.length})
                </button>
              </div>
            )}
          </div>
        </div>

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
                All orders processed!
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
                          ${order.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="View"
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

      {showDetailsModal && selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order {selectedOrderDetails.id}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
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
                      Payment
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedOrderDetails.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiPackage className="w-5 h-5" />
                  Product
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
                      Qty
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
                      ${selectedOrderDetails.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Date
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedOrderDetails.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiMapPin className="w-5 h-5" />
                  Delivery
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedOrderDetails.address}
                </p>
                {selectedOrderDetails.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Notes
                    </p>
                    <p className="text-gray-900 dark:text-white italic">
                      "{selectedOrderDetails.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>
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

      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Approve Order?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Approve order "{orderToProcess?.id}" for{" "}
              {orderToProcess?.customer}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
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

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiXCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Reject Order?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Reason for rejecting "{orderToProcess?.id}"
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Out of stock, Invalid address, etc."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
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
