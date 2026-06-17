import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const Reports = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [summary, setSummary] = useState(null);
  const [occupancy, setOccupancy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchReports();
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

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [summaryRes, occupancyRes] = await Promise.all([
        api.get(`/reports/summary?academic_year_id=${selectedYear}`),
        api.get(`/reports/occupancy?academic_year_id=${selectedYear}`),
      ]);
      setSummary(summaryRes.data.data);
      setOccupancy(occupancyRes.data.data.occupancy || []);
    } catch (error) {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      window.open(
        `${import.meta.env.VITE_API_URL}/reports/export?academic_year_id=${selectedYear}`,
        "_blank",
      );
    } catch (error) {
      toast.error("Failed to export CSV");
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
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <div className="flex gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="input-field w-48"
          >
            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.label}
              </option>
            ))}
          </select>
          <button onClick={handleExportCSV} className="btn-primary">
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-gray-800">
            {summary?.summary?.total_active_students || 0}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Placed</p>
          <p className="text-2xl font-bold text-green-600">
            {summary?.summary?.total_placed || 0}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Unplaced</p>
          <p className="text-2xl font-bold text-red-600">
            {summary?.summary?.total_unplaced || 0}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Occupancy Rate</p>
          <p className="text-2xl font-bold text-primary-600">
            {summary?.summary?.occupancy_rate || "0%"}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">
          Dorm Occupancy Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Block
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Room
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Capacity
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Occupancy
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Available
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {occupancy.map((room) => (
                <tr
                  key={`${room.block_name}-${room.dorm_number}`}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {room.block_name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {room.dorm_number}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {room.capacity}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {room.current_occupancy}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {room.available_spots}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        room.available_spots === 0
                          ? "bg-red-100 text-red-700"
                          : room.current_occupancy === 0
                            ? "bg-gray-100 text-gray-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {room.available_spots === 0
                        ? "Full"
                        : room.current_occupancy === 0
                          ? "Empty"
                          : "Partial"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
