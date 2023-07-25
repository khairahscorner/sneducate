/* eslint-disable react/prop-types */
import { lazy, Suspense } from "react";
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
const DevDashboard = lazy(() => import("./pages/dev/dashboard"));
const DevSchools = lazy(() => import("./pages/dev/schools"));

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const UnprotectedRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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
              <Route
                path="/"
                element={
                  <UnprotectedRoute isAuthenticated={storageToken}>
                    <Login />
                  </UnprotectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <DevDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schools"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <DevSchools />
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
