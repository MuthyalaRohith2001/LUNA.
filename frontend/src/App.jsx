import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./pages/UserLayout";
import Home from "./components/Layout/Home";
import { Toaster } from "sonner";
import Login from "./components/Layout/Login";
import Register from "./components/Layout/Register";
import Profile from "./components/Layout/Profile";
import CollectionPage from "./components/Layout/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./components/Layout/OrderConfirmationPage";
import OrderDetailsPage from "./components/Layout/OrderDetailsPage";
import MyOrdersPage from "./components/Layout/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./components/Admin/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";
import ProtectedRoute from "./components/Common/ProtectedRoute";

const App = () => {
  const router = createBrowserRouter([
    {
      /*User Layout */
      path: "/",
      element: <UserLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "collections/:collection" /**:collection is a route parameter (URL param) */,
          element: <CollectionPage />,
        },
        {
          path: "collections",
          element: <CollectionPage />,
        },
        {
          path: "product/:id",
          element: <ProductDetails />,
        },
        {
          path: "checkout",
          element: <Checkout />,
        },
        { path: "order-confirmation", element: <OrderConfirmationPage /> },
        {
          path: "order/:id",
          element: <OrderDetailsPage />,
        },
        {
          path: "/my-orders",
          element: <MyOrdersPage />,
        },
      ],
    },
    {
      /* Admin Layout */
      path: "/admin",
      element: (
        <ProtectedRoute role="admin">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminHomePage /> },
        {
          path: "users",
          element: <UserManagement />,
        },
        {
          path: "products",
          element: <ProductManagement />,
        },
        {
          path: "products/:id/edit",
          element: <EditProductPage />,
        },
        {
          path: "orders",
          element: <OrderManagement />,
        },
      ],
    },
  ]);
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={router} />
    </>
  );
};

export default App;

/*Enabling client-side routing  createBrowserRouter */
