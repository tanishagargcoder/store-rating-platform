import { useState } from "react";
import api from "../services/api";

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
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
        "/auth/change-password",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
        "Password changed successfully!"
      );

      setForm({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        "Failed to change password"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-8">
        Change Password
      </h1>

      <div className="bg-white rounded-xl shadow p-8 max-w-xl">

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

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block font-medium mb-2">
              Current Password
            </label>

            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="8-16 characters"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <p className="text-sm text-gray-500">
            Password must be 8-16 characters and contain
            at least one uppercase letter and one special
            character.
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Change Password
          </button>

        </form>
      </div>
    </div>
  );
}

export default ChangePassword;