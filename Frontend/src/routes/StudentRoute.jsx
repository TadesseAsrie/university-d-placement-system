import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "student") {
    return <Navigate to="/login" replace />;
  }
  

  return children;
};

export default StudentRoute;
