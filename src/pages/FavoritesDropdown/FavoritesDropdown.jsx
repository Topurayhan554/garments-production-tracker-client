import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { FiHeart, FiShoppingCart, FiX, FiArrowRight } from "react-icons/fi";
import { useCart } from "../../context/CartContext";

const FavoritesDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const { addToCart } = useCart();

  // Load favorites from localStorage whenever dropdown opens
  useEffect(() => {
    if (isOpen) {
      const stored = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(stored);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const removeFavorite = (id) => {
    const updated = favorites.filter(
      (item) => item._id !== id && item.id !== id,
    );
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiHeart className="w-5 h-5 text-white fill-white" />
          <h3 className="text-white font-bold text-base">My Favorites</h3>
          {favorites.length > 0 && (
            <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {favorites.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition p-1 hover:bg-white/20 rounded-lg"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Items */}
      {favorites.length === 0 ? (
        <div className="py-10 text-center">
          <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiHeart className="w-7 h-7 text-pink-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            No favorites yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Heart a product to save it here
          </p>
        </div>
      ) : (
        <>
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {favorites.slice(0, 5).map((item) => (
              <div
                key={item._id || item.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                {/* Image */}
                <img
                  src={item.image || item.productImage || "/placeholder.png"}
                  alt={item.name || item.productName}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {item.name || item.productName}
                  </p>
                  <p className="text-sm text-pink-600 dark:text-pink-400 font-bold">
                    ${(item.price || item.amount || 0).toFixed(2)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      addToCart(item);
                      removeFavorite(item._id || item.id);
                    }}
                    title="Move to cart"
                    className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFavorite(item._id || item.id)}
                    title="Remove"
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {favorites.length > 5 && (
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-2">
                +{favorites.length - 5} more items
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700">
            <Link
              to="/favorites"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
            >
              See All Favorites
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesDropdown;
