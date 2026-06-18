import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Students from "../pages/student/Students";
import AddStudent from "../pages/student/AddStudent";
import Blocks from "../pages/blocks/Blocks";
import Dorms from "../pages/dorms/Dorms";
import Placements from "../pages/placements/Placements";
import GeneratePlacement from "../pages/placements/GeneratePlacement";
import Reports from "../pages/reports/Reports";
import StudentDashboard from "../pages/students/StudentDashboard";
import MyPlacement from "../pages/students/MyPlacement";
import AdminRoute from "./AdminRoute";
import StudentRoute from "./StudentRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import AcademicYear from "../pages/academic/AcademicYears";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes - All authenticated users */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Admin Routes */}
        <Route
          path="dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="students"
          element={
            <AdminRoute>
              <Students />
            </AdminRoute>
          }
        />
        <Route
          path="students/add"
          element={
            <AdminRoute>
              <AddStudent />
            </AdminRoute>
          }
        />
        <Route
          path="blocks"
          element={
            <AdminRoute>
              <Blocks />
            </AdminRoute>
          }
        />
        <Route
          path="dorms"
          element={
            <AdminRoute>
              <Dorms />
            </AdminRoute>
          }
        />
        <Route
          path="placements"
          element={
            <AdminRoute>
              <Placements />
            </AdminRoute>
          }
        />
        <Route
          path="placements/generate"
          element={
            <AdminRoute>
              <GeneratePlacement />
            </AdminRoute>
          }
        />
        <Route
          path="reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="student/dashboard"
          element={
            <StudentRoute>
              <StudentDashboard />
            </StudentRoute>
          }
        />
        <Route
          path="student/placement"
          element={
            <StudentRoute>
              <MyPlacement />
            </StudentRoute>
          }
        />
        <Route
          path="academic-year"
          element={
            <AdminRoute>
              <AcademicYear />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
