import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const GeneratePlacement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await api.get("/academic-years");
      const years = response.data.data.academic_years || [];
      setAcademicYears(years);
      const active = years.find((y) => y.is_active === 1);
      if (active) {
        setSelectedYear(active.id.toString());
      }
    } catch (error) {
      toast.error("Failed to fetch academic years");
    }
  };

  const handleGenerate = async () => {
    if (!selectedYear) {
      toast.error("Please select an academic year");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post("/placements/generate", {
        academic_year_id: parseInt(selectedYear),
      });
      setResult(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate placements",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Generate Placements
      </h1>

      <div className="card mb-6">
        <p className="text-gray-600 mb-4">
          This will automatically assign all active students to available dorms
          based on gender, department grouping, and dorm capacity.
        </p>
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="input-field"
            >
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.label} {year.is_active ? "(Active)" : ""}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Generating..." : "🚀 Generate Placements"}
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Placement Result</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Placed</p>
              <p className="text-2xl font-bold text-green-600">
                {result.placed || 0}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Unplaced</p>
              <p className="text-2xl font-bold text-red-600">
                {result.unplaced_count || 0}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Eligible</p>
              <p className="text-2xl font-bold text-blue-600">
                {result.total_eligible || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Year</p>
              <p className="text-2xl font-bold text-gray-600">
                #{result.academic_year_id}
              </p>
            </div>
          </div>

          {result.unplaced_students?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">
                Unplaced Students
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {result.unplaced_students.map((s, i) => (
                  <li key={i}>
                    • {s.name} ({s.department}) - {s.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate("/placements")}
              className="btn-secondary"
            >
              View All Placements
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePlacement;
