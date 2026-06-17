import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const Placements = () => {
  const [placements, setPlacements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchData();
    }
  }, [selectedYear]);

  const fetchAcademicYears = async () => {
    try {
      const response = await api.get("/academic-years");
      const years = response.data.data.academic_years || [];
      setAcademicYears(years);
      const active = years.find((y) => y.is_active === 1);
      if (active) {
        setSelectedYear(active.id.toString());
      } else if (years.length > 0) {
        setSelectedYear(years[0].id.toString());
      }
    } catch (error) {
      toast.error("Failed to fetch academic years");
    }
  };

  const fetchData = async () => {
    if (!selectedYear) return;
    setLoading(true);
    try {
      const [placementsRes, summaryRes] = await Promise.all([
        api.get(`/placements?academic_year_id=${selectedYear}`),
        api.get(`/reports/summary?academic_year_id=${selectedYear}`),
      ]);
      setPlacements(placementsRes.data.data.placements || []);
      setSummary(summaryRes.data.data);
    } catch (error) {
      toast.error("Failed to fetch placements");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        "⚠️ This will delete ALL placements for this academic year. Are you sure?",
      )
    )
      return;
    try {
      await api.post("/placements/reset", {
        academic_year_id: parseInt(selectedYear),
      });
      toast.success("Placements reset successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to reset placements");
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Placements</h1>
        <div className="flex gap-3">
          <Link to="/placements/generate" className="btn-primary">
            Generate Placements
          </Link>
          <button onClick={handleReset} className="btn-danger">
            Reset Year
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="input-field w-48"
            >
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.label} {year.is_active ? "(Active)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-6 ml-auto">
            <div>
              <p className="text-sm text-gray-500">Placed</p>
              <p className="text-xl font-bold text-green-600">
                {summary?.summary?.total_placed || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Unplaced</p>
              <p className="text-xl font-bold text-red-600">
                {summary?.summary?.total_unplaced || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Occupancy</p>
              <p className="text-xl font-bold text-primary-600">
                {summary?.summary?.occupancy_rate || "0%"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {placements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No placements found for this academic year.
            </p>
            <Link
              to="/placements/generate"
              className="btn-primary inline-block mt-4"
            >
              Generate Placements
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Department
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Block
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Room
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {placements.map((p) => (
                  <tr
                    key={p.placement_id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {p.first_name} {p.last_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {p.department}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {p.block_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {p.dorm_number}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(p.placement_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Placements;
