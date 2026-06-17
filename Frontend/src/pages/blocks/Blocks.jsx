import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    block_name: "",
    gender: "Male",
    description: "",
  });

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const response = await api.get("/blocks");
      setBlocks(response.data.data.blocks);
    } catch (error) {
      toast.error("Failed to fetch blocks");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/blocks/${editing.id}`, formData);
        toast.success("Block updated successfully");
      } else {
        await api.post("/blocks", formData);
        toast.success("Block created successfully");
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ block_name: "", gender: "Male", description: "" });
      fetchBlocks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save block");
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm("Delete this block? This will also delete all associated dorms.")
    )
      return;
    try {
      await api.delete(`/blocks/${id}`);
      toast.success("Block deleted successfully");
      fetchBlocks();
    } catch (error) {
      toast.error("Failed to delete block");
    }
  };

  const handleEdit = (block) => {
    setEditing(block);
    setFormData({
      block_name: block.block_name,
      gender: block.gender,
      description: block.description || "",
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
        <h1 className="text-2xl font-bold text-gray-800">Blocks</h1>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ block_name: "", gender: "Male", description: "" });
            setShowModal(true);
          }}
          className="btn-primary"
        >
          + Add Block
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocks.map((block) => (
          <div key={block.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {block.block_name}
                </h3>
                <span
                  className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                    block.gender === "Male"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-pink-100 text-pink-700"
                  }`}
                >
                  {block.gender}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(block)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(block.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            {block.description && (
              <p className="mt-2 text-sm text-gray-600">{block.description}</p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Rooms: {block.total_rooms || 0} • Capacity:{" "}
                {block.total_capacity || 0}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editing ? "Edit Block" : "Add New Block"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Block Name *
                </label>
                <input
                  type="text"
                  value={formData.block_name}
                  onChange={(e) =>
                    setFormData({ ...formData, block_name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="input-field"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-field"
                  rows="3"
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

export default Blocks;
