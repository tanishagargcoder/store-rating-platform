import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UserDashboard() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get(
        `/user/stores?name=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStores(response.data.stores);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  const openRating = (store) => {
    setSelectedStore(store);
    setSelectedRating(store.userSubmittedRating || 0);
  };

  const closeRating = () => {
    setSelectedStore(null);
    setSelectedRating(0);
  };

  const submitRating = async () => {
    if (selectedRating < 1 || selectedRating > 5) {
      alert("Please select a rating from 1 to 5");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      await api.post(
        "/user/ratings",
        {
          storeId: selectedStore.id,
          rating: selectedRating
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Rating submitted successfully ⭐");

      closeRating();
      fetchStores();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to submit rating"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

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
      <main className="max-w-6xl mx-auto p-8">

        <h2 className="text-3xl font-bold mb-6">
          Stores
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border rounded-lg px-4 py-3 mb-8"
        />

        {/* Loading */}
        {loading && (
          <p>Loading stores...</p>
        )}

        {/* Empty */}
        {!loading && stores.length === 0 && (
          <p className="text-gray-500">
            No stores found.
          </p>
        )}

        {/* Store Cards */}
        {!loading && stores.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">

            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl shadow p-6"
              >

                <h3 className="text-xl font-bold">
                  {store.name}
                </h3>

                <p className="text-gray-500 mt-2">
                  {store.address}
                </p>

                <div className="mt-4 space-y-2">

                  <p>
                    ⭐ Overall Rating:{" "}
                    <strong>
                      {store.overallRating || "No ratings yet"}
                    </strong>
                  </p>

                  <p>
                    Your Rating:{" "}
                    <strong>
                      {store.userSubmittedRating
                        ? `⭐ ${store.userSubmittedRating}`
                        : "Not rated"}
                    </strong>
                  </p>

                </div>

                <button
                  onClick={() => openRating(store)}
                  className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  {store.userSubmittedRating
                    ? "Modify Rating"
                    : "Rate Store"}
                </button>

              </div>
            ))}

          </div>
        )}

      </main>

      {/* Rating Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">

          <div className="bg-white rounded-2xl p-8 w-full max-w-md">

            <h2 className="text-2xl font-bold text-center">
              {selectedStore.userSubmittedRating
                ? "Modify Your Rating"
                : "Rate This Store"}
            </h2>

            <p className="text-center text-gray-500 mt-2">
              {selectedStore.name}
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mt-8">

              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  {star <= selectedRating ? "⭐" : "☆"}
                </button>
              ))}

            </div>

            <p className="text-center mt-4 text-gray-600">
              {selectedRating === 0
                ? "Select a rating"
                : `${selectedRating} out of 5`}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">

              <button
                onClick={closeRating}
                className="flex-1 border border-gray-300 py-3 rounded-lg"
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                onClick={submitRating}
                disabled={submitting || selectedRating === 0}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Rating"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default UserDashboard;