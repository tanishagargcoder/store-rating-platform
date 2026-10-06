import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import AdminAddUser from "./pages/AdminAddUser";
import AdminAddStore from "./pages/AdminAddStore";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import ChangePassword from "./pages/ChangePassword";
import AdminUserDetails from "./pages/AdminUserDetails";

import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute
              allowedRoles={["USER", "ADMIN", "STORE_OWNER"]}
            >
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<AdminDashboard />} />

          <Route
            path="users"
            element={<AdminUsers />}
          />

          <Route
            path="users/:id"
            element={<AdminUserDetails />}
          />

          <Route
            path="add-user"
            element={<AdminAddUser />}
          />

          <Route
            path="stores"
            element={<AdminStores />}
          />

          <Route
            path="add-store"
            element={<AdminAddStore />}
          />

        </Route>

        <Route
          path="/store-owner"
          element={
            <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;