import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
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
import PendingOrders from "../pages/Dashboard/manager/PendingOrders";
import ApprovedOrders from "../pages/Dashboard/manager/ApporovedOrders";
import EditProduct from "../pages/Dashboard/manager/EditProduct";
import TrackOrder from "../pages/Dashboard/buyer/TrackOrder";
import PlaceOrder from "../pages/Product/PlaceOrder/PlaceOrder";
import CartPage from "../pages/CartPage/CartPage";
import Profile from "../pages/Dashboard/Profile/Profile";
import FavoritesPage from "../pages/FavoritePage/FavoritePage";
import MyOrders from "../pages/Dashboard/buyer/MyOrders/MyOrders";

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
        path: "/product/:id",
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/place-order",
        element: (
          <PrivateRoute>
            <PlaceOrder />
          </PrivateRoute>
        ),
      },
      {
        path: "/cart-page",
        element: (
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/favorites",
        element: <FavoritesPage />,
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
        path: "all-products",
        element: <AllProducts />,
      },
      {
        path: "profile",
        element: <Profile />,
      },

      // admin
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

      // manager
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "manage-products",
        element: <ManageProducts />,
      },

      {
        path: "pending-orders",
        element: <PendingOrders />,
      },
      {
        path: "approved-orders",
        element: <ApprovedOrders />,
      },
      // edit product
      {
        path: "edit-product/:id",
        element: <EditProduct />,
      },
      // buyer
      {
        path: "my-orders",
        element: <MyOrders />,
      },
      {
        path: "track-order",
        element: <TrackOrder />,
      },
      {
        path: "track-order/:trackingNumber",
        element: <TrackOrder />,
      },
    ],
  },
]);
