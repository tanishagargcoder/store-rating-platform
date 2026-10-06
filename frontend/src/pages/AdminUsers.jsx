import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();

      if (name) params.append("name", name);
      if (email) params.append("email", email);
      if (address) params.append("address", address);
      if (role) params.append("role", role);

      params.append("sortBy", sortBy);
      params.append("order", order);

      const response = await api.get(
        "/admin/users?" + params.toString(),
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [name, email, address, role, sortBy, order]);

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-white shadow px-8 py-4">
        <h1 className="text-2xl font-bold text-blue-600">
          Manage Users
        </h1>
      </nav>

      <main className="max-w-7xl mx-auto p-8">

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

          <input
            type="text"
            placeholder="Search by name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-4 py-3 bg-white"
          />

          <input
            type="text"
            placeholder="Search by email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-4 py-3 bg-white"
          />

          <input
            type="text"
            placeholder="Search by address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded-lg px-4 py-3 bg-white"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded-lg px-4 py-3 bg-white"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>

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
            <option value="role">Sort by Role</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border rounded-lg px-4 py-3 bg-white"
          >
            <option value="asc">Ascending ↑</option>
            <option value="desc">Descending ↓</option>
          </select>

        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Address</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>

            <tbody>

              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-8 text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">
                      {user.name}
                    </td>

                    <td className="p-4">
                      {user.email}
                    </td>

                    <td className="p-4">
                      {user.address}
                    </td>

                    <td className="p-4">
                      {user.role}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          navigate("/admin/users/" + user.id)
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        View Details
                      </button>
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

export default AdminUsers;