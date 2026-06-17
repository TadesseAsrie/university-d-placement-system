import { useAuth } from "../../context/AuthContext";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome back, {user?.username || "User"}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 capitalize">{user?.role}</span>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
