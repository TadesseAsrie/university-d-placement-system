import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const Dorms = () => {
  const [dorms, setDorms] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    block_id: "",
    dorm_number: "",
    capacity: 6,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dormsRes, blocksRes] = await Promise.all([
        api.get("/dorms"),
        api.get("/blocks"),
      ]);
      setDorms(dormsRes.data.data.dorms);
      setBlocks(blocksRes.data.data.blocks);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/dorms/${editing.id}`, formData);
        toast.success("Dorm updated successfully");
      } else {
        await api.post("/dorms", formData);
        toast.success("Dorm created successfully");
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ block_id: "", dorm_number: "", capacity: 6 });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save dorm");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this dorm?")) return;
    try {
      await api.delete(`/dorms/${id}`);
      toast.success("Dorm deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete dorm");
    }
  };

  const handleEdit = (dorm) => {
    setEditing(dorm);
    setFormData({
      block_id: dorm.block_id,
      dorm_number: dorm.dorm_number,
      capacity: dorm.capacity,
    });
    setShowModal(true);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dorms</h1>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ block_id: "", dorm_number: "", capacity: 6 });
            setShowModal(true);
          }}
          className="btn-primary"
        >
          + Add Dorm
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Block
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Room Number
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Capacity
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {dorms.map((dorm) => (
                <tr
                  key={dorm.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {dorm.block_name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {dorm.dorm_number}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {dorm.capacity}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => handleEdit(dorm)}
                      className="text-primary-600 hover:text-primary-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dorm.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editing ? "Edit Dorm" : "Add New Dorm"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Block *
                </label>
                <select
                  value={formData.block_id}
                  onChange={(e) =>
                    setFormData({ ...formData, block_id: e.target.value })
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select a block</option>
                  {blocks.map((block) => (
                    <option key={block.id} value={block.id}>
                      {block.block_name} ({block.gender})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number *
                </label>
                <input
                  type="text"
                  value={formData.dorm_number}
                  onChange={(e) =>
                    setFormData({ ...formData, dorm_number: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  className="input-field"
                  min="1"
                  max="20"
                />
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
    </div>
  );
};

export default Dorms;
