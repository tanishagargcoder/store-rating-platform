import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminStores() {
  const [stores, setStores] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();

      if (name) {
        params.append("name", name);
      }

      if (email) {
        params.append("email", email);
      }

      if (address) {
        params.append("address", address);
      }

      params.append("sortBy", sortBy);
      params.append("order", order);

      const response = await api.get(
        "/admin/stores?" + params.toString(),
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setStores(response.data.stores);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [name, email, address, sortBy, order]);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow px-8 py-4">
        <h1 className="text-2xl font-bold text-blue-600">
          Manage Stores
        </h1>
      </div>

      <main className="max-w-7xl mx-auto p-8">

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <input
            type="text"
            placeholder="Search by store name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-4 py-3 bg-white"
          />

          <input
            type="text"
            placeholder="Search by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-4 py-3 bg-white"
          />

          <input
            type="text"
            placeholder="Search by address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded-lg px-4 py-3 bg-white"
          />

        </div>

        {/* Sorting */}
        <div className="flex flex-wrap gap-4 mb-6">

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-4 py-3 bg-white"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="address">Sort by Address</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border rounded-lg px-4 py-3 bg-white"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

        </div>

        {/* Stores Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">
                  Store Name
                </th>

                <th className="text-left p-4">
                  Email
                </th>

                <th className="text-left p-4">
                  Address
                </th>

                <th className="text-left p-4">
                  Overall Rating
                </th>
              </tr>
            </thead>

            <tbody>

              {stores.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-8 text-gray-500"
                  >
                    No stores found
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr
                    key={store.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">
                      {store.name}
                    </td>

                    <td className="p-4">
                      {store.email}
                    </td>

                    <td className="p-4">
                      {store.address}
                    </td>

                    <td className="p-4">
                      ⭐{" "}
                      {store.overallRating
                        ? store.overallRating
                        : "No ratings"}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}