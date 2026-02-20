import React, { useState, useEffect, useRef } from "react";
import {
  FiEdit2,
  FiCamera,
  FiSave,
  FiX,
  FiMail,
  FiPhone,
  FiShield,
  FiPackage,
  FiCalendar,
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiTrendingUp,
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import axios from "axios";
import ButtonLoader from "../../../components/ButtonLoader";

const Profile = () => {
  const { user, updateUserProfile, refreshUser } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || user?.displayName || "",
    phone: user?.phone || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    document.title = "Profile | GarmentTrack";
    return () => {
      document.title = "GarmentTrack";
    };
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || user.displayName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "orders") fetchUserOrders();
  }, [activeTab]);

  const fetchUserOrders = async () => {
    if (!user?.email) return;
    setOrdersLoading(true);
    try {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      setUserOrders(res.data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
        formData,
      );
      const photoURL = imgRes.data.data.url;
      await updateUserProfile({ displayName: user.displayName, photoURL });
      await axiosSecure.patch(`/users/${user._id}`, { avatar: photoURL });
      await refreshUser();
      toast.success("Profile photo updated! 📸");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.warning("Name cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      await updateUserProfile({ displayName: profileForm.name });
      await axiosSecure.patch(`/users/${user._id}`, {
        name: profileForm.name,
        phone: profileForm.phone,
      });
      await refreshUser();
      toast.success("Profile updated! ✅");
      setIsEditingProfile(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast.warning("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
    setIsSaving(true);
    try {
      const {
        updatePassword,
        EmailAuthProvider,
        reauthenticateWithCredential,
      } = await import("firebase/auth");
      const { auth } = await import("../../../firebase/firebase.init");
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordForm.currentPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      toast.success("Password changed successfully! 🔒");
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleConfig = (role) =>
    ({
      admin: {
        label: "Admin",
        cls: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/50",
      },
      manager: {
        label: "Manager",
        cls: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700/50",
      },
      buyer: {
        label: "Buyer",
        cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50",
      },
    })[role] || {
      label: "Buyer",
      cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    };

  const getStatusDot = (status) =>
    ({
      active: "bg-emerald-500",
      inactive: "bg-red-500",
      pending: "bg-yellow-500",
    })[status] || "bg-yellow-500";

  const getOrderStatusCls = (status) =>
    ({
      pending:
        "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700/30",
      confirmed:
        "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700/30",
      "in-production":
        "bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/30",
      "quality-check":
        "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700/30",
      packed:
        "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30",
      "in-transit":
        "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/30",
      "out-for-delivery":
        "bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700/30",
      delivered:
        "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/30",
      cancelled:
        "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/30",
    })[status] ||
    "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";

  const roleConfig = getRoleConfig(user?.role);

  const orderStats = {
    total: userOrders.length,
    delivered: userOrders.filter((o) => o.status === "delivered").length,
    pending: userOrders.filter((o) => o.status === "pending").length,
    totalSpent: userOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + (o.total || 0), 0),
  };

  const inputCls =
    "w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── PAGE TITLE ── */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account information and settings
          </p>
        </div>

        {/* ── HERO CARD ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full ring-4 ring-indigo-500/30 overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {(user?.name || user?.displayName || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 border-2 border-white dark:border-gray-800 flex items-center justify-center transition-all disabled:opacity-60 shadow-md"
                title="Change photo"
              >
                {isUploadingPhoto ? (
                  <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiCamera className="w-3 h-3 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user?.name || user?.displayName || "Unknown User"}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleConfig.cls}`}
                >
                  {roleConfig.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusDot(user?.status)} animate-pulse`}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.status || "active"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <FiMail className="w-3.5 h-3.5 text-indigo-500" />
                  {user?.email}
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <FiPhone className="w-3.5 h-3.5 text-sky-500" />
                    {user.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5 text-emerald-500" />
                  Joined{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>

            {/* Edit toggle */}
            <button
              onClick={() => {
                setIsEditingProfile(!isEditingProfile);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                isEditingProfile
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700/50 hover:bg-red-100 dark:hover:bg-red-900/30"
                  : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
              }`}
            >
              {isEditingProfile ? (
                <>
                  <FiX className="w-4 h-4" /> Cancel
                </>
              ) : (
                <>
                  <FiEdit2 className="w-4 h-4" /> Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Edit Form */}
          {isEditingProfile && (
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      className={inputCls}
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      className={inputCls}
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+880 1234-567890"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-sm"
              >
                {isSaving ? (
                  <ButtonLoader text="Saving..." />
                ) : (
                  <>
                    <FiSave className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Orders",
              value: user?.totalOrders || 0,
              icon: <FiPackage className="w-5 h-5" />,
              iconBg:
                "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
            },
            {
              label: "Delivered",
              value: orderStats.delivered,
              icon: <FiCheck className="w-5 h-5" />,
              iconBg:
                "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Pending",
              value: orderStats.pending,
              icon: <FiClock className="w-5 h-5" />,
              iconBg:
                "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
            },
            {
              label: "Total Spent",
              value: `$${orderStats.totalSpent.toFixed(2)}`,
              icon: <FiTrendingUp className="w-5 h-5" />,
              iconBg:
                "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.iconBg}`}
              >
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 dark:border-gray-700">
            {[
              { id: "overview", label: "Overview" },
              { id: "orders", label: "My Orders" },
              { id: "security", label: "Security" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    label: "Full Name",
                    value: user?.name || user?.displayName || "—",
                    icon: <FiUser className="w-4 h-4 text-indigo-500" />,
                  },
                  {
                    label: "Email Address",
                    value: user?.email || "—",
                    icon: <FiMail className="w-4 h-4 text-sky-500" />,
                  },
                  {
                    label: "Phone Number",
                    value: user?.phone || "Not provided",
                    icon: <FiPhone className="w-4 h-4 text-emerald-500" />,
                  },
                  {
                    label: "Role",
                    value: roleConfig.label,
                    icon: <FiShield className="w-4 h-4 text-violet-500" />,
                  },
                  {
                    label: "Account Status",
                    value:
                      (user?.status || "active").charAt(0).toUpperCase() +
                      (user?.status || "active").slice(1),
                    icon: <FiCheck className="w-4 h-4 text-teal-500" />,
                  },
                  {
                    label: "Member Since",
                    value: user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—",
                    icon: <FiCalendar className="w-4 h-4 text-orange-500" />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/50"
                  >
                    <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "orders" && (
            <div className="p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                Order History
              </h3>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : userOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <FiPackage className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-500 dark:text-gray-400">
                    No orders yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Your order history will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                          <FiPackage className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {order.productName || "Product"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {order.orderId} ·{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                            {order.quantity && ` · Qty: ${order.quantity}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-13 sm:pl-0">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${getOrderStatusCls(order.status)}`}
                        >
                          {order.status?.replace(/-/g, " ")}
                        </span>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                          ${(order.total || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === "security" && (
            <div className="p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Security Settings
              </h3>

              {/* Change Password */}
              <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <FiLock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        Password
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Update your account password
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      isChangingPassword
                        ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50"
                        : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                    }`}
                  >
                    {isChangingPassword ? "Cancel" : "Change"}
                  </button>
                </div>

                {isChangingPassword && (
                  <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-600 space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        Current Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          className={inputCls + " pr-10"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className={inputCls + " pr-10"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder="Min. 6 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showNewPassword ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          className={inputCls}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                        />
                      </div>
                      {passwordForm.confirmPassword &&
                        passwordForm.newPassword !==
                          passwordForm.confirmPassword && (
                          <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
                            <FiAlertCircle className="w-3.5 h-3.5" /> Passwords
                            do not match
                          </p>
                        )}
                    </div>
                    <button
                      onClick={handleChangePassword}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-sm"
                    >
                      {isSaving ? (
                        <ButtonLoader text="Updating..." />
                      ) : (
                        <>
                          <FiCheck className="w-4 h-4" /> Update Password
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Security tip */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30">
                <FiAlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-0.5">
                    Security Tip
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-500">
                    Use a strong password with uppercase letters, numbers, and
                    symbols. Never share your credentials with anyone.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
