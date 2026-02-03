import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  FiStar,
  FiHeart,
  FiShoppingCart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCheck,
  FiMinus,
  FiPlus,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import PageLoader from "../../../components/PageLoader";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Mock product data - Replace with actual API call
  const mockProduct = {
    id: 1,
    name: "Premium Cotton T-Shirt",
    category: "T-Shirts",
    price: 25.99,
    originalPrice: 35.99,
    discount: 28,
    rating: 4.8,
    reviews: 124,
    inStock: true,
    stock: 45,
    sku: "TSH-001-BLK",
    brand: "GarmentTrack",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
      "https://images.unsplash.com/photo-1622445275576-721325763afe?w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", code: "#000000" },
      { name: "White", code: "#FFFFFF" },
      { name: "Navy", code: "#000080" },
      { name: "Gray", code: "#808080" },
    ],
    description:
      "Experience ultimate comfort with our Premium Cotton T-Shirt. Crafted from 100% premium cotton, this t-shirt offers exceptional softness and breathability. Perfect for everyday wear, it features a classic crew neck design and a relaxed fit that flatters all body types.",
    features: [
      "100% Premium Cotton",
      "Pre-shrunk fabric",
      "Reinforced shoulder seams",
      "Double-stitched hem",
      "Comfortable crew neck",
      "Machine washable",
    ],
    specifications: [
      { label: "Material", value: "100% Cotton" },
      { label: "Fit", value: "Regular" },
      { label: "Neck Type", value: "Crew Neck" },
      { label: "Sleeve", value: "Short Sleeve" },
      { label: "Pattern", value: "Solid" },
      { label: "Care", value: "Machine Wash" },
    ],
    reviews: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://i.pravatar.cc/100?img=12",
        rating: 5,
        date: "2024-01-15",
        comment:
          "Excellent quality! The fabric is soft and the fit is perfect. Highly recommend!",
        helpful: 24,
      },
      {
        id: 2,
        user: "Sarah Smith",
        avatar: "https://i.pravatar.cc/100?img=5",
        rating: 4,
        date: "2024-01-10",
        comment:
          "Great t-shirt for the price. True to size and comfortable to wear all day.",
        helpful: 15,
      },
      {
        id: 3,
        user: "Mike Johnson",
        avatar: "https://i.pravatar.cc/100?img=13",
        rating: 5,
        date: "2024-01-05",
        comment:
          "Best t-shirt I've bought in a while. The quality is outstanding!",
        helpful: 32,
      },
    ],
  };

  // Mock related products
  const relatedProducts = [
    {
      id: 2,
      name: "Classic Polo Shirt",
      price: 32.99,
      originalPrice: 45.0,
      image:
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
      rating: 4.7,
    },
    {
      id: 3,
      name: "Casual Hoodie",
      price: 54.99,
      originalPrice: 75.0,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Sports Jersey",
      price: 39.99,
      originalPrice: 55.0,
      image:
        "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=400",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Formal Shirt",
      price: 45.99,
      originalPrice: 60.0,
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
      rating: 4.8,
    },
  ];

  // Load product
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProduct(mockProduct);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (type) => {
    if (type === "increase" && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
    };

    console.log("Added to cart:", cartItem);
    // TODO: Implement actual cart functionality
    alert("Product added to cart!");
  };

  if (isLoading) {
    return <PageLoader message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product not found
          </h2>
          <Link
            to="/all-products"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to="/all-products"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
          >
            Products
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-4 shadow-lg">
              <div className="relative aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
                    -{product.discount}%
                  </div>
                )}

                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage(
                          (prev) =>
                            (prev - 1 + product.images.length) %
                            product.images.length,
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition"
                    >
                      <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage(
                          (prev) => (prev + 1) % product.images.length,
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition"
                    >
                      <FiChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-blue-600"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Brand */}
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold">
                {product.category}
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Brand: <span className="font-semibold">{product.brand}</span>
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {product.rating}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({product.reviews.length} reviews)
              </span>
              {product.inStock && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <FiCheck className="w-5 h-5" />
                  <span className="font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SKU: {product.sku}
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Select Size
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 rounded-xl font-semibold transition ${
                      selectedSize === size
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Select Color
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`group relative w-12 h-12 rounded-full border-2 transition ${
                      selectedColor === color.name
                        ? "border-blue-600 scale-110"
                        : "border-gray-300 dark:border-gray-600 hover:scale-110"
                    }`}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color.code }}
                    />
                    {selectedColor === color.name && (
                      <FiCheck className="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow-lg" />
                    )}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    <FiMinus className="w-5 h-5" />
                  </button>
                  <span className="px-6 text-lg font-semibold text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Max: {product.stock} items
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-4 border-2 rounded-xl transition ${
                  isFavorite
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-600"
                }`}
              >
                <FiHeart
                  className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>

              <button className="p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-600 transition">
                <FiShare2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl">
              <div className="text-center">
                <FiTruck className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Free Shipping
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Orders over $50
                </p>
              </div>

              <div className="text-center">
                <FiRefreshCw className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  30-day return
                </p>
              </div>

              <div className="text-center">
                <FiShield className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Secure Payment
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  100% protected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-16">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-8 px-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 font-semibold transition border-b-2 ${
                  activeTab === "description"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`py-4 font-semibold transition border-b-2 ${
                  activeTab === "specifications"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 font-semibold transition border-b-2 ${
                  activeTab === "reviews"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600"
                }`}
              >
                Reviews ({product.reviews.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "description" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Product Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {product.description}
                </p>

                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Key Features
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {spec.label}:
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Customer Reviews
                  </h3>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                    Write a Review
                  </button>
                </div>

                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={review.avatar}
                          alt={review.user}
                          className="w-12 h-12 rounded-full"
                        />

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {review.user}
                            </h4>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>

                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {review.comment}
                          </p>

                          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Related Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {relatedProduct.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(relatedProduct.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-blue-600">
                      ${relatedProduct.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${relatedProduct.originalPrice}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
