import { useState } from "react";
import api from "../services/api";

function AdminAddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        "/admin/users",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || "User created successfully!");

      setForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        "Failed to create user"
      );
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Add User
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

          {/* Name */}
          <div>
            <label className="block font-medium mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="8-16 characters"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium mb-2">
              Address
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full border rounded-lg px-4 py-3"
              rows="3"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block font-medium mb-2">
              Role
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="USER">
                Normal User
              </option>

              <option value="ADMIN">
                Administrator
              </option>

              <option value="STORE_OWNER">
                Store Owner
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Create User
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminAddUser;