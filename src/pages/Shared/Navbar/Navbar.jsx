import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiShoppingBag,
  FiPackage,
  FiHome,
  FiShoppingCart,
  FiHeart,
} from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useCart } from "../../../context/CartContext";
import CartDropdown from "../../../components/CartDropDown";
import Loading from "../../../components/Loading";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const [favCount, setFavCount] = useState(
    () => JSON.parse(localStorage.getItem("favorites"))?.length || 0,
  );

  const navigate = useNavigate();
  const { user, setUser, logOut, loading } = useAuth();

  useEffect(() => {
    const handleFavUpdate = () => {
      setFavCount(JSON.parse(localStorage.getItem("favorites"))?.length || 0);
    };
    window.addEventListener("favoritesUpdated", handleFavUpdate);
    window.addEventListener("storage", handleFavUpdate);
    return () => {
      window.removeEventListener("favoritesUpdated", handleFavUpdate);
      window.removeEventListener("storage", handleFavUpdate);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logOut()
      .then(() => {
        toast.success("Log-Out success!");
      })
      .catch((error) => {
        toast.error(error.message || "Logout failed!");
      });
  };

  const publicLinks = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "All Products", path: "/all-products", icon: <FiPackage /> },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const privateLinks = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "All Products", path: "/all-products", icon: <FiPackage /> },
    { name: "Dashboard", path: "/dashboard", icon: <FiShoppingBag /> },
  ];

  const currentLinks = user ? privateLinks : publicLinks;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading */}
          {loading ? (
            <Loading />
          ) : (
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-3 group"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    GarmentTrack
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">
                    Production Hub
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-2">
                {currentLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    {link.icon && <span className="text-lg">{link.icon}</span>}
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="hidden sm:flex w-11 h-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <FiMoon className="w-5 h-5" />
                  ) : (
                    <FiSun className="w-5 h-5" />
                  )}
                </button>

                {/* Favorites Icon */}
                {user && (
                  <Link
                    to="/favorites"
                    className="hidden sm:flex w-11 h-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 relative"
                  >
                    <FiHeart className="w-5 h-5" />
                    {favCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                        {favCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Cart Icon */}
                {user && (
                  <div className="relative">
                    <button
                      onClick={() => setCartOpen(!cartOpen)}
                      className="hidden sm:flex w-11 h-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                          {totalItems > 99 ? "99+" : totalItems}
                        </span>
                      )}
                    </button>
                    <CartDropdown
                      isOpen={cartOpen}
                      onClose={() => setCartOpen(false)}
                    />
                  </div>
                )}

                {/* User Section (Desktop) */}
                {user ? (
                  <div className="hidden lg:flex items-center gap-3">
                    <div
                      className="relative"
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                      <button className="relative group">
                        <img
                          src={
                            user.photoURL ||
                            "https://ui-avatars.com/api/?name=" + user.name
                          }
                          alt={user.name}
                          className="w-11 h-11 rounded-xl object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                      </button>

                      {showProfileMenu && (
                        <div className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
                          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  user.photoURL ||
                                  "https://ui-avatars.com/api/?name=" +
                                    user.name
                                }
                                alt={user.name}
                                className="w-12 h-12 rounded-xl border-2 border-white"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-semibold truncate">
                                  {user.name}
                                </h4>
                                <p className="text-blue-100 text-sm truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                                  user.role === "admin"
                                    ? "bg-red-500 text-white"
                                    : user.role === "manager"
                                      ? "bg-green-500 text-white"
                                      : "bg-blue-500 text-white"
                                }`}
                              >
                                {user.role}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                                  user.status === "approved"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : user.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                {user.status}
                              </span>
                            </div>
                          </div>

                          <div className="p-2">
                            <Link
                              to="/dashboard/profile"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                              <FiUser className="w-5 h-5" />
                              <span className="font-medium">My Profile</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 mt-1"
                            >
                              <FiLogOut className="w-5 h-5" />
                              <span className="font-medium">Logout</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="hidden lg:flex items-center gap-3">
                    <Link
                      to="/login"
                      className="px-5 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                    >
                      Register
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <FiX className="w-6 h-6" />
                  ) : (
                    <FiMenu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu - loading না হলেই দেখাবে */}
        {!loading && (
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out ${
              isOpen
                ? "max-h-screen opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="px-4 pb-6 pt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="sm:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300"
              >
                <span className="font-medium">Theme</span>
                {theme === "light" ? (
                  <FiMoon className="w-5 h-5" />
                ) : (
                  <FiSun className="w-5 h-5" />
                )}
              </button>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {currentLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    {link.icon && <span className="text-xl">{link.icon}</span>}
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </div>

              {/* Mobile User Section */}
              {user ? (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={
                          user.photoURL ||
                          "https://ui-avatars.com/api/?name=" + user.name
                        }
                        alt={user.name}
                        className="w-14 h-14 rounded-xl border-2 border-white"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold truncate">
                          {user.name}
                        </h4>
                        <p className="text-blue-100 text-sm truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                          user.role === "admin"
                            ? "bg-red-500 text-white"
                            : user.role === "manager"
                              ? "bg-green-500 text-white"
                              : "bg-blue-500 text-white"
                        }`}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                          user.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : user.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Favorites Link */}
                  <Link
                    to="/favorites"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 mb-3"
                  >
                    <FiHeart className="w-5 h-5" />
                    <span className="font-medium">My Favorites</span>
                    {favCount > 0 && (
                      <span className="ml-auto min-w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                        {favCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/dashboard/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 mb-3"
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="font-medium">My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold shadow-lg transition-all duration-300 active:scale-95"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-5 py-3 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg transition-all duration-300 active:scale-95"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
