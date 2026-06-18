// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../services/api";
// import toast from "react-hot-toast";

// const Placements = () => {
//   const [placements, setPlacements] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [academicYears, setAcademicYears] = useState([]);
//   const [selectedYear, setSelectedYear] = useState("");

//   useEffect(() => {
//     fetchAcademicYears();
//   }, []);

//   useEffect(() => {
//     if (selectedYear) {
//       fetchData();
//     }
//   }, [selectedYear]);

//   const fetchAcademicYears = async () => {
//     try {
//       const response = await api.get("/academic-years");
//       const years = response.data.data.academic_years || [];
//       setAcademicYears(years);
//       const active = years.find((y) => y.is_active === 1);
//       if (active) {
//         setSelectedYear(active.id.toString());
//       } else if (years.length > 0) {
//         setSelectedYear(years[0].id.toString());
//       }
//     } catch (error) {
//       toast.error("Failed to fetch academic years");
//     }
//   };

//   const fetchData = async () => {
//     if (!selectedYear) return;
//     setLoading(true);
//     try {
//       const [placementsRes, summaryRes] = await Promise.all([
//         api.get(`/placements?academic_year_id=${selectedYear}`),
//         api.get(`/reports/summary?academic_year_id=${selectedYear}`),
//       ]);
//       setPlacements(placementsRes.data.data.placements || []);
//       setSummary(summaryRes.data.data);
//     } catch (error) {
//       toast.error("Failed to fetch placements");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = async () => {
//     if (
//       !confirm(
//         "⚠️ This will delete ALL placements for this academic year. Are you sure?",
//       )
//     )
//       return;
//     try {
//       await api.post("/placements/reset", {
//         academic_year_id: parseInt(selectedYear),
//       });
//       toast.success("Placements reset successfully");
//       fetchData();
//     } catch (error) {
//       toast.error("Failed to reset placements");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
//         <h1 className="text-2xl font-bold text-gray-800">Placements</h1>
//         <div className="flex gap-3">
//           <Link to="/placements/generate" className="btn-primary">
//             Generate Placements
//           </Link>
//           <button onClick={handleReset} className="btn-danger">
//             Reset Year
//           </button>
//         </div>
//       </div>

