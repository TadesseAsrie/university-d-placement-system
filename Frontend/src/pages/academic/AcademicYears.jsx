import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const AcademicYears = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    is_active: true,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    setLoading(true);
    try {
      const response = await api.get("/academic-years");
      setYears(response.data.data.academic_years || []);
    } catch (error) {
      toast.error("Failed to fetch academic years");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // For edit, we only update label and is_active
        await api.put(`/academic-years/${editing.id}`, {
          label: formData.label,
          is_active: formData.is_active,
        });
        toast.success("Academic year updated successfully");
      } else {
        await api.post("/academic-years", formData);
        toast.success("Academic year created successfully");
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ label: "", is_active: true });
      fetchYears();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save academic year",
      );
    }
  };

  const handleActivate = async (id) => {
    try {
      await api.put(`/academic-years/${id}/activate`);
      toast.success("Academic year activated");
      fetchYears();
    } catch (error) {
      toast.error("Failed to activate academic year");
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/academic-years/${deletingId}`);
      toast.success("Academic year deleted successfully");
      setDeleteModal(false);
      fetchYears();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete academic year",
      );
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  const openEditModal = (year) => {
    setEditing(year);
    setFormData({
      label: year.label,
      is_active: year.is_active === 1,
    });
    setShowModal(true);
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            📅 Academic Years
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage academic years for dormitory placements
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ label: "", is_active: true });
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <PlusIcon className="w-5 h-5 inline mr-2" />
          Add Academic Year
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Total Years
          </p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{years.length}</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Active
          </p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {years.filter((y) => y.is_active === 1).length}
          </p>
        </div>
        <div className="glass-card p-4 border-l-4 border-yellow-500">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Inactive
          </p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {years.filter((y) => y.is_active === 0).length}
          </p>
        </div>
      </div>

      {/* Years List */}
      <div className="glass-card p-0 overflow-hidden">
        {years.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-400 text-lg">No academic years found</p>
            <p className="text-gray-500 text-sm mt-1">
              Create your first academic year to get started
            </p>
            <button
              onClick={() => {
                setEditing(null);
                setFormData({ label: "", is_active: true });
                setShowModal(true);
              }}
              className="btn-primary inline-block mt-6"
            >
              <PlusIcon className="w-5 h-5 inline mr-2" />
              Add Academic Year
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/5">
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-black uppercase tracking-wider">
                    Label
                  </th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3.5 px-4 text-xs font-semibold text-black uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {years.map((year) => (
                  <tr
                    key={year.id}
                    className="group transition-all duration-300 hover:bg-white/5 hover:scale-[1.01] cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-white">
                          {year.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {year.is_active === 1 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          <XCircleIcon className="w-3.5 h-3.5" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 text-xs">
                      {new Date(year.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {year.is_active === 0 && (
                          <button
                            onClick={() => handleActivate(year.id)}
                            className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition"
                            title="Activate"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(year)}
                          className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        {year.is_active === 0 && (
                          <button
                            onClick={() => openDeleteModal(year.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md glass-card p-6 animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-4">
              {editing ? "Edit Academic Year" : "Add Academic Year"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  className="input-field"
                  placeholder="e.g., 2026/2027"
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  Set as active (deactivates all others)
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => !deleteLoading && setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Academic Year?"
        message="This action cannot be undone. Make sure there are no placements associated with this year."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleteLoading}
      />

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AcademicYears;
