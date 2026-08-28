import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Web3Provider } from "./context/Web3Context";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Upload from "./components/Upload";
import History from "./pages/PatientDashboard/History";

// Protected Route Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        {/* Public Landing & Auth */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Dedicated Upload View */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRoles={["patient", "doctor", "admin"]}>
              <div className="max-w-4xl mx-auto py-10 px-4">
                <Upload />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Dedicated Vault / History View */}
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["patient", "doctor", "admin"]}>
              <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <History />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Role Portals */}
        <Route
          path="/patient-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["patient", "admin"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["doctor", "admin"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Web3Provider>
          <AppRoutes />
        </Web3Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
