import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiUsers,
  FiClock,
  FiDownload,
  FiPhone,
  FiCalendar,
  FiX,
  FiSave,
} from "react-icons/fi";
import { SkeletonTable } from "../../../components/Loading";
import ButtonLoader from "../../../components/ButtonLoader";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // View modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Role modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToEditRole, setUserToEditRole] = useState(null);
  const [newRole, setNewRole] = useState("");

  const axiosSecure = useAxiosSecure();

  // Page title
  useEffect(() => {
    document.title = "Dashboard - Manage Users | GarmentTrack";
    return () => {
      document.title = "GarmentTrack";
    };
  }, []);

  // Fetch all users from DB
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosSecure.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      !searchQuery ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = selectedRole === "all" || user.role === selectedRole;
    const matchStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    return matchSearch && matchRole && matchStatus;
  });

  // Stats
  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    manager: users.filter((u) => u.role === "manager").length,
    buyer: users.filter((u) => u.role === "buyer").length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    pending: users.filter((u) => u.status === "pending").length,
  };

  // ---- SELECT ----
  const handleSelectAll = (e) =>
    setSelectedUsers(e.target.checked ? filteredUsers.map((u) => u._id) : []);

  const handleSelectUser = (id) =>
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  // ---- VIEW ----
  const handleView = (user) => {
    setViewUser(user);
    setShowViewModal(true);
  };

  // ---- EDIT ----
  const handleEditClick = (user) => {
    setEditUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "buyer",
      status: user.status || "active",
    });
    setShowEditModal(true);
  };

  // Save edited user
  const handleEditSave = async () => {
    if (!editForm.name?.trim() || !editForm.email?.trim()) {
      toast.warning("Name and email are required");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await axiosSecure.patch(`/users/${editUser._id}`, editForm);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === editUser._id ? res.data.data : u)),
        );
        toast.success(`User "${editForm.name}" updated! ✏️`);
        setShowEditModal(false);
        setEditUser(null);
      }
    } catch (error) {
      console.error("Edit user error:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---- DELETE ----
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Delete single user
  const handleDeleteConfirm = async () => {
    setIsProcessing(true);
    try {
      const res = await axiosSecure.delete(`/users/${userToDelete._id}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
        toast.success(`User "${userToDelete.name}" deleted! 🗑️`);
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Delete ${selectedUsers.length} selected users? This cannot be undone.`,
      )
    )
      return;
    setIsProcessing(true);
    try {
      const res = await axiosSecure.post("/users/bulk-delete", {
        userIds: selectedUsers,
      });
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => !selectedUsers.includes(u._id)));
        toast.success(`${res.data.deletedCount} users deleted!`);
        setSelectedUsers([]);
      }
    } catch (error) {
      toast.error("Failed to delete users");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---- STATUS TOGGLE ----
  // Toggle user status active/inactive

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await axiosSecure.patch(`/users/${user._id}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, status: newStatus } : u,
          ),
        );
        toast.success(`User status changed to ${newStatus}`);
      }
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  // ---- ROLE CHANGE ----
  const handleRoleChangeClick = (user) => {
    setUserToEditRole(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  // Update user role
  const handleRoleChangeConfirm = async () => {
    if (newRole === userToEditRole.role) {
      toast.warning("Please select a different role");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await axiosSecure.patch(`/users/${userToEditRole._id}/role`, {
        role: newRole,
      });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userToEditRole._id ? { ...u, role: newRole } : u,
          ),
        );
        toast.success(
          `Role updated to "${newRole}" for ${userToEditRole.name}! 🛡️`,
        );
        setShowRoleModal(false);
        setUserToEditRole(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---- HELPERS ----
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
      case "manager":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      default:
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      case "inactive":
        return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
      default:
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400";
    }
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Users
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all registered users
            </p>
          </div>
          <button
            onClick={() => toast.info("Add user feature coming soon!")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <FiUserPlus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: <FiUsers className="w-5 h-5" />,
              color: "blue",
            },
            {
              label: "Admins",
              value: stats.admin,
              icon: <FiShield className="w-5 h-5" />,
              color: "purple",
            },
            {
              label: "Managers",
              value: stats.manager,
              icon: <FiUsers className="w-5 h-5" />,
              color: "green",
            },
            {
              label: "Buyers",
              value: stats.buyer,
              icon: <FiUsers className="w-5 h-5" />,
              color: "yellow",
            },
            {
              label: "Active",
              value: stats.active,
              icon: <FiCheckCircle className="w-5 h-5" />,
              color: "emerald",
            },
            {
              label: "Inactive",
              value: stats.inactive,
              icon: <FiXCircle className="w-5 h-5" />,
              color: "red",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: <FiClock className="w-5 h-5" />,
              color: "orange",
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
                    s.color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : s.color === "green"
                        ? "bg-green-100 text-green-600"
                        : s.color === "yellow"
                          ? "bg-yellow-100 text-yellow-600"
                          : s.color === "emerald"
                            ? "bg-emerald-100 text-emerald-600"
                            : s.color === "red"
                              ? "bg-red-100 text-red-600"
                              : s.color === "orange"
                                ? "bg-orange-100 text-orange-600"
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="buyer">Buyer</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            {selectedUsers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isProcessing}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                <FiTrash2 className="w-5 h-5" />
                Delete ({selectedUsers.length})
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <SkeletonTable rows={8} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ||
                selectedRole !== "all" ||
                selectedStatus !== "all"
                  ? "Try adjusting your filters"
                  : "No users registered yet"}
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
                          selectedUsers.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                    </th>
                    {[
                      "User",
                      "Role",
                      "Status",
                      "Phone",
                      "Orders",
                      "Joined",
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
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {user.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRoleChangeClick(user)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition hover:scale-105 ${getRoleColor(user.role)}`}
                        >
                          {capitalize(user.role)}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusToggle(user)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition hover:scale-105 ${getStatusColor(user.status)}`}
                          title="Click to toggle status"
                        >
                          {capitalize(user.status || "pending")}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {user.phone || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {user.totalOrders || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                            title="Edit User"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Delete User"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <a
                            href={`mailto:${user.email}`}
                            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition"
                            title="Send Email"
                          >
                            <FiMail className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredUsers.length} of {users.length} users
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
      {showViewModal && viewUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Details
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Avatar & Name */}
            <div className="flex flex-col items-center mb-6">
              {viewUser.avatar ? (
                <img
                  src={viewUser.avatar}
                  alt={viewUser.name}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mb-3">
                  {viewUser.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {viewUser.name}
              </h3>
              <div className="flex gap-2 mt-2">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${getRoleColor(viewUser.role)}`}
                >
                  {capitalize(viewUser.role)}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(viewUser.status)}`}
                >
                  {capitalize(viewUser.status || "pending")}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FiMail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {viewUser.email || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiPhone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-xs">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {viewUser.phone || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiCalendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-xs">Joined Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {viewUser.createdAt
                      ? new Date(viewUser.createdAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiClock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-xs">Last Login</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {viewUser.lastLogin || "—"}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {viewUser.totalOrders || 0}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(viewUser);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FiEdit className="w-4 h-4" /> Edit User
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleDeleteClick(viewUser);
                }}
                className="px-4 py-3 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit User
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editUser.email}
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { key: "name", label: "Full Name", type: "text" },
                { key: "email", label: "Email Address", type: "email" },
                { key: "phone", label: "Phone Number", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={editForm[f.key] || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, [f.key]: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="buyer">Buyer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
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

      {/* DELETE MODAL */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Delete User?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                "{userToDelete.name}"
              </span>
              ?
            </p>
            <p className="text-xs text-gray-500 text-center mb-6">
              {userToDelete.email}
            </p>
            <p className="text-xs text-red-500 text-center mb-6 font-medium">
              ⚠️ This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
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
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  ROLE MODAL */}
      {showRoleModal && userToEditRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Change User Role
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Select new role for{" "}
              <span className="font-semibold">"{userToEditRole.name}"</span>
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setUserToEditRole(null);
                }}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChangeConfirm}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isProcessing ? (
                  <ButtonLoader text="Updating..." />
                ) : (
                  "Update Role"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
