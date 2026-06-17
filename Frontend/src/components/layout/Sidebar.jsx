import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  HomeModernIcon,
  ClipboardIcon,
  ChartBarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const { isAdmin, isStudent } = useAuth();

  const adminLinks = [
    { to: "/dashboard", icon: HomeIcon, label: "Dashboard" },
    { to: "/students", icon: UserGroupIcon, label: "Students" },
    { to: "/blocks", icon: BuildingOfficeIcon, label: "Blocks" },
    { to: "/dorms", icon: HomeModernIcon, label: "Dorms" },
    { to: "/placements", icon: ClipboardIcon, label: "Placements" },
    { to: "/reports", icon: ChartBarIcon, label: "Reports" },
  ];

  const studentLinks = [
    { to: "/student/dashboard", icon: HomeIcon, label: "Dashboard" },
    { to: "/student/placement", icon: ClipboardIcon, label: "My Placement" },
  ];

  const links = isAdmin ? adminLinks : isStudent ? studentLinks : [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">Dormitory</h1>
        <span className="ml-1 text-xl font-bold text-gray-800">MS</span>
      </div>
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <link.icon className="w-5 h-5 mr-3" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
