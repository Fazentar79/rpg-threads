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
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Signin = lazy(() => import("./pages/SignIn.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const DeleteUserAccount = lazy(() => import("./pages/DeleteUserAccount.jsx"));
const UpdatedPseudo = lazy(() => import("./pages/updatedPseudo.jsx"));
const AddThread = lazy(() => import("./pages/AddThread.jsx"));
const UpdatedThread = lazy(() => import("./pages/UpdatedThread.jsx"));
const UpdatedAvatar = lazy(() => import("./pages/UpdatedAvatar.jsx"));
const Profiles = lazy(() => import("./pages/Profiles.jsx"));

export default function App() {
  const { user } = useContext(AuthContext);

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
                  element: <Suspense>{user ? <Home /> : <Signin />}</Suspense>,
                },
                {
                  path: "/dashboard",
                  element: (
                    <Suspense>{user ? <Dashboard /> : <Signin />}</Suspense>
                  ),
                },
                {
                  path: "/subscription",
                  element: (
                    <Suspense>{user ? <Subscription /> : <Signin />}</Suspense>
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
                {
                  path: "/forgot-password",
                  element: (
                    <Suspense>
                      <ForgotPassword />
                    </Suspense>
                  ),
                },
                {
                  path: "/delete-account",
                  element: (
                    <Suspense>
                      <DeleteUserAccount />
                    </Suspense>
                  ),
                },
                {
                  path: "/updated-pseudo",
                  element: (
                    <Suspense>
                      <UpdatedPseudo />
                    </Suspense>
                  ),
                },
                {
                  path: "/updated-avatar",
                  element: (
                    <Suspense>
                      <UpdatedAvatar />
                    </Suspense>
                  ),
                },
                {
                  path: "/updated-thread/:id",
                  element: (
                    <Suspense>
                      <UpdatedThread />
                    </Suspense>
                  ),
                },
                {
                  path: "/add-thread",
                  element: (
                    <Suspense>
                      <AddThread />
                    </Suspense>
                  ),
                },
                {
                  path: "/profiles/:id",
                  element: (
                    <Suspense>
                      <Profiles />
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
