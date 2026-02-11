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
  FiDownload,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { SkeletonTable } from "../../../components/Loading";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { ToastContainer, toast } from "react-toastify";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myProducts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products?email=${user.email}`);
      return res.data;
    },
  });

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
      const name = product.name ? product.name.toLowerCase() : "";
      const sku = product.sku ? product.sku.toLowerCase() : "";
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || sku.includes(query);
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredProducts = getFilteredProducts();

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map((p) => p._id || p.id));
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

  // Handle delete click
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Handle view details
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  // Handle delete confirm - ✅ FIXED with await
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    const id = productToDelete._id || productToDelete.id;

    axiosSecure
      .delete(`/products/${id}`)
      .then((res) => {
        // console.log(res.data);
        if (res.data) {
          toast.success("Product deleted successfully!");
          setProducts(products.filter((p) => (p._id || p.id) !== id));

          // Refetch from server
          refetch();

          setShowDeleteModal(false);
          setProductToDelete(null);
        } else {
          toast.error("Failed to delete product");
        }
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("Failed to delete product");
      });
  };

  // Handle bulk delete - FIXED
  const handleBulkDelete = async () => {
    if (
      !window.confirm(`Delete ${selectedProducts.length} selected products?`)
    ) {
      return;
    }

    try {
      // Delete multiple products
      const deletePromises = selectedProducts.map((id) =>
        axiosSecure.delete(`/products/${id}`),
      );

      await Promise.all(deletePromises);

      toast.success(
        `${selectedProducts.length} products deleted successfully!`,
      );

      // Remove from local state
      setProducts(
        products.filter((p) => !selectedProducts.includes(p._id || p.id)),
      );

      // Clear selection
      setSelectedProducts([]);

      // Refetch from server
      refetch();
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Failed to delete products");
    }
  };

  // Handle status toggle - FIXED
  const handleStatusToggle = async (productId) => {
    const product = products.find((p) => (p._id || p.id) === productId);
    if (!product) return;

    const newStatus = product.status === "active" ? "inactive" : "active";

    try {
      const id = product._id || product.id;
      await axiosSecure.patch(`/products/${id}/status`, { status: newStatus });

      // Update local state
      setProducts(
        products.map((p) =>
          (p._id || p.id) === productId ? { ...p, status: newStatus } : p,
        ),
      );

      toast.success(`Product status changed to ${newStatus}`);
      refetch();
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error("Failed to update status");
    }
  };

  // Stats
  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    outOfStock: products.filter((p) => !p.inStock || p.stock === 0).length,
    lowStock: products.filter((p) => p.inStock && p.stock < 20).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all your products ({products.length})
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
                          selectedProducts.length === filteredProducts.length &&
                          filteredProducts.length > 0
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
                  {filteredProducts.map((product) => {
                    const productId = product._id || product.id;
                    return (
                      <tr
                        key={productId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(productId)}
                            onChange={() => handleSelectProduct(productId)}
                            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0] || "/placeholder.png"}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder.png";
                              }}
                            />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                SKU: {product.sku || "N/A"}
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
                            {product.stock || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900 dark:text-white">
                            {product.sales || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleStatusToggle(productId)}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                              product.status === "active"
                                ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {product.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                              title="View"
                            >
                              <FiEye className="w-5 h-5" />
                            </button>
                            <Link
                              to={`/dashboard/edit-product/${productId}`}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

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

      {/* Product Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Product Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Product Images */}
              <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedProduct.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.png"}
                      alt={`${selectedProduct.name} - ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Product Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Product Name
                  </label>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {selectedProduct.name}
                  </p>
                </div>

                {/* SKU */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    SKU
                  </label>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {selectedProduct.sku || "N/A"}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Category
                  </label>
                  <p className="mt-1">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold">
                      {selectedProduct.category}
                    </span>
                  </p>
                </div>

                {/* Price */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Price
                  </label>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    ${selectedProduct.price}
                  </p>
                </div>

                {/* Stock */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Stock
                  </label>
                  <p
                    className={`text-lg font-bold mt-1 ${
                      selectedProduct.stock === 0
                        ? "text-red-600 dark:text-red-400"
                        : selectedProduct.stock < 20
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {selectedProduct.stock || 0} units
                  </p>
                </div>

                {/* Sales */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Total Sales
                  </label>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {selectedProduct.sales || 0} units
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <p className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                        selectedProduct.status === "active"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {selectedProduct.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </p>
                </div>

                {/* Brand */}
                {selectedProduct.brand && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Brand
                    </label>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {selectedProduct.brand}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div className="mt-6">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Description
                  </label>
                  <p className="text-gray-900 dark:text-white mt-2 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              {/* Sizes */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="mt-6">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-semibold"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div className="mt-6">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Available Colors
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-semibold"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
              <Link
                to={`/dashboard/edit-product/${selectedProduct._id || selectedProduct.id}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                onClick={() => setShowDetailsModal(false)}
              >
                <FiEdit className="w-5 h-5" />
                Edit Product
              </Link>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageProducts;
