

// export default Navbar;
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Bars3Icon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get initials from first and last name
  const getInitials = () => {
    if (!user) return "U";

    // Try to get from user object (if we have first_name and last_name from student profile)
    // Otherwise fallback to username
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }

    // Fallback: use first two letters of username
    return user.username?.substring(0, 2).toUpperCase() || "U";
  };

  // Get full name for display
  const getDisplayName = () => {
    if (!user) return "User";
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username || "User";
  };

  return (
    <header className="h-16 bg-dark-200/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-6 flex items-center justify-between">
      {/* Left section: Hamburger + Welcome */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-blue-500/100 transition-colors text-gray-400 hover:text-white "
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <h2 className="text-lg font-semibold text-white hidden sm:block">
          Welcome back,{" "}
          <span className="text-blue-400">{getDisplayName()}</span>
        </h2>
        <h2 className="text-lg font-semibold text-white sm:hidden">
          👋 {getDisplayName()}
        </h2>
      </div>

      {/* Right section: Avatar with Dropdown */}
      <div className="relative " ref={dropdownRef} >
        {/* Avatar Button */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 group "
        >
          <div className="flex items-center gap-2" >
            <span className="hidden md:inline-block text-sm text-gray-400 capitalize">
              {user?.role}
            </span>
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
              flex items-center justify-center text-white font-bold text-sm shadow-lg 
              shadow-blue-500/30 hover:scale-105 transition-all duration-300
              ring-2 ring-white/10 group-hover:ring-white/30"
            >
              {getInitials()}
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-56 bg-dark-200/95 backdrop-blur-xl 
            border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-1 z-50
            animate-fade-in-down"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-sm font-medium text-white">
                {getDisplayName()}
              </p>
             
            </div>

            {/* Menu Items */}
        <div className="border-t border-white/5 py-1 bg-red-50/10">
            <div className="py-1">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  // Navigate to profile (if you have a profile page)
                  // navigate('/profile');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black-300 
                  hover:bg-blue-500/100 hover:text-white transition-colors"
              >
                <UserIcon className="w-5 h-5 text-gray-500" />
                Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  // Navigate to settings (if you have settings)
                  // navigate('/settings');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black-300 
                  hover:bg-blue-500/100 hover:text-white transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
                Settings
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-white/5 py-1">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 
                  hover:bg-red-500/30 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500" />
                Logout
              </button>
            </div>
            </div>

        </div>
        )}
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Navbar;