import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(`/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-xl">
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-red-500">User not found.</p>

        <button
          onClick={() => navigate("/admin/users")}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-white shadow px-8 py-4">
        <h1 className="text-2xl font-bold text-blue-600">
          User Details
        </h1>
      </nav>

      <main className="max-w-4xl mx-auto p-8">

        <button
          onClick={() => navigate("/admin/users")}
          className="mb-6 bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700"
        >
          ← Back to Users
        </button>

        <div className="bg-white rounded-xl shadow p-8">

          <h2 className="text-2xl font-bold mb-6">
            {user.name}
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-semibold">{user.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-semibold">{user.address}</p>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {user.role}
              </span>
            </div>

          </div>

          {/* Store Owner Details */}
          {user.role === "STORE_OWNER" && user.store && (
            <div className="mt-8 border-t pt-6">

              <h3 className="text-xl font-bold mb-4">
                Store Information
              </h3>

              <div className="space-y-4">

                <div>
                  <p className="text-gray-500">Store Name</p>
                  <p className="font-semibold">
                    {user.store.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Store Email</p>
                  <p className="font-semibold">
                    {user.store.email}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Store Address</p>
                  <p className="font-semibold">
                    {user.store.address}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Overall Rating</p>
                  <p className="text-xl font-bold text-yellow-500">
                    ⭐ {user.store.overallRating ?? "No ratings yet"}
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default AdminUserDetails;