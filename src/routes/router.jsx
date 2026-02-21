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
import MyOrders from "../pages/Dashboard/buyer/MyOrders/MyOrders";
import FavoritesDropdown from "../pages/FavoritesDropdown/FavoritesDropdown";
import FavoritesPage from "../pages/FavoritesDropdown/FavoritePage";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import ErrorPage from "../pages/Errors/Errorpage";
import AdminRoute from "./Adminroute";
import ManagerRoute from "./ManagerRoute";
import Unauthorized from "../components/Unauthorized";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <Loading />,
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
        element: (
          <PrivateRoute>
            <FavoritesPage />
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
    path: "/unauthorized",
    element: <Unauthorized />,
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

      // admin
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-orders",
        element: (
          <AdminRoute>
            <AllOrders />
          </AdminRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        ),
      },

      // manager
      {
        path: "add-product",
        element: (
          <ManagerRoute>
            <AddProduct />
          </ManagerRoute>
        ),
      },
      {
        path: "manage-products",
        element: (
          <ManagerRoute>
            <ManageProducts />
          </ManagerRoute>
        ),
      },

      {
        path: "pending-orders",
        element: (
          <ManagerRoute>
            <PendingOrders />
          </ManagerRoute>
        ),
      },
      {
        path: "approved-orders",
        element: (
          <ManagerRoute>
            <ApprovedOrders />
          </ManagerRoute>
        ),
      },
      // edit product
      {
        path: "edit-product/:id",
        element: (
          <ManagerRoute>
            <EditProduct />
          </ManagerRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
