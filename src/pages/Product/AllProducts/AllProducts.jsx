import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import { SkeletonTable } from "../../../components/Loading";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Mock products data - Replace with actual API call
  const mockProducts = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      category: "T-Shirts",
      price: 25.99,
      originalPrice: 35.99,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      rating: 4.8,
      reviews: 124,
      inStock: true,
      discount: 28,
      description: "High-quality cotton fabric with comfortable fit",
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      category: "Jackets",
      price: 89.99,
      originalPrice: 120.0,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      rating: 4.9,
      reviews: 89,
      inStock: true,
      discount: 25,
      description: "Durable denim with modern styling",
    },
    {
      id: 3,
      name: "Formal Business Shirt",
      category: "Shirts",
      price: 45.99,
      originalPrice: 60.0,
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
      rating: 4.7,
      reviews: 156,
      inStock: true,
      discount: 23,
      description: "Professional attire for business meetings",
    },
    {
      id: 4,
      name: "Casual Polo Shirt",
      category: "Polo",
      price: 32.99,
      originalPrice: 45.0,
      image:
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
      rating: 4.6,
      reviews: 92,
      inStock: true,
      discount: 27,
      description: "Comfortable casual wear for everyday use",
    },
    {
      id: 5,
      name: "Sports Jersey",
      category: "Sports",
      price: 39.99,
      originalPrice: 55.0,
      image:
        "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=400",
      rating: 4.8,
      reviews: 78,
      inStock: true,
      discount: 27,
      description: "Breathable fabric for athletic performance",
    },
    {
      id: 6,
      name: "Winter Hoodie",
      category: "Hoodies",
      price: 54.99,
      originalPrice: 75.0,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
      rating: 4.9,
      reviews: 203,
      inStock: true,
      discount: 27,
      description: "Warm and cozy for cold weather",
    },
    {
      id: 7,
      name: "Designer T-Shirt",
      category: "T-Shirts",
      price: 28.99,
      originalPrice: 40.0,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
      rating: 4.5,
      reviews: 67,
      inStock: false,
      discount: 28,
      description: "Trendy design with premium quality",
    },
    {
      id: 8,
      name: "Leather Jacket",
      category: "Jackets",
      price: 199.99,
      originalPrice: 280.0,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      rating: 5.0,
      reviews: 45,
      inStock: true,
      discount: 29,
      description: "Premium leather with stylish design",
    },
    {
      id: 9,
      name: "Casual Shirt",
      category: "Shirts",
      price: 35.99,
      originalPrice: 50.0,
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      rating: 4.4,
      reviews: 112,
      inStock: true,
      discount: 28,
      description: "Relaxed fit for casual occasions",
    },
    {
      id: 10,
      name: "Premium Polo",
      category: "Polo",
      price: 42.99,
      originalPrice: 60.0,
      image:
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
      rating: 4.7,
      reviews: 89,
      inStock: true,
      discount: 28,
      description: "High-end polo for special occasions",
    },
    {
      id: 11,
      name: "Athletic Wear",
      category: "Sports",
      price: 45.99,
      originalPrice: 65.0,
      image:
        "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=400",
      rating: 4.6,
      reviews: 134,
      inStock: true,
      discount: 29,
      description: "Performance gear for athletes",
    },
    {
      id: 12,
      name: "Zip-Up Hoodie",
      category: "Hoodies",
      price: 59.99,
      originalPrice: 80.0,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
      rating: 4.8,
      reviews: 167,
      inStock: true,
      discount: 25,
      description: "Versatile hoodie with zip closure",
    },
  ];

  // Categories
  const categories = [
    { id: "all", name: "All Products", count: 12 },
    { id: "t-shirts", name: "T-Shirts", count: 2 },
    { id: "jackets", name: "Jackets", count: 2 },
    { id: "shirts", name: "Shirts", count: 2 },
    { id: "polo", name: "Polo", count: 2 },
    { id: "sports", name: "Sports", count: 2 },
    { id: "hoodies", name: "Hoodies", count: 2 },
  ];

  // Load products
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All Products
          </h1>
          <p className="text-xl text-blue-100">
            Discover our complete collection of premium garments
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort & View Controls */}
            <div className="flex gap-3 w-full lg:w-auto">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 lg:flex-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex gap-2 border border-gray-300 dark:border-gray-600 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2"
              >
                <FiFilter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-4">
              {/* Mobile Close Button */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <span className="text-sm opacity-75">
                          ({category.count})
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "grid-cols-1 gap-4"
                }`}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonTable key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              // No Results
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <>
                {/* Products */}
                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "grid-cols-1 gap-4"
                  }`}
                >
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, viewMode }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  if (viewMode === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex">
        {/* Image */}
        <div className="w-48 h-48 flex-shrink-0 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
              -{product.discount}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                {product.category}
              </span>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition ${
                  isFavorite
                    ? "bg-red-100 dark:bg-red-900/20 text-red-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                }`}
              >
                <FiHeart
                  className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({product.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/product/${product.id}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FiEye className="w-5 h-5" />
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
            -{product.discount}%
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full backdrop-blur-sm transition ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            <FiHeart
              className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
            />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition"
          >
            <FiEye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="p-6">
        <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
          {product.category}
        </span>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 mt-1">
          {product.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <Link
            // to={`/product/${product.id}`}
            to={"/product-details"}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
