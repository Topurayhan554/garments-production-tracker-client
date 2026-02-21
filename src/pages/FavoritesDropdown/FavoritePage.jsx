import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FiHeart,
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
  FiPackage,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ProductCard } from "../Product/AllProducts/AllProducts";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  // Listen for updates (same tab via custom event)
  useEffect(() => {
    const handleUpdate = () => {
      const saved = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(saved);
    };
    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  // Remove single item
  const removeFavorite = (productId) => {
    const updated = favorites.filter((p) => p._id !== productId);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
    window.dispatchEvent(new Event("favoritesUpdated"));
    toast.success("Removed from favorites");
  };

  // Clear all
  const clearAll = () => {
    localStorage.setItem("favorites", JSON.stringify([]));
    setFavorites([]);
    window.dispatchEvent(new Event("favoritesUpdated"));
    toast.success("Cleared all favorites");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/all-products"
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Products</span>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
                <FiHeart className="fill-white" />
                My Favorites
              </h1>
              <p className="text-blue-100 text-lg">
                {favorites.length > 0
                  ? `${favorites.length} item${favorites.length > 1 ? "s" : ""} saved`
                  : "No favorites yet"}
              </p>
            </div>

            {favorites.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 border border-white/30"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6">
              <FiHeart className="w-14 h-14 text-blue-400 dark:text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No favorites yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              Browse products and click the ❤️ icon to save your favorites here.
            </p>
            <Link
              to="/all-products"
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <FiPackage className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product._id} className="relative group/fav">
                {/* Remove button */}
                <button
                  onClick={() => removeFavorite(product._id)}
                  className="absolute top-3 left-3 z-10 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover/fav:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
                  title="Remove from favorites"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>

                <ProductCard product={product} viewMode="grid" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
