import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">

        <h1 className="text-2xl font-bold text-blue-600 mb-8">
          Store Rating
        </h1>

        <nav className="space-y-2">
  <NavLink to="/admin" end className={linkClass}>
    📊 Dashboard
  </NavLink>

  <NavLink to="/admin/users" className={linkClass}>
    👥 Users
  </NavLink>

  <NavLink to="/admin/add-user" className={linkClass}>
    ➕ Add User
  </NavLink>

  <NavLink to="/admin/stores" className={linkClass}>
    🏪 Stores
  </NavLink>
  <NavLink to="/admin/add-store" className={linkClass}>
  ➕ Add Store
</NavLink>
<NavLink to="/change-password" className={linkClass}>
  🔐 Change Password
</NavLink>
</nav>
          

        <button
          onClick={logout}
          className="mt-8 w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
        >
          🚪 Logout
        </button>

      </aside>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;