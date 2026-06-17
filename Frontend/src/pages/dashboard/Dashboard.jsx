import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  UserGroupIcon,
  HomeModernIcon,
  ClipboardIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get("/reports/summary");
      setSummary(response.data.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Active Students",
      value: summary?.summary?.total_active_students || 0,
      icon: UserGroupIcon,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Students Placed",
      value: summary?.summary?.total_placed || 0,
      icon: ClipboardIcon,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Occupancy Rate",
      value: summary?.summary?.occupancy_rate || "0%",
      icon: ChartBarIcon,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Dorms Used",
      value: summary?.summary?.used_dorms || 0,
      icon: HomeModernIcon,
      color: "text-orange-600 bg-orange-100",
    },
  ];

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
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">By Department</h3>
          <div className="space-y-3">
            {summary?.breakdown?.by_department?.map((dept) => (
              <div
                key={dept.department}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">{dept.department}</span>
                <span className="text-sm font-medium text-gray-800">
                  {dept.placed_count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">By Block</h3>
          <div className="space-y-3">
            {summary?.breakdown?.by_block?.map((block) => (
              <div
                key={block.block_name}
                className="flex items-center justify-between"
              >
                <div>
                  <span className="text-sm text-gray-600">
                    {block.block_name}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    ({block.gender})
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {block.occupancy}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
