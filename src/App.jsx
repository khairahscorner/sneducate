/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Preloader } from "./components/pageloader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = lazy(() => import("./pages/login"));
const DevDashboard = lazy(() => import("./pages/dashboard"));
const Schools = lazy(() => import("./pages/dev/schools"));

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const storageToken = localStorage.getItem("token");

  return (
    <>
      <Router>
        <Suspense fallback={<Preloader />}>
          <Routes>
            <>
              <Route path="/" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    isAuthenticated={storageToken}
                  >
                    <DevDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          </Routes>
        </Suspense>
      </Router>

      <ToastContainer
        progressStyle={{ backgroundColor: "#ecc52c" }}
        closeButton={false}
      />
    </>
  );
};

export default App;
