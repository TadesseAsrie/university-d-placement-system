

// export default AddStudent;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  UserIcon,
  KeyIcon,
  IdentificationIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ArrowLeftIcon,
  CheckCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Form, 2 = Review
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    student_id: "",
    first_name: "",
    last_name: "",
    gender: "Male",
    department: "",
    year_level: 1,
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/students/register", formData);
      toast.success("Student registered successfully!");
      navigate("/students");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to register student";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Go back to form to edit
  const handleBackToEdit = () => {
    setStep(1);
  };

  // Proceed to review
  const handleProceedToReview = (e) => {
    e.preventDefault();
    // Basic validation before review
    if (
      !formData.username ||
      !formData.password ||
      !formData.student_id ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.department
    ) {
      toast.error("Please fill in all required fields before reviewing.");
      return;
    }
    setStep(2);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with Step Indicator */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black-800">
          {step === 1 ? "Add New Student" : "Review Student Details"}
        </h1>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm ${step === 1 ? "text-blue-400" : "text-gray-500"}`}
          >
            Step 1: Fill Details
          </span>
          <span className="text-gray-600">→</span>
          <span
            className={`text-sm ${step === 2 ? "text-blue-400" : "text-gray-500"}`}
          >
            Step 2: Confirm
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/5 rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 rounded-full`}
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>

      {/* Step 1: Form */}
      {step === 1 && (
        <form
          onSubmit={handleProceedToReview}
          className="glass-card p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <UserIcon className="w-4 h-4 inline mr-1.5" />
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <KeyIcon className="w-4 h-4 inline mr-1.5" />
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <IdentificationIcon className="w-4 h-4 inline mr-1.5" />
                Student ID *
              </label>
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., STU-2024-001"
                required
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter first name"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter last name"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <UserGroupIcon className="w-4 h-4 inline mr-1.5" />
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <BuildingOffice2Icon className="w-4 h-4 inline mr-1.5" />
                Department *
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Computer Science"
                required
              />
            </div>

            {/* Year Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <AcademicCapIcon className="w-4 h-4 inline mr-1.5" />
                Year Level *
              </label>
              <input
                type="number"
                name="year_level"
                value={formData.year_level}
                onChange={handleChange}
                min="1"
                max="6"
                className="input-field"
                placeholder="1-6"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <PhoneIcon className="w-4 h-4 inline mr-1.5" />
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter phone number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <EnvelopeIcon className="w-4 h-4 inline mr-1.5" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              <CheckCircleIcon className="w-5 h-5 inline mr-2" />
              Review & Confirm
            </button>
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Review & Confirm */}
      {step === 2 && (
        <div className="glass-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Review Student Details
              </h3>
              <p className="text-sm text-gray-400">
                Please verify all information before submitting
              </p>
            </div>
          </div>

          {/* Student Summary Card */}
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                flex items-center justify-center text-white font-bold text-xl"
              >
                {formData.first_name?.[0]}
                {formData.last_name?.[0]}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {formData.first_name} {formData.last_name}
                </h4>
                <p className="text-sm text-gray-400">{formData.student_id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Username</p>
                <p className="text-sm text-white font-medium">
                  {formData.username}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gender</p>
                <p className="text-sm text-white font-medium">
                  {formData.gender}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm text-white font-medium">
                  {formData.department}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Year Level</p>
                <p className="text-sm text-white font-medium">
                  {formData.year_level}
                </p>
              </div>
              {formData.phone && (
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-white font-medium">
                    {formData.phone}
                  </p>
                </div>
              )}
              {formData.email && (
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-white font-medium">
                    {formData.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-400 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Please ensure all details are correct before submitting. This
              action cannot be undone.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBackToEdit}
              className="btn-secondary flex-1"
            >
              <PencilSquareIcon className="w-5 h-5 inline mr-2" />
               Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5 inline mr-2"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5 inline mr-2" />
                  Confirm & Register
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Animation for slide-up */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddStudent;