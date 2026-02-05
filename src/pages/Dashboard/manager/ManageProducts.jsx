import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiMoreVertical,
  FiDownload,
  FiUpload,
} from "react-icons/fi";
import { SkeletonTable } from "../../../components/Loading";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageProducts = () => {
  //   const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data = [], isLoading } = useQuery({
    queryKey: ["myProducts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products?email=${user.email}`);
      return res.data;
    },
  });

  console.log("after save", products);

  // Mock products data
  //   const mockProducts = [
  //     {
  //       id: 1,
  //       name: "Premium Cotton T-Shirt",
  //       category: "T-Shirts",
  //       price: 25.99,
  //       stock: 45,
  //       inStock: true,
  //       image:
  //         "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
  //       sku: "TSH-001",
  //       status: "active",
  //       sales: 124,
  //       createdAt: "2024-01-15",
  //     },
  //     {
  //       id: 2,
  //       name: "Classic Denim Jacket",
  //       category: "Jackets",
  //       price: 89.99,
  //       stock: 23,
  //       inStock: true,
  //       image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100",
  //       sku: "JKT-002",
  //       status: "active",
  //       sales: 89,
  //       createdAt: "2024-01-14",
  //     },
  //     {
  //       id: 3,
  //       name: "Formal Business Shirt",
  //       category: "Shirts",
  //       price: 45.99,
  //       stock: 67,
  //       inStock: true,
  //       image:
  //         "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100",
  //       sku: "SHT-003",
  //       status: "active",
  //       sales: 156,
  //       createdAt: "2024-01-13",
  //     },
  //     {
  //       id: 4,
  //       name: "Casual Polo Shirt",
  //       category: "Polo",
  //       price: 32.99,
  //       stock: 0,
  //       inStock: false,
  //       image:
  //         "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=100",
  //       sku: "PLO-004",
  //       status: "inactive",
  //       sales: 92,
  //       createdAt: "2024-01-12",
  //     },
  //     {
  //       id: 5,
  //       name: "Sports Jersey",
  //       category: "Sports",
  //       price: 39.99,
  //       stock: 34,
  //       inStock: true,
  //       image:
  //         "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=100",
  //       sku: "SPT-005",
  //       status: "active",
  //       sales: 78,
  //       createdAt: "2024-01-11",
  //     },
  //     {
  //       id: 6,
  //       name: "Winter Hoodie",
  //       category: "Hoodies",
  //       price: 54.99,
  //       stock: 89,
  //       inStock: true,
  //       image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100",
  //       sku: "HOD-006",
  //       status: "active",
  //       sales: 203,
  //       createdAt: "2024-01-10",
  //     },
  //     {
  //       id: 7,
  //       name: "Designer T-Shirt",
  //       category: "T-Shirts",
  //       price: 28.99,
  //       stock: 12,
  //       inStock: true,
  //       image:
  //         "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100",
  //       sku: "TSH-007",
  //       status: "active",
  //       sales: 67,
  //       createdAt: "2024-01-09",
  //     },
  //     {
  //       id: 8,
  //       name: "Leather Jacket",
  //       category: "Jackets",
  //       price: 199.99,
  //       stock: 5,
  //       inStock: true,
  //       image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100",
  //       sku: "JKT-008",
  //       status: "active",
  //       sales: 45,
  //       createdAt: "2024-01-08",
  //     },
  //   ];

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "T-Shirts", name: "T-Shirts" },
    { id: "Jackets", name: "Jackets" },
    { id: "Shirts", name: "Shirts" },
    { id: "Polo", name: "Polo" },
    { id: "Sports", name: "Sports" },
    { id: "Hoodies", name: "Hoodies" },
  ];

  // Load products

  useEffect(() => {
    if (data?.length) {
      setProducts(data);
    }
  }, [data]);

  // Filter products
  const getFilteredProducts = () => {
    return products.filter((product) => {
      // Safe strings
      const name = product.name ? product.name.toLowerCase() : "";
      const sku = product.sku ? product.sku.toLowerCase() : "";
      const query = searchQuery.toLowerCase();

      // Search filter
      const matchesSearch = name.includes(query) || sku.includes(query);

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredProducts = getFilteredProducts();

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle select product
  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Handle delete
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: Implement actual delete
    setProducts(products.filter((p) => p.id !== productToDelete.id));
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (
      window.confirm(`Delete ${selectedProducts.length} selected products?`)
    ) {
      setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    }
  };

  // Handle status toggle
  //   const handleStatusToggle = (productId) => {
  //     setProducts(
  //       products.map((p) =>
  //         p.id === productId
  //           ? { ...p, status: p.status === "active" ? "inactive" : "active" }
  //           : p,
  //       ),
  //     );
  //   };

  // Stats
  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    outOfStock: products.filter((p) => !p.inStock).length,
    lowStock: products.filter((p) => p.inStock && p.stock < 20).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1>Products: {products.length}</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all your products
            </p>
          </div>

          <Link
            to="/dashboard/add-product"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Active Products
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.active}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Out of Stock
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.outOfStock}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <FiXCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Low Stock
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.lowStock}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                <FiFilter className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2"
                >
                  <FiTrash2 className="w-5 h-5" />
                  Delete ({selectedProducts.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <SkeletonTable rows={8} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter
              </p>
              <Link
                to="/dashboard/add-product"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                <FiPlus className="w-5 h-5" />
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts.length === filteredProducts.length
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Sales
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              SKU: {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${product.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-semibold ${
                            product.stock === 0
                              ? "text-red-600 dark:text-red-400"
                              : product.stock < 20
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 dark:text-white">
                          {product.sales}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusToggle(product.id)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                            product.status === "active"
                              ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {product.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="View"
                          >
                            <FiEye className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/dashboard/edit-product/${product.id}`}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                            title="Edit"
                          >
                            <FiEdit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {filteredProducts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </p>

              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
                  <FiDownload className="w-4 h-4" />
                  Export
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
                  <FiUpload className="w-4 h-4" />
                  Import
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Delete Product?
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This
              action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
