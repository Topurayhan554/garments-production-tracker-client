import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiPackage,
  FiCheckCircle,
  FiTruck,
  FiShield,
  FiTag,
  FiChevronRight,
  FiEdit2,
  FiArrowLeft,
} from "react-icons/fi";
import ButtonLoader from "../../../components/ButtonLoader";

const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    icon: "💵",
    desc: "Pay when you receive",
  },
  { id: "bkash", label: "bKash", icon: "🔴", desc: "Mobile banking" },
  { id: "nagad", label: "Nagad", icon: "🟠", desc: "Mobile banking" },
  { id: "rocket", label: "Rocket", icon: "🟣", desc: "Mobile banking" },
  {
    id: "card",
    label: "Credit / Debit Card",
    icon: "💳",
    desc: "Visa, Mastercard",
  },
];

const PlaceOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Product data — passed via router state OR default demo product
  const product = location.state?.product || {
    id: "demo-001",
    name: "Premium Cotton T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    price: 25.99,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Navy Blue", hex: "#000080" },
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Red", hex: "#FF0000" },
    ],
  };

  // Order state
  const [selectedSize, setSelectedSize] = useState(
    location.state?.size || product.sizes[0],
  );
  const [selectedColor, setSelectedColor] = useState(
    location.state?.color || product.colors[0],
  );
  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [step, setStep] = useState(1); // 1=details, 2=review

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Pricing
  const subtotal = product.price * quantity;
  const shippingFee = subtotal >= 500 ? 0 : 60;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + shippingFee - discountAmount;

  // Apply coupon
  const handleApplyCoupon = () => {
    const validCoupons = {
      SAVE10: 10,
      GARMENTS20: 20,
      WELCOME15: 15,
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setDiscount(validCoupons[couponCode.toUpperCase()]);
      setCouponSuccess(
        `${validCoupons[couponCode.toUpperCase()]}% discount applied!`,
      );
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponSuccess("");
      setDiscount(0);
    }
  };

  // Submit order
  const onSubmit = async (formData) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      product: product.id,
      productName: product.name,
      quantity,
      size: selectedSize,
      color: selectedColor.name,
      amount: total,
      subtotal,
      shippingFee,
      discount: discountAmount,
      paymentMethod,
      couponCode: couponCode || null,
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      deliveryAddress: {
        street: formData.street,
        area: formData.area,
        city: formData.city,
        zip: formData.zip,
      },
      notes: formData.notes || "",
    };

    // TODO: Replace with actual API call
    // const res = await axiosSecure.post('/orders', orderPayload);

    await new Promise((r) => setTimeout(r, 2000)); // simulate API

    const generatedId = `#${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(generatedId);
    setOrderSuccess(true);
    setIsSubmitting(false);
  };

  // ─── Order Success Screen ──────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-10 text-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Placed! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your order has been placed successfully.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Order ID
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {orderId}
            </p>
          </div>

          <div className="space-y-3 text-left mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <FiMail className="w-4 h-4 text-blue-500" />
              <span>Confirmation email sent</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <FiPackage className="w-4 h-4 text-purple-500" />
              <span>Production will start shortly</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <FiTruck className="w-4 h-4 text-green-500" />
              <span>Estimated delivery: 5-7 business days</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard/my-orders")}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              My Orders
            </button>
            <button
              onClick={() => navigate("/all-products")}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Shop More
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Page ────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => (step === 2 ? setStep(1) : navigate(-1))}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {step === 1 ? "Place Order" : "Review Order"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">
              Step {step} of 2 —{" "}
              {step === 1 ? "Fill in your details" : "Confirm & pay"}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {["Details", "Review"].map((label, i) => (
            <React.Fragment key={i}>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition ${
                  step === i + 1
                    ? "bg-blue-600 text-white"
                    : step > i + 1
                      ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                      : "bg-white dark:bg-gray-800 text-gray-400"
                }`}
              >
                {step > i + 1 ? (
                  <FiCheckCircle className="w-4 h-4" />
                ) : (
                  <span>{i + 1}</span>
                )}
                {label}
              </div>
              {i < 1 && <FiChevronRight className="w-4 h-4 text-gray-400" />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── Left: Form ─────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">
              {step === 1 && (
                <>
                  {/* Product Options */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <FiPackage className="w-5 h-5 text-blue-600" />
                      Product Options
                    </h2>

                    <div className="flex items-start gap-4 mb-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {product.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {product.category}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mt-1">
                          ${product.price}
                        </p>
                      </div>
                    </div>

                    {/* Size */}
                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Select Size
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 rounded-xl font-semibold text-sm transition ${
                              selectedSize === size
                                ? "bg-blue-600 text-white shadow-lg scale-110"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color */}
                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Select Color —{" "}
                        <span className="text-blue-600 dark:text-blue-400">
                          {selectedColor.name}
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {product.colors.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            title={color.name}
                            className={`w-9 h-9 rounded-full transition border-4 ${
                              selectedColor.name === color.name
                                ? "border-blue-500 scale-125 shadow-lg"
                                : "border-transparent hover:scale-110"
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                          −
                        </button>
                        <span className="w-12 text-center text-xl font-bold text-gray-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <FiUser className="w-5 h-5 text-blue-600" />
                      Customer Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="John Doe"
                            {...register("name", {
                              required: "Name is required",
                            })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Email *
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            placeholder="john@example.com"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email",
                              },
                            })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            placeholder="+880 1XXX-XXXXXX"
                            {...register("phone", {
                              required: "Phone is required",
                              minLength: {
                                value: 11,
                                message: "Invalid phone number",
                              },
                            })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <FiMapPin className="w-5 h-5 text-blue-600" />
                      Delivery Address
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Street / House No. *
                        </label>
                        <input
                          type="text"
                          placeholder="House 12, Road 5, Block B"
                          {...register("street", {
                            required: "Street is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.street && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.street.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Area / Thana *
                        </label>
                        <input
                          type="text"
                          placeholder="Gulshan, Mirpur..."
                          {...register("area", {
                            required: "Area is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.area && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.area.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          City *
                        </label>
                        <select
                          {...register("city", {
                            required: "City is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select City</option>
                          {[
                            "Dhaka",
                            "Chattogram",
                            "Sylhet",
                            "Rajshahi",
                            "Khulna",
                            "Barishal",
                            "Rangpur",
                            "Mymensingh",
                          ].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          placeholder="1216"
                          {...register("zip")}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Special Notes (Optional)
                        </label>
                        <textarea
                          placeholder="Delivery instructions, landmarks, etc."
                          rows={3}
                          {...register("notes")}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiCheckCircle className="w-5 h-5 text-green-600" />
                      Review Your Order
                    </h2>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                    >
                      <FiEdit2 className="w-4 h-4" /> Edit
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Size: {selectedSize} · Color: {selectedColor.name} ·
                          Qty: {quantity}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 font-bold mt-1">
                          ${product.price} × {quantity} = $
                          {(product.price * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Payment Method
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-4 rounded-xl border-2 text-left transition ${
                            paymentMethod === method.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {method.label}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {method.desc}
                              </p>
                            </div>
                            {paymentMethod === method.id && (
                              <FiCheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Right: Order Summary ────────────────── */}
            <div className="lg:col-span-1 space-y-4">
              {/* Summary Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>
                      Subtotal ({quantity} item{quantity > 1 ? "s" : ""})
                    </span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <FiTruck className="w-4 h-4" /> Shipping
                    </span>
                    <span
                      className={`font-semibold ${shippingFee === 0 ? "text-green-600 dark:text-green-400" : ""}`}
                    >
                      {shippingFee === 0 ? "FREE" : `$${shippingFee}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount ({discount}%)</span>
                      <span className="font-semibold">
                        −${discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Free shipping notice */}
                {shippingFee > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 mb-4 text-xs text-yellow-700 dark:text-yellow-400">
                    Add ${(500 - subtotal).toFixed(2)} more for{" "}
                    <strong>FREE shipping</strong>!
                  </div>
                )}

                {/* Coupon */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <FiTag className="w-4 h-4" /> Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="SAVE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-xs mt-1">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-green-600 dark:text-green-400 text-xs mt-1 flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" /> {couponSuccess}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Try: SAVE10 · GARMENTS20 · WELCOME15
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <ButtonLoader text="Placing Order..." />
                  ) : step === 1 ? (
                    <>
                      Review Order <FiChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Confirm Order <FiCheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: <FiShield className="w-4 h-4 text-green-500" />,
                      text: "Secure Checkout",
                    },
                    {
                      icon: <FiTruck className="w-4 h-4 text-blue-500" />,
                      text: "Fast Delivery",
                    },
                    {
                      icon: (
                        <FiCheckCircle className="w-4 h-4 text-purple-500" />
                      ),
                      text: "Quality Assured",
                    },
                    {
                      icon: <FiTag className="w-4 h-4 text-orange-500" />,
                      text: "Best Prices",
                    },
                  ].map((badge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                    >
                      {badge.icon} {badge.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
