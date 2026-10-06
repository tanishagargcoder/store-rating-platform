import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function StoreOwnerDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/store-owner/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "OWNER DASHBOARD RESPONSE:",
          response.data
        );

        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load dashboard"
        );
      }
    };

    fetchDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  if (error) {
    return (
      <div className="p-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  const store = data.store;

  // Ratings can come from data.ratings or store.ratings
  const ratings = data.ratings || store?.ratings || [];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Store Rating
        </h1>

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/change-password")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            🔐 Change Password
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Main */}
      <main className="p-8">

        <h1 className="text-3xl font-bold mb-8">
          Store Owner Dashboard
        </h1>

        {/* Store Info */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h2 className="text-xl font-bold mb-4">
            {store?.name}
          </h2>

          <p className="text-gray-600">
            {store?.email}
          </p>

          <p className="text-gray-600">
            {store?.address}
          </p>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow p-6">

            <p className="text-gray-500">
              Average Rating
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              ⭐ {store?.averageRating ?? 0}
            </p>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <p className="text-gray-500">
              Total Ratings
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {store?.totalRatings ?? ratings.length}
            </p>

          </div>

        </div>

        {/* Users */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Users Who Rated Your Store
          </h2>

          {ratings.length === 0 ? (
            <p className="text-gray-500">
              No ratings yet.
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>

                <tbody>

                  {ratings.map((rating) => (
                    <tr
                      key={rating.id}
                      className="border-b"
                    >

                      <td className="p-3">
                        {rating.user?.name}
                      </td>

                      <td className="p-3">
                        {rating.user?.email}
                      </td>

                      <td className="p-3">
                        ⭐ {rating.rating}
                      </td>

                      <td className="p-3">
                        {new Date(
                          rating.createdAt
                        ).toLocaleDateString()}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default StoreOwnerDashboard;