/* eslint-disable react/prop-types */
import { lazy, Suspense, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Preloader } from "./components/pageloader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SmallScreenMessage } from "./components/smallScreenWrapper";

const Login = lazy(() => import("./pages/login"));
const ActivateAccount = lazy(() => import("./pages/activateAccount"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Schools = lazy(() => import("./pages/dev/schools"));
const SchoolProfile = lazy(() => import("./pages/admins/schoolProfile"));
const SchoolStaffs = lazy(() => import("./pages/admins/staffs"));
const SchoolStudents = lazy(() => import("./pages/admins/students"));
const SchoolReports = lazy(() => import("./pages/admins/reports"));
const StaffStudents = lazy(() => import("./pages/staffs/students"));
const TermCurriculums = lazy(() => import("./pages/staffs/termCurriculums"));
const Assessments = lazy(() => import("./pages/staffs/assessments"));
const StaffReports = lazy(() => import("./pages/staffs/reports"));

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
  const [showSmallScreenMessage, setShowSmallScreenMessage] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShowSmallScreenMessage(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (showSmallScreenMessage) {
    return <SmallScreenMessage />;
  }
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
              <Route path="/verify" element={<ActivateAccount />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* for platform devs  */}
              <Route
                path="/schools"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <Schools />
                  </ProtectedRoute>
                }
              />

              {/* school admin routes  */}
              <Route
                path="/school/profile"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <SchoolProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school/staffs"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <SchoolStaffs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school/students"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <SchoolStudents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school/reports"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <SchoolReports />
                  </ProtectedRoute>
                }
              />

              {/* school staff routes */}
              <Route
                path="/school/:schoolId/:staffId/students"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <StaffStudents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school/:schoolId/:staffId/curriculums"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <TermCurriculums />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school/:schoolId/:staffId/assessments"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <Assessments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school/:schoolId/:staffId/reports"
                element={
                  <ProtectedRoute isAuthenticated={storageToken}>
                    <StaffReports />
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
