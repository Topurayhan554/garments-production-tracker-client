import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyOrders from "../pages/Dashboard/MyOrders/MyOrders";
import AboutUs from "../pages/Home/AboutUs/AboutUs";
import ContactUs from "../pages/Home/ContactUs/ContactUs";
import ProductDetails from "../pages/Product/ProductDetails/ProductDetails";
import AllProducts from "../pages/Product/AllProducts/AllProducts";
import AddProduct from "../pages/Dashboard/manager/AddProducts";
import ManageProducts from "../pages/Dashboard/manager/ManageProducts";
import Overview from "../pages/Dashboard/Overview/Overview";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import AllOrders from "../pages/Dashboard/Admin/AllOrders";
import Analytics from "../pages/Dashboard/Admin/Analytics";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/all-products",
        element: <AllProducts />,
      },
      {
        path: "/product-details",
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: "my-orders",
        element: <MyOrders />,
      },

      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "manage-products",
        element: <ManageProducts />,
      },
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
      {
        path: "all-orders",
        element: <AllOrders />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
]);
