import React from "react";
import { useNavigate, Link } from "react-router";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight,
  FiPackage,
  FiTruck,
  FiShield,
  FiTag,
  FiX,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  // Shipping fee calculation
  const shippingFee = totalPrice >= 500 ? 0 : 60;
  const finalTotal = totalPrice + shippingFee;

  const handleCheckout = () => {
    navigate("/place-order", {
      state: { fromCart: true, cartItems },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FiShoppingCart className="w-8 h-8" />
                Shopping Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Clear all items from cart?")) {
                  clearCart();
                }
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition font-semibold"
            >
              <FiX className="w-5 h-5" />
              Clear Cart
            </button>
          )}
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-16 text-center">
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link
              to="/all-products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <FiShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 rounded-xl object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold">
                              Size: {item.size}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold">
                              Color: {item.color}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Remove from cart"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quantity and Price Row */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Quantity:
                          </span>
                          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                              <FiMinus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center text-lg font-bold text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity + 1)
                              }
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 transition"
                            >
                              <FiPlus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ${item.price} × {item.quantity}
                          </p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Button */}
              <Link
                to="/all-products"
                className="flex items-center justify-center gap-2 w-full py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                <FiArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-2">
                      <FiTruck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span
                      className={`font-semibold ${shippingFee === 0 ? "text-green-600 dark:text-green-400" : ""}`}
                    >
                      {shippingFee === 0 ? "FREE" : `$${shippingFee}`}
                    </span>
                  </div>

                  {/* Free Shipping Notice */}
                  {shippingFee > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 text-xs text-yellow-700 dark:text-yellow-400">
                      Add <strong>${(500 - totalPrice).toFixed(2)}</strong> more
                      for <strong>FREE shipping</strong>!
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span className="text-2xl text-blue-600 dark:text-blue-400">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mb-4"
                >
                  <FiShoppingBag className="w-5 h-5" />
                  Proceed to Checkout
                  <FiArrowRight className="w-5 h-5" />
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <FiShield className="w-4 h-4 text-green-500" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <FiTruck className="w-4 h-4 text-blue-500" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <FiPackage className="w-4 h-4 text-purple-500" />
                    <span>Quality Products</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <FiTag className="w-4 h-4 text-orange-500" />
                    <span>Best Prices</span>
                  </div>
                </div>

                {/* Accepted Payment Methods */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
                    We Accept
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">💵</span>
                    <span className="text-2xl">🔴</span>
                    <span className="text-2xl">🟠</span>
                    <span className="text-2xl">🟣</span>
                    <span className="text-2xl">💳</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                    COD • bKash • Nagad • Rocket • Cards
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Clear Cart Button */}
        {cartItems.length > 0 && (
          <div className="sm:hidden mt-6">
            <button
              onClick={() => {
                if (window.confirm("Clear all items from cart?")) {
                  clearCart();
                }
              }}
              className="flex items-center justify-center gap-2 w-full py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl transition font-semibold"
            >
              <FiX className="w-5 h-5" />
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
