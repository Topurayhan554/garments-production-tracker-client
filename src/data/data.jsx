import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiPackage,
  FiTrendingUp,
  FiCheckCircle,
  FiShoppingCart,
  FiHome,
  FiShoppingBag,
  FiClock,
  FiList,
  FiPlusCircle,
  FiBarChart,
  FiUsers,
  FiXCircle,
  FiDollarSign,
  FiAward,
  FiHeart,
  FiShield,
  FiGlobe,
} from "react-icons/fi";
// footer
export const quickLinks = [
  { name: "Home", path: "/" },
  { name: "All Products", path: "/all-products" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];
export const socialLinks = [
  {
    icon: <FiFacebook className="w-4 h-4" />,
    href: "#",
    label: "Facebook",
    color: "hover:bg-blue-600",
  },
  {
    icon: <FiTwitter className="w-4 h-4" />,
    href: "#",
    label: "Twitter",
    color: "hover:bg-sky-500",
  },
  {
    icon: <FiInstagram className="w-4 h-4" />,
    href: "#",
    label: "Instagram",
    color: "hover:bg-pink-600",
  },
  {
    icon: <FiLinkedin className="w-4 h-4" />,
    href: "#",
    label: "LinkedIn",
    color: "hover:bg-blue-700",
  },
  {
    icon: <FiYoutube className="w-4 h-4" />,
    href: "#",
    label: "YouTube",
    color: "hover:bg-red-600",
  },
];

// home
export const bannerImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    caption: "Premium Garment Collection",
    description: "Explore our exclusive range of high-quality apparel",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    caption: "Fashion Forward Designs",
    description: "Latest trends in garment manufacturing",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    caption: "Quality Production",
    description: "Track and manage your orders with ease",
  },
];

// How it works steps
export const steps = [
  {
    step: "01",
    title: "Browse Products",
    description: "Explore our wide range of high-quality garment products",
    icon: <FiPackage />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: "02",
    title: "Place Order",
    description: "Select your items and place your order with ease",
    icon: <FiShoppingCart />,
    color: "from-green-500 to-emerald-500",
  },
  {
    step: "03",
    title: "Track Production",
    description: "Monitor your order status in real-time",
    icon: <FiTrendingUp />,
    color: "from-purple-500 to-pink-500",
  },
  {
    step: "04",
    title: "Receive Product",
    description: "Get your quality products delivered on time",
    icon: <FiCheckCircle />,
    color: "from-yellow-500 to-orange-500",
  },
];

// Customer testimonials
export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Retailer",
    image: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    comment:
      "GarmentTrack has revolutionized how we manage our production. The tracking system is incredibly intuitive and has saved us countless hours!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Boutique Owner",
    image: "https://i.pravatar.cc/150?img=2",
    rating: 5,
    comment:
      "Outstanding quality and service! The platform makes it so easy to keep track of all our orders. Highly recommended!",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Online Store Manager",
    image: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    comment:
      "The best investment we've made for our business. Real-time tracking and excellent customer support make all the difference.",
  },
];

// DashboardLayout

// Admin Navigation
export const adminNavigation = [
  { name: "Overview", path: "/dashboard", icon: <FiHome />, exact: true },
  {
    name: "Manage Users",
    path: "/dashboard/manage-users",
    icon: <FiUsers />,
  },
  {
    name: "All Products",
    path: "/all-products",
    icon: <FiPackage />,
  },
  {
    name: "All Orders",
    path: "/dashboard/all-orders",
    icon: <FiShoppingBag />,
  },
  { name: "Analytics", path: "/dashboard/analytics", icon: <FiBarChart /> },
];

// Manager Navigation
export const managerNavigation = [
  { name: "Overview", path: "/dashboard", icon: <FiHome />, exact: true },
  {
    name: "Add Product",
    path: "/dashboard/add-product",
    icon: <FiPlusCircle />,
  },
  {
    name: "Manage Products",
    path: "/dashboard/manage-products",
    icon: <FiList />,
  },
  {
    name: "Pending Orders",
    path: "/dashboard/pending-orders",
    icon: <FiClock />,
  },
  {
    name: "Approved Orders",
    path: "/dashboard/approved-orders",
    icon: <FiCheckCircle />,
  },
];

// Buyer Navigation
export const buyerNavigation = [
  { name: "Overview", path: "/dashboard", icon: <FiHome />, exact: true },
  {
    name: "My Orders",
    path: "/dashboard/my-orders",
    icon: <FiShoppingBag />,
  },
  {
    name: "Track Order",
    path: "/dashboard/track-order",
    icon: <FiTrendingUp />,
  },
];