//       <div className="card mb-6">
//         <div className="flex items-center gap-4 flex-wrap">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Academic Year
//             </label>
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//               className="input-field w-48"
//             >
//               {academicYears.map((year) => (
//                 <option key={year.id} value={year.id}>
//                   {year.label} {year.is_active ? "(Active)" : ""}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex gap-6 ml-auto">
//             <div>
//               <p className="text-sm text-gray-500">Placed</p>
//               <p className="text-xl font-bold text-green-600">
//                 {summary?.summary?.total_placed || 0}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Unplaced</p>
//               <p className="text-xl font-bold text-red-600">
//                 {summary?.summary?.total_unplaced || 0}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Occupancy</p>
//               <p className="text-xl font-bold text-primary-600">
//                 {summary?.summary?.occupancy_rate || "0%"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="card">
//         {placements.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500">
//               No placements found for this academic year.
//             </p>
//             <Link
//               to="/placements/generate"
//               className="btn-primary inline-block mt-4"
//             >
//               Generate Placements
//             </Link>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     Student
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     Department
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     Block
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     Room
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     Date
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {placements.map((p) => (
//                   <tr
//                     key={p.placement_id}
//                     className="border-b border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="py-3 px-4 text-sm text-gray-800">
//                       {p.first_name} {p.last_name}
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-600">
//                       {p.department}
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-600">
//                       {p.block_name}
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-600">
//                       {p.dorm_number}
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-600">
//                       {new Date(p.placement_date).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Placements;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  UserGroupIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Placements = () => {
  const [placements, setPlacements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

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
      setCurrentPage(1);
    } catch (error) {
      toast.error("Failed to fetch placements");
    } finally {
      setLoading(false);
    }
  };

  const handleResetClick = () => setModalOpen(true);

  const handleConfirmReset = async () => {
    setModalLoading(true);
    try {
      await api.post("/placements/reset", {
        academic_year_id: parseInt(selectedYear),
      });
      toast.success("Placements reset successfully");
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset placements",
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Filter placements by search
  const filteredPlacements = placements.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(search) ||
      p.department?.toLowerCase().includes(search) ||
      p.block_name?.toLowerCase().includes(search) ||
      p.dorm_number?.toLowerCase().includes(search) ||
      p.student_id?.toLowerCase().includes(search)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPlacements.length / itemsPerPage);
  const paginatedPlacements = filteredPlacements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Helper: get initials
  const getInitials = (first, last) => {
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  };

  // Helper: get random vibrant color
  const getVibrantColor = (str) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-green-500 to-green-600",
      "from-yellow-500 to-yellow-600",
      "from-red-500 to-red-600",
      "from-indigo-500 to-indigo-600",
      "from-teal-500 to-teal-600",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Helper: get department color
  const getDepartmentColor = (department) => {
    const colors = {
      "computer science": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "software engineering":
        "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "civil engineering":
        "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "electrical engineering":
        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "mechanical engineering": "bg-red-500/20 text-red-400 border-red-500/30",
      business: "bg-green-500/20 text-green-400 border-green-500/30",
      "information technology":
        "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "data science": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    };
    const key = department?.toLowerCase() || "";
    for (const [k, v] of Object.entries(colors)) {
      if (key.includes(k)) return v;
    }
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            🏠 Placements
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage student dormitory assignments
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/placements/generate" className="btn-primary">
            <ArrowPathIcon className="w-5 h-5 inline mr-2" />
            Generate
          </Link>
          <button onClick={handleResetClick} className="btn-danger">
            Reset Year
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Total Students
          </p>
          <p className="text-2xl font-bold text-white mt-1">
            {summary?.summary?.total_active_students || 0}
          </p>
        </div>
        <div className="glass-card p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Placed
          </p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {summary?.summary?.total_placed || 0}
          </p>
        </div>
        <div className="glass-card p-4 border-l-4 border-red-500">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Unplaced
          </p>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {summary?.summary?.total_unplaced || 0}
          </p>
        </div>
        <div className="glass-card p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Occupancy
          </p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {summary?.summary?.occupancy_rate || "0%"}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="input-field"
            >
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.label} {year.is_active ? "★" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students, rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card p-0 overflow-hidden">
        {paginatedPlacements.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-gray-400 text-lg">
              {searchTerm ? "No results found" : "No placements yet"}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {searchTerm
                ? "Try adjusting your search"
                : "Generate placements to get started"}
            </p>
            {!searchTerm && (
              <Link
                to="/placements/generate"
                className="btn-primary inline-block mt-6"
              >
                Generate Placements
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/5">
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-black-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-black-300 uppercase tracking-wider hidden md:table-cell">
                      ID
                    </th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-black-300 uppercase tracking-wider hidden lg:table-cell">
                      Department
                    </th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-black-300 uppercase tracking-wider">
                      Block / Room
                    </th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-black-300 uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedPlacements.map((p) => (
                    <tr
                      key={p.placement_id}
                      className="group transition-all duration-300 hover:bg-white/5 hover:scale-[1.01] cursor-pointer"
                    >
                      {/* Student */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${getVibrantColor(p.first_name)} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/10 group-hover:ring-white/30 transition-all`}
                          >
                            {getInitials(p.first_name, p.last_name)}
                          </div>
                          <div>
                            <p className="font-medium text-white group-hover:text-blue-400 transition">
                              {p.first_name} {p.last_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {p.student_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Student ID - hidden on mobile */}
                      <td className="py-3.5 px-4 text-gray-400 font-mono text-xs hidden md:table-cell">
                        {p.student_id}
                      </td>

                      {/* Department - hidden on tablet */}
                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${getDepartmentColor(p.department)}`}
                        >
                          {p.department}
                        </span>
                      </td>

                      {/* Block / Room */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium
                            ${p.block_gender === "Male" ? "text-blue-400" : "text-pink-400"}
                          `}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${p.block_gender === "Male" ? "bg-blue-400" : "bg-pink-400"}`}
                            ></span>
                            {p.block_name}
                          </span>
                          <span className="text-white font-semibold text-sm">
                            Room {p.dorm_number}
                          </span>
                        </div>
                      </td>

                      {/* Date - hidden on mobile */}
                      <td className="py-3.5 px-4 text-gray-400 text-xs hidden sm:table-cell">
                        {new Date(p.placement_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer with pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-3 border-t border-white/5 bg-white/5">
              <span className="text-sm text-gray-400">
                Showing{" "}
                <span className="text-white font-medium">
                  {Math.min(
                    filteredPlacements.length,
                    (currentPage - 1) * itemsPerPage + 1,
                  )}{" "}
                  -{" "}
                  {Math.min(
                    filteredPlacements.length,
                    currentPage * itemsPerPage,
                  )}
                </span>{" "}
                of{" "}
                <span className="text-white font-medium">
                  {filteredPlacements.length}
                </span>{" "}
                placements
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-400"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-400"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => !modalLoading && setModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset All Placements?"
        message={`This will permanently delete all placement records for academic year ${academicYears.find((y) => y.id === parseInt(selectedYear))?.label || selectedYear}. This action cannot be undone!`}
        confirmText="Yes, Reset All"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={modalLoading}
      />
    </div>
  );
};

export default Placements;