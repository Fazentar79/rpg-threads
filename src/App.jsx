import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./layouts/Main";
import { lazy, Suspense, useContext } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "./store/AuthProvider";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Subscription = lazy(() => import("./pages/Subscription.jsx"));
const Notifications = lazy(() => import("./pages/Notifications.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Signin = lazy(() => import("./pages/SignIn.jsx"));

export default function App() {
  const { user, loading } = useContext(AuthContext);

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={createBrowserRouter([
            {
              path: "/",
              element: <Main />,
              children: [
                {
                  path: "/",
                  index: true,
                  element: (
                    <Suspense>
                      <Home />
                    </Suspense>
                  ),
                },
                {
                  path: "/dashboard",
                  element: (
                    <Suspense>{user ? <Dashboard /> : <Signin />}</Suspense>
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
                {
                  path: "/signin",
                  element: (
                    <Suspense>
                      <Signin />
                    </Suspense>
                  ),
                },
              ],
            },
          ])}
        />
      </QueryClientProvider>
    </>
  );
}

// export default function App() {
//   return (
//     <>
//       <ToastContainer theme="dark" position="bottom-right" />
//       <QueryClientProvider client={queryClient}>
//         <RouterProvider router={router} />
//       </QueryClientProvider>
//     </>
//   );
// }