// add products
// Available options
export const categories = [
  "T-Shirts",
  "Shirts",
  "Polo",
  "Jackets",
  "Hoodies",
  "Sports",
  "Casual",
  "Formal",
];
export const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
export const availableColors = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Navy", code: "#000080" },
  { name: "Gray", code: "#808080" },
  { name: "Red", code: "#FF0000" },
  { name: "Blue", code: "#0000FF" },
  { name: "Green", code: "#008000" },
  { name: "Yellow", code: "#FFFF00" },
  { name: "Pink", code: "#FFC0CB" },
  { name: "Orange", code: "#FFA500" },
  { name: "Purple", code: "#800080" },
  { name: "Brown", code: "#A52A2A" },
];

// approved orders
export const productionStatuses = [
  { id: "all", name: "All Status", value: "all" },
  { id: "confirmed", name: "Confirmed", value: "confirmed" },
  { id: "in-production", name: "In Production", value: "in-production" },
  { id: "quality-check", name: "Quality Check", value: "quality-check" },
  { id: "packed", name: "Packed", value: "packed" },
  { id: "in-transit", name: "In Transit", value: "in-transit" },
  {
    id: "out-for-delivery",
    name: "Out for Delivery",
    value: "out-for-delivery",
  },
];

export const orderStatuses = [
  { id: "all", name: "All Orders" },
  { id: "pending", name: "Pending" },
  { id: "confirmed", name: "Confirmed" },
  { id: "in-production", name: "In Production" },
  { id: "shipped", name: "Shipped" },
  { id: "delivered", name: "Delivered" },
  { id: "cancelled", name: "Cancelled" },
];

// Cancel reasons
export const cancelReasons = [
  "Changed my mind",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Need to change size/color",
  "Delivery taking too long",
  "Other reasons",
];

// about us
export const stats = [
  { number: "10+", label: "Years Experience", icon: <FiAward /> },
  { number: "500+", label: "Happy Clients", icon: <FiUsers /> },
  { number: "10K+", label: "Products Delivered", icon: <FiCheckCircle /> },
  { number: "98%", label: "Satisfaction Rate", icon: <FiHeart /> },
];
// Core values
export const values = [
  {
    icon: <FiShield />,
    title: "Quality First",
    description:
      "We never compromise on quality. Every product meets the highest standards of excellence.",
    color: "blue",
  },
  {
    icon: <FiHeart />,
    title: "Customer Focus",
    description:
      "Your satisfaction is our priority. We build lasting relationships with our clients.",
    color: "red",
  },
  {
    icon: <FiTrendingUp />,
    title: "Innovation",
    description:
      "We embrace new technologies and methods to stay ahead in the garment industry.",
    color: "green",
  },
  {
    icon: <FiGlobe />,
    title: "Sustainability",
    description:
      "Committed to eco-friendly practices and sustainable production methods.",
    color: "purple",
  },
];
// Team members
export const team = [
  {
    name: "John Anderson",
    role: "CEO & Founder",
    image: "https://i.pravatar.cc/300?img=12",
    bio: "15+ years in garment industry",
  },
  {
    name: "Sarah Johnson",
    role: "Head of Operations",
    image: "https://i.pravatar.cc/300?img=1",
    bio: "Expert in production management",
  },
  {
    name: "Michael Chen",
    role: "Quality Assurance",
    image: "https://i.pravatar.cc/300?img=13",
    bio: "Ensuring excellence in every product",
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Relations",
    image: "https://i.pravatar.cc/300?img=5",
    bio: "Building strong client partnerships",
  },
];
// Milestones
export const milestones = [
  {
    year: "2014",
    title: "Company Founded",
    description: "Started with a vision to revolutionize garment production",
  },
  {
    year: "2016",
    title: "First Major Contract",
    description: "Secured partnership with leading fashion brands",
  },
  {
    year: "2019",
    title: "Expansion",
    description: "Opened new production facilities and expanded team",
  },
  {
    year: "2022",
    title: "Digital Transformation",
    description: "Launched advanced tracking and management system",
  },
  {
    year: "2024",
    title: "Industry Leader",
    description: "Recognized as top garment production company",
  },
];

// contact us
// Contact information
export const contactInfo = [
  {
    icon: <FiMapPin />,
    title: "Visit Us",
    details: ["123 Garment Street", "Dhaka, Bangladesh 1200"],
    color: "blue",
  },
  {
    icon: <FiPhone />,
    title: "Call Us",
    details: ["+880 1234-567890", "+880 9876-543210"],
    color: "green",
  },
  {
    icon: <FiMail />,
    title: "Email Us",
    details: ["info@garmenttrack.com", "support@garmenttrack.com"],
    color: "purple",
  },
  {
    icon: <FiClock />,
    title: "Working Hours",
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
    color: "orange",
  },
];

// FAQ
export const faqs = [
  {
    question: "How long does it take to process an order?",
    answer:
      "Typically, orders are processed within 2-3 business days. Rush orders can be accommodated with advance notice.",
  },
  {
    question: "What is your minimum order quantity?",
    answer:
      "Our minimum order quantity varies by product type. Please contact us for specific details.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship worldwide. Shipping costs and delivery times vary by destination.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Absolutely! Once your order is confirmed, you can track it in real-time through your dashboard.",
  },
];
