import React, { useState, useEffect } from "react";
import { Link } from "react-router";
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
} from "react-icons/fi";
import { SkeletonTable } from "../../../components/Loading";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToEditRole, setUserToEditRole] = useState(null);
  const [newRole, setNewRole] = useState("");

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      avatar: "https://i.pravatar.cc/100?img=12",
      phone: "+880 1234-567890",
      joinedDate: "2024-01-15",
      lastLogin: "2 hours ago",
      totalOrders: 45,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "manager",
      status: "active",
      avatar: "https://i.pravatar.cc/100?img=5",
      phone: "+880 1234-567891",
      joinedDate: "2024-01-20",
      lastLogin: "5 hours ago",
      totalOrders: 123,
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@example.com",
      role: "manager",
      status: "active",
      avatar: "https://i.pravatar.cc/100?img=13",
      phone: "+880 1234-567892",
      joinedDate: "2024-01-22",
      lastLogin: "1 day ago",
      totalOrders: 89,
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily@example.com",
      role: "buyer",
      status: "active",
      avatar: "https://i.pravatar.cc/100?img=1",
      phone: "+880 1234-567893",
      joinedDate: "2024-01-25",
      lastLogin: "3 hours ago",
      totalOrders: 34,
    },
    {
      id: 5,
      name: "David Lee",
      email: "david@example.com",
      role: "buyer",
      status: "inactive",
      avatar: "https://i.pravatar.cc/100?img=8",
      phone: "+880 1234-567894",
      joinedDate: "2024-02-01",
      lastLogin: "1 week ago",
      totalOrders: 12,
    },
    {
      id: 6,
      name: "Lisa Park",
      email: "lisa@example.com",
      role: "buyer",
      status: "active",
      avatar: "https://i.pravatar.cc/100?img=9",
      phone: "+880 1234-567895",
      joinedDate: "2024-02-02",
      lastLogin: "30 minutes ago",
      totalOrders: 56,
    },
    {
      id: 7,
      name: "James Wilson",
      email: "james@example.com",
      role: "manager",
      status: "pending",
      avatar: "https://i.pravatar.cc/100?img=15",
      phone: "+880 1234-567896",
      joinedDate: "2024-02-03",
      lastLogin: "Never",
      totalOrders: 0,
    },
    {
      id: 8,
      name: "Anna Martinez",
      email: "anna@example.com",
      role: "buyer",
      status: "active",
      avatar: "https://i.pravatar.cc/100?img=20",
      phone: "+880 1234-567897",
      joinedDate: "2024-01-18",
      lastLogin: "1 hour ago",
      totalOrders: 78,
    },
  ];

  // title
  useEffect(() => {
    document.title = "Dashboard - Manage Users | GarmentTrack";

    return () => {
      document.title = "GarmentTrack";
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getFilteredUsers = () => {
    let filtered = [...users];
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (selectedRole !== "all")
      filtered = filtered.filter((user) => user.role === selectedRole);
    if (selectedStatus !== "all")
      filtered = filtered.filter((user) => user.status === selectedStatus);
    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    manager: users.filter((u) => u.role === "manager").length,
    buyer: users.filter((u) => u.role === "buyer").length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    pending: users.filter((u) => u.status === "pending").length,
  };

  const handleSelectAll = (e) => {
    setSelectedUsers(e.target.checked ? filteredUsers.map((u) => u.id) : []);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setUsers(users.filter((u) => u.id !== userToDelete.id));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedUsers.length} users?`)) {
      setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    }
  };

  const handleStatusToggle = (userId) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u,
      ),
    );
  };

  const handleRoleChangeClick = (user) => {
    setUserToEditRole(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const handleRoleChangeConfirm = () => {
    setUsers(
      users.map((u) =>
        u.id === userToEditRole.id ? { ...u, role: newRole } : u,
      ),
    );
    setShowRoleModal(false);
    setUserToEditRole(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Users
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all registered users
            </p>
          </div>
          <Link
            to="/dashboard/add-user"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <FiUserPlus className="w-5 h-5" />
            <span>Add New User</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: stats.total,
              icon: <FiUsers />,
              color: "blue",
            },
            {
              label: "Admins",
              value: stats.admin,
              icon: <FiShield />,
              color: "purple",
            },
            {
              label: "Managers",
              value: stats.manager,
              icon: <FiUsers />,
              color: "green",
            },
            {
              label: "Buyers",
              value: stats.buyer,
              icon: <FiUsers />,
              color: "yellow",
            },
            {
              label: "Active",
              value: stats.active,
              icon: <FiCheckCircle />,
              color: "green",
            },
            {
              label: "Inactive",
              value: stats.inactive,
              icon: <FiXCircle />,
              color: "red",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: <FiClock />,
              color: "orange",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : stat.color === "purple"
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                        : stat.color === "green"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : stat.color === "yellow"
                            ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                            : stat.color === "red"
                              ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                              : "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                  }`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.label}
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
                placeholder="Search users..."
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
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2"
              >
                <FiTrash2 className="w-5 h-5" />
                Delete ({selectedUsers.length})
              </button>
            )}
          </div>
        </div>

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
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRoleChangeClick(user)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                            user.role === "admin"
                              ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                              : user.role === "manager"
                                ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                : "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusToggle(user.id)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                            user.status === "active"
                              ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                              : user.status === "inactive"
                                ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                : "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {user.totalOrders}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/user/${user.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="View"
                          >
                            <FiEye className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/dashboard/edit-user/${user.id}`}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                            title="Edit"
                          >
                            <FiEdit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                          <a
                            href={`mailto:${user.email}`}
                            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition"
                            title="Email"
                          >
                            <FiMail className="w-5 h-5" />
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
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
                <FiDownload className="w-4 h-4" />
                Export
              </button>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Delete User?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete "{userToDelete?.name}"?
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

      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Change User Role
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Select new role for "{userToEditRole?.name}"
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChangeConfirm}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
