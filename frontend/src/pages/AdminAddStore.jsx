import { useEffect, useState } from "react";
import api from "../services/api";

function AdminAddStore() {
  const [owners, setOwners] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/admin/users?role=STORE_OWNER",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOwners(response.data.users || response.data);
      } catch (err) {
        setError("Failed to load store owners");
      }
    };

    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/admin/stores",
        {
          ...form,
          ownerId: Number(form.ownerId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message || "Store created successfully!"
      );

      setForm({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        "Failed to create store"
      );
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Add Store
      </h1>

      <div className="bg-white rounded-xl shadow p-8 max-w-2xl">

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-5">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Store Name */}
          <div>
            <label className="block font-medium mb-2">
              Store Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter store name"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-2">
              Store Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter store email"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium mb-2">
              Store Address
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter store address"
              className="w-full border rounded-lg px-4 py-3"
              rows="3"
              required
            />
          </div>

          {/* Owner */}
          <div>
            <label className="block font-medium mb-2">
              Store Owner
            </label>

            <select
              name="ownerId"
              value={form.ownerId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            >
              <option value="">
                Select Store Owner
              </option>

              {owners.map((owner) => (
                <option
                  key={owner.id}
                  value={owner.id}
                >
                  {owner.name} — {owner.email}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Create Store
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminAddStore;