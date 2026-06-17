import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  HomeModernIcon,
  UserIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, placementRes] = await Promise.all([
        api.get("/students/me/profile"),
        api.get("/student/placement"), // You'll need to add this endpoint
      ]);
      setProfile(profileRes.data.data.student);
      setPlacement(placementRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Student Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <UserIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Welcome</p>
              <p className="font-semibold text-gray-800">
                {profile?.first_name} {profile?.last_name}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-semibold text-gray-800">
                {profile?.department || "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <HomeModernIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Room Status</p>
              <p className="font-semibold text-gray-800">
                {placement ? `Room ${placement.dorm_number}` : "Not Placed"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {placement ? (
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">
            🏠 Your Room Assignment
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Block</p>
              <p className="font-medium text-gray-800">
                {placement.block_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Room Number</p>
              <p className="font-medium text-gray-800">
                {placement.dorm_number}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Academic Year</p>
              <p className="font-medium text-gray-800">
                {placement.academic_year_label}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Placed On</p>
              <p className="font-medium text-gray-800">
                {new Date(placement.placement_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">
            You haven't been placed in a dorm yet.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Please contact the administrator.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
