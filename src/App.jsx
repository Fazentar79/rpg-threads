import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./layouts/Main";
import { lazy, Suspense, useContext } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "./store/AuthProvider.jsx";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Subscription = lazy(() => import("./pages/Subscription.jsx"));
const Notifications = lazy(() => import("./pages/Notifications.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));

const { user, loading } = useContext(AuthContext);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        index: true,
        element: <Suspense>{user ? <Dashboard /> : <Home />}</Suspense>,
      },
      {
        path: "/dashboard",
        element: (
          <Suspense>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "/notifications",
        element: (
          <Suspense>
            <Notifications />
          </Suspense>
        ),
      },
      {
        path: "/subscription",
        element: (
          <Suspense>
            <Subscription />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense>
            <Signup />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}
