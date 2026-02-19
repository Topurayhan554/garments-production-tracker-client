import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useCart } from "../../../context/CartContext";
import { toast } from "react-toastify";
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
  FiShoppingBag,
} from "react-icons/fi";
import PageLoader from "../../../components/PageLoader";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

  // Suppose 'product' is fetched from API
  useEffect(() => {
    if (product) {
      document.title = `Dashboard - ${product.name} | GarmentTrack`;
    } else {
      document.title = "Dashboard - Product Details | GarmentTrack";
    }

    return () => {
      document.title = "GarmentTrack";
    };
  }, [product]);

  //Load product from database
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await axiosSecure.get(`/products/${id}`);
        setProduct(res.data);

        // Fetch related products (same category, exclude current)
        if (res.data?.category) {
          const relatedRes = await axiosSecure.get(`/products`);
          const filtered = relatedRes.data
            .filter((p) => p._id !== id && p.category === res.data.category)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, axiosSecure]);

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedSize("");
      setSelectedColor("");
      setQuantity(1);
    }
  }, [product]);

  // Set Dynamic Page Title
  const handleQuantityChange = (type) => {
    if (type === "increase" && quantity < (product?.stock || 0)) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.warning("Please select size and color");
      return;
    }

    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images?.[0],
    });

    toast.success("Added to cart! 🛒");
  };

  const handleOrderNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.warning("Please select size and color first");
      return;
    }

    navigate("/place-order", {
      state: {
        product: {
          id: product._id,
          name: product.name,
          image: product.images?.[0],
          price: product.price,
          category: product.category,
          sizes: product.sizes,
          colors: product.colors,
        },
        size: selectedSize,
        color: {
          name: selectedColor,
          hex: product.colors?.find((c) => c.name === selectedColor)?.code,
        },
        quantity,
      },
    });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${product?.name} at GarmentTrack!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share error:", error);
        }
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist
          </p>
          <Link
            to="/all-products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
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
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to="/all-products"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-4 shadow-lg">
              <div className="relative aspect-square">
                <img
                  src={product.images?.[selectedImage] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
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

                {product.images?.length > 1 && (
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

            {product.images?.length > 1 && (
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
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold">
                {product.category}
              </span>
              {product.brand && (
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Brand: <span className="font-semibold">{product.brand}</span>
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {product.rating || 0}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({product.reviewCount || 0} reviews)
              </span>
              {product.inStock && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <FiCheck className="w-5 h-5" />
                  <span className="font-medium">
                    In Stock ({product.stock || 0} available)
                  </span>
                </span>
              )}
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-2xl text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
              </div>
              {product.sku && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  SKU: {product.sku}
                </p>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
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
            )}

            {product.colors && product.colors.length > 0 && (
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
            )}

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
                    disabled={quantity >= (product.stock || 0)}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Max: {product.stock || 0} items
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleOrderNow}
                disabled={!product.inStock}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingBag className="w-6 h-6" />
                Order Now
              </button>

              <div className="flex gap-3">
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
                  title="Add to Wishlist"
                >
                  <FiHeart
                    className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-600 transition"
                  title="Share Product"
                >
                  <FiShare2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {(!selectedSize || !selectedColor) &&
              product.sizes?.length > 0 &&
              product.colors?.length > 0 && (
                <div className="mb-4 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>
                    Please select{" "}
                    {!selectedSize && !selectedColor
                      ? "size and color"
                      : !selectedSize
                        ? "a size"
                        : "a color"}{" "}
                    to proceed
                  </span>
                </div>
              )}

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

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-16">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-8 px-8 overflow-x-auto">
              {["description", "specifications"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 font-semibold transition border-b-2 capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Product Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {product.features && product.features.length > 0 && (
                  <>
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
                  </>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Technical Specifications
                </h3>
                {product.specifications && product.specifications.length > 0 ? (
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
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No specifications available.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Related Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedProduct.images?.[0] || "/placeholder.png"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    {relatedProduct.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        -{relatedProduct.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(relatedProduct.rating || 0)
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
                      {relatedProduct.originalPrice &&
                        relatedProduct.originalPrice > relatedProduct.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${relatedProduct.originalPrice}
                          </span>
                        )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
