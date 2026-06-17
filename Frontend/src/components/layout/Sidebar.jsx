
// export default Sidebar;
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
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, onClose }) => {
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

  // Mobile overlay: close when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Desktop Sidebar - always visible on large screens */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-200/90 backdrop-blur-xl border-r border-white/5 flex-shrink-0 h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <h1 className="text-xl font-bold text-blue-400">Dormitory</h1>
          <span className="ml-1 text-xl font-bold text-white">MS</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10"
                    : "text-gray-400 hover:bg-blue-500/10 hover:text-blue-400"
                }`
              }
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="text-xs text-gray-500">
            <p className="font-medium text-gray-400">v2.0</p>
            <p className="mt-0.5">University System</p>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - Overlay + Slide-in */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={handleOverlayClick}
        >
          {/* Overlay with blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Slide-in panel */}
          <div className="relative w-72 max-w-[80%] h-full bg-dark-200 border-r border-white/10 shadow-2xl animate-slide-in-left">
            {/* Header with close button */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-400">Dormitory</h1>
                <span className="ml-1 text-xl font-bold text-white">MS</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose} // close sidebar on navigation
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;