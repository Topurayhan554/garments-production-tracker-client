import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiArrowRight,
  FiPackage,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";

const CartDropdown = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice } =
    useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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

  const handleOrderNow = () => {
    onClose();
    navigate("/place-order", {
      state: { fromCart: true, cartItems },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-3 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-2 text-white">
          <FiShoppingCart className="w-5 h-5" />
          <span className="font-bold text-lg">My Cart</span>
          {totalItems > 0 && (
            <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition text-xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Empty State */}
      {cartItems.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiPackage className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            Your cart is empty
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Add some products!
          </p>
          <button
            onClick={() => {
              onClose();
              navigate("/all-products");
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {cartItems.map((item) => (
              <div
                key={item.cartId}
                className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {item.size} · {item.color}
                  </p>

                  {/* Qty + Price row */}
                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-600 rounded-lg p-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.cartId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-500 disabled:opacity-40 transition"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.cartId, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-500 transition"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex-shrink-0"
                  title="Remove"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Total ({totalItems} items)
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleOrderNow}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <FiShoppingBag className="w-4 h-4" />
                Order Now
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate("/cart-page");
                }}
                className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition flex items-center gap-1"
              >
                View All <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
