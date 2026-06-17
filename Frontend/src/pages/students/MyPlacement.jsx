import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const MyPlacement = () => {
  const { user } = useAuth();
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacement();
  }, []);

  const fetchPlacement = async () => {
    try {
      const response = await api.get("/student/placement");
      setPlacement(response.data.data);
    } catch (error) {
      console.error("Failed to fetch placement:", error);
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

  if (!placement) {
    return (
      <div className="card text-center py-16">
        <div className="text-6xl mb-4">🏠</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Placement Yet
        </h2>
        <p className="text-gray-500">
          You haven't been assigned to a dorm room for this academic year.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Please contact the dormitory administrator.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Placement</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Room Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Block</span>
              <span className="font-medium text-gray-800">
                {placement.block_name}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Room Number</span>
              <span className="font-medium text-gray-800">
                {placement.dorm_number}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Academic Year</span>
              <span className="font-medium text-gray-800">
                {placement.academic_year_label}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Placed On</span>
              <span className="font-medium text-gray-800">
                {new Date(placement.placement_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Roommates</h3>
          {placement.roommates?.length > 0 ? (
            <ul className="space-y-2">
              {placement.roommates.map((roommate, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-sm">
                    {roommate.first_name[0]}
                    {roommate.last_name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {roommate.first_name} {roommate.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {roommate.department}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No roommates assigned yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPlacement;
