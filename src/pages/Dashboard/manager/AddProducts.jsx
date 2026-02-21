import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  FiUpload,
  FiX,
  FiImage,
  FiAlertCircle,
  FiCheckCircle,
  FiSave,
  FiEye,
} from "react-icons/fi";
import ButtonLoader from "../../../components/ButtonLoader";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import {
  availableColors,
  availableSizes,
  categories,
} from "../../../data/data";

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Add New Product | GarmentTrack";

    return () => {
      document.title = "GarmentTrack";
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      brand: "",
      price: "",
      originalPrice: "",
      stock: "",
      description: "",
      features: "",
      sizes: [],
      colors: [],
      material: "",
      fitType: "",
      neckType: "",
      sleeveType: "",
      pattern: "",
      care: "",
      email: user?.email || "",
    },
  });

  const axiosSecure = useAxiosSecure();

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Watch form values for preview
  const watchAllFields = watch();

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 6) {
      toast.warning("Maximum 6 images allowed");
      return;
    }

    // Preview images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setImages([...images, ...files]);
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Handle size toggle
  const handleSizeToggle = (size) => {
    const currentSizes = watch("sizes") || [];
    if (currentSizes.includes(size)) {
      setValue(
        "sizes",
        currentSizes.filter((s) => s !== size),
      );
    } else {
      setValue("sizes", [...currentSizes, size]);
    }
  };

  // Handle color toggle
  const handleColorToggle = (colorName) => {
    const currentColors = watch("colors") || [];
    if (currentColors.includes(colorName)) {
      setValue(
        "colors",
        currentColors.filter((c) => c !== colorName),
      );
    } else {
      setValue("colors", [...currentColors, colorName]);
    }
  };

  // Generate SKU suggestion
  const generateSKU = () => {
    const category = watch("category");
    const name = watch("name");

    if (!category || !name) {
      toast.warning("Please select category and enter product name first");
      return;
    }

    const categoryPrefix = category.substring(0, 3).toUpperCase();
    const namePrefix = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 3);
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    const sku = `${categoryPrefix}-${namePrefix}${randomNum}`;
    setValue("sku", sku);
    toast.success("SKU generated!");
  };

  // Form submit
  const onSubmit = async (data) => {
    setSubmitError("");
    setSubmitSuccess(false);

    // Validations
    if (images.length === 0) {
      setSubmitError("Please upload at least one product image");
      return;
    }

    if (!data.sizes?.length) {
      setSubmitError("Please select at least one size");
      return;
    }

    if (!data.colors?.length) {
      setSubmitError("Please select at least one color");
      return;
    }

    try {
      toast.info("Uploading images...");

      // 1. Upload all images to imgbb
      const uploadPromises = images.map((image) => {
        const formData = new FormData();
        formData.append("image", image);

        const image_API_URL = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_key
        }`;

        return axios.post(image_API_URL, formData);
      });

      const uploadResponses = await Promise.all(uploadPromises);
      const imageUrls = uploadResponses.map((res) => res.data.data.display_url);

      toast.success("Images uploaded successfully!");

      // 2. Calculate discount
      let discount = 0;
      if (data.originalPrice && data.price) {
        discount = Math.round(
          ((data.originalPrice - data.price) / data.originalPrice) * 100,
        );
      }

      // 3. Process features (string → array)
      const featuresArray = data.features
        ? data.features
            .split("\n")
            .filter((f) => f.trim())
            .map((f) => f.trim())
        : [];

      // 4. Build specifications array
      const specifications = [
        data.material && { label: "Material", value: data.material },
        data.fitType && { label: "Fit", value: data.fitType },
        data.neckType && { label: "Neck Type", value: data.neckType },
        data.sleeveType && { label: "Sleeve", value: data.sleeveType },
        data.pattern && { label: "Pattern", value: data.pattern },
        data.care && { label: "Care", value: data.care },
      ].filter(Boolean);

      // 5. Build colors array with hex codes
      const colorsWithHex = data.colors.map((colorName) => {
        const colorObj = availableColors.find((c) => c.name === colorName);
        return {
          name: colorName,
          code: colorObj?.code || "#000000",
        };
      });

      // 6. Final product object
      const productData = {
        name: data.name,
        sku: data.sku.toUpperCase(),
        category: data.category,
        brand: data.brand,
        price: Number(data.price),
        originalPrice: Number(data.originalPrice || 0),
        discount,
        stock: Number(data.stock),
        description: data.description,
        features: featuresArray,
        sizes: data.sizes,
        colors: colorsWithHex,
        specifications,
        images: imageUrls,
        inStock: Number(data.stock) > 0,
        status: "active",
        rating: 0,
        reviews: 0,
        sales: 0,
        email: user?.email || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // console.log("Submitting product:", productData);

      // 7. Save to MongoDB
      const res = await axiosSecure.post("/products", productData);

      if (res.data.insertedId) {
        setSubmitSuccess(true);
        toast.success("Product added successfully! 🎉");

        setTimeout(() => {
          navigate("/dashboard/manage-products");
        }, 2000);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to add product. Please try again.",
      );
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Add New Product
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Fill in the product details to add it to your inventory
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <FiEye className="w-5 h-5" />
            {showPreview ? "Hide" : "Show"} Preview
          </button>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 animate-fade-in">
            <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                Product added successfully!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Redirecting to manage products...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {submitError}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Basic Information
                </h2>

                <div className="space-y-5">
                  {/* Product Name & SKU */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Name *
                      </label>
                      <input
                        {...register("name", {
                          required: "Product name is required",
                          minLength: {
                            value: 3,
                            message: "Name must be at least 3 characters",
                          },
                        })}
                        type="text"
                        className={`block w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.name
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="e.g., Premium Cotton T-Shirt"
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <FiAlertCircle className="w-4 h-4" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* SKU Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SKU (Stock Keeping Unit) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          {...register("sku", {
                            required: "SKU is required",
                            pattern: {
                              value: /^[A-Z0-9-]+$/,
                              message:
                                "SKU must contain only uppercase letters, numbers, and hyphens",
                            },
                          })}
                          type="text"
                          className={`flex-1 px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors.sku
                              ? "border-red-300 dark:border-red-600"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          placeholder="TSH-001-BLK"
                          style={{ textTransform: "uppercase" }}
                        />
                        <button
                          type="button"
                          onClick={generateSKU}
                          className="px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition whitespace-nowrap"
                        >
                          Generate
                        </button>
                      </div>
                      {errors.sku && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {errors.sku.message}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Example: TSH-PRE001, JKT-LEA002
                      </p>
                    </div>
                  </div>

                  {/* Category & Brand */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        {...register("category", {
                          required: "Category is required",
                        })}
                        className={`block w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.category
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Brand *
                      </label>
                      <input
                        {...register("brand", {
                          required: "Brand is required",
                        })}
                        type="text"
                        className={`block w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.brand
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="e.g., GarmentTrack"
                      />
                      {errors.brand && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {errors.brand.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price ($) *
                      </label>
                      <input
                        {...register("price", {
                          required: "Price is required",
                          min: {
                            value: 0.01,
                            message: "Price must be greater than 0",
                          },
                        })}
                        type="number"
                        step="0.01"
                        className={`block w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.price
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="25.99"
                      />
                      {errors.price && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Original Price ($)
                      </label>
                      <input
                        {...register("originalPrice", {
                          min: {
                            value: 0,
                            message: "Original price cannot be negative",
                          },
                        })}
                        type="number"
                        step="0.01"
                        className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="35.99"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        For showing discount
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        {...register("stock", {
                          required: "Stock quantity is required",
                          min: {
                            value: 0,
                            message: "Stock cannot be negative",
                          },
                        })}
                        type="number"
                        className={`block w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.stock
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="100"
                      />
                      {errors.stock && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {errors.stock.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 20,
                          message: "Description must be at least 20 characters",
                        },
                      })}
                      rows={5}
                      className={`block w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                        errors.description
                          ? "border-red-300 dark:border-red-600"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Detailed product description..."
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Key Features{" "}
                      <span className="text-gray-400">(One per line)</span>
                    </label>
                    <textarea
                      {...register("features")}
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="100% Premium Cotton&#10;Machine Washable&#10;Comfortable Fit&#10;Breathable Fabric"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Each line will be a separate feature
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Product Images
                </h2>

                {/* Upload Area */}
                <div className="mb-6">
                  <label className="block w-full cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-600 transition">
                      <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Click to upload product images
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        PNG, JPG up to 5MB (Max 6 images)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg font-semibold">
                            Main Image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Available Sizes *
                </h2>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-6 py-3 border-2 rounded-xl font-semibold transition ${
                        watch("sizes")?.includes(size)
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Selected: {watch("sizes")?.length || 0} sizes
                </p>
              </div>

              {/* Colors */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Available Colors *
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {availableColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleColorToggle(color.name)}
                      className="relative group"
                    >
                      <div
                        className={`w-16 h-16 rounded-full border-4 transition ${
                          watch("colors")?.includes(color.name)
                            ? "border-blue-600 scale-110"
                            : "border-gray-300 dark:border-gray-600 hover:scale-110"
                        }`}
                        style={{ backgroundColor: color.code }}
                      />
                      {watch("colors")?.includes(color.name) && (
                        <FiCheckCircle className="absolute inset-0 m-auto w-8 h-8 text-white drop-shadow-lg" />
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                        {color.name}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Selected: {watch("colors")?.length || 0} colors
                </p>
              </div>

              {/* Specifications */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Specifications (Optional)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Material
                    </label>
                    <input
                      {...register("material")}
                      type="text"
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 100% Cotton"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fit Type
                    </label>
                    <select
                      {...register("fitType")}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Fit</option>
                      <option value="Slim">Slim</option>
                      <option value="Regular">Regular</option>
                      <option value="Relaxed">Relaxed</option>
                      <option value="Oversized">Oversized</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Neck Type
                    </label>
                    <input
                      {...register("neckType")}
                      type="text"
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Crew Neck, V-Neck"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sleeve Type
                    </label>
                    <input
                      {...register("sleeveType")}
                      type="text"
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Short Sleeve, Long Sleeve"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pattern
                    </label>
                    <input
                      {...register("pattern")}
                      type="text"
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Solid, Striped"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Care Instructions
                    </label>
                    <input
                      {...register("care")}
                      type="text"
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Machine Wash"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <ButtonLoader text="Adding Product..." />
                  ) : (
                    <>
                      <FiSave className="w-5 h-5" />
                      <span>Add Product</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/manage-products")}
                  disabled={isSubmitting}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Live Preview
                </h2>

                {/* Preview Card */}
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  {/* Image */}
                  <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
                    {imagePreviews[0] ? (
                      <>
                        <img
                          src={imagePreviews[0]}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        {watchAllFields.originalPrice &&
                          watchAllFields.price &&
                          watchAllFields.originalPrice >
                            watchAllFields.price && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                              -
                              {Math.round(
                                ((watchAllFields.originalPrice -
                                  watchAllFields.price) /
                                  watchAllFields.originalPrice) *
                                  100,
                              )}
                              %
                            </div>
                          )}
                      </>
                    ) : (
                      <FiImage className="w-16 h-16 text-gray-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs font-semibold">
                        {watchAllFields.category || "Category"}
                      </span>
                    </div>

                    {watchAllFields.sku && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        SKU: {watchAllFields.sku}
                      </p>
                    )}

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {watchAllFields.name || "Product Name"}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {watchAllFields.description ||
                        "Product description will appear here..."}
                    </p>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        ${watchAllFields.price || "0.00"}
                      </span>
                      {watchAllFields.originalPrice &&
                        watchAllFields.originalPrice > watchAllFields.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${watchAllFields.originalPrice}
                          </span>
                        )}
                    </div>

                    {watchAllFields.stock && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        Stock: {watchAllFields.stock} units
                      </p>
                    )}

                    {/* Sizes */}
                    {watchAllFields.sizes?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Sizes:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {watchAllFields.sizes.map((size) => (
                            <span
                              key={size}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors */}
                    {watchAllFields.colors?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Colors:
                        </p>
                        <div className="flex gap-2">
                          {watchAllFields.colors
                            .slice(0, 5)
                            .map((colorName) => {
                              const color = availableColors.find(
                                (c) => c.name === colorName,
                              );
                              return (
                                <div
                                  key={colorName}
                                  className="w-6 h-6 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color?.code }}
                                  title={colorName}
                                />
                              );
                            })}
                          {watchAllFields.colors.length > 5 && (
                            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                              +{watchAllFields.colors.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
