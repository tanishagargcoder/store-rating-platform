import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setStats(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main */}
      <main className="max-w-6xl mx-auto p-8">

        <h2 className="text-3xl font-bold mb-8">
          Overview
        </h2>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {/* Users */}
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">
                Total Users
              </p>

              <h3 className="text-4xl font-bold mt-3 text-blue-600">
                {stats.totalUsers}
              </h3>
            </div>

            {/* Stores */}
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">
                Total Stores
              </p>

              <h3 className="text-4xl font-bold mt-3 text-green-600">
                {stats.totalStores}
              </h3>
            </div>

            {/* Ratings */}
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">
                Total Ratings
              </p>

              <h3 className="text-4xl font-bold mt-3 text-yellow-500">
                {stats.totalRatings}
              </h3>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;