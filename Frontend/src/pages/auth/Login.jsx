
// export default Login;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  UserIcon,
  LockClosedIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Gradient Overlay - Dark with subtle blue tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-blue-900/80"></div>

        {/* Decorative Gradient Orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating Icons */}
        <div className="absolute top-20 left-20 text-white/5 hidden lg:block">
          <AcademicCapIcon className="w-32 h-32" />
        </div>
        <div className="absolute bottom-20 right-20 text-white/5 hidden lg:block">
          <BuildingOffice2Icon className="w-40 h-40" />
        </div>
      </div>

      {/* Login Card - Centered with perfect spacing */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl 
            bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30 
            mb-4 relative"
          >
            <BuildingOffice2Icon className="w-10 h-10 text-white" />
            <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl blur-xl -z-10"></div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Dormitory<span className="text-blue-400">MS</span>
          </h1>
          <p className="text-blue-200/60 mt-2 font-light tracking-wide text-sm">
            University Dormitory Placement System
          </p>
        </div>

        {/* Glass Card - Perfectly blended */}
        <div
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl 
          shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 animate-slide-up"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition 
                    font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 
                  focus:ring-blue-500 focus:ring-offset-0 focus:ring-2"
              />
              <label className="ml-2 text-sm text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button - Gradient with hover effect */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 
                hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl
                shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 
                transition-all duration-300 transform hover:scale-[1.02]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </span>
              <span
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} DormitoryMS. All rights
              reserved.
            </p>
            <div className="mt-2 flex items-center justify-center gap-3 text-[10px] text-gray-600">
              <span>🔒 Secure Login</span>
              <span>•</span>
              <span>🏛️ University System</span>
              <span>•</span>
              <span>v2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Login;