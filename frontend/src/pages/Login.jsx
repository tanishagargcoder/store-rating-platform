import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "STORE_OWNER") {
        navigate("/store-owner");
      } else {
        navigate("/user");
      }

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        address: form.address
      });

      setSuccess(
        "Account created successfully! Please login."
      );

      setIsSignup(false);

      setForm({
        name: "",
        email: "",
        password: "",
        address: ""
      });

      setConfirmPassword("");

    } catch (error) {
      const errors = error.response?.data?.errors;

      setError(
        errors?.join(", ") ||
        error.response?.data?.message ||
        "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setSuccess("");

    setForm({
      name: "",
      email: "",
      password: "",
      address: ""
    });

    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Store Rating Platform
        </h1>

        <p className="text-center text-gray-500 mt-2">
          {isSignup
            ? "Create your account"
            : "Login to your account"}
        </p>

        {error && (
          <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 bg-green-100 text-green-600 p-3 rounded-lg">
            {success}
          </div>
        )}

        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="mt-6 space-y-4"
        >

          {/* Name - Signup only */}
          {isSignup && (
            <div>
              <label className="block mb-1 font-medium">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <p className="text-xs text-gray-500 mt-1">
                Name must be 20-60 characters
              </p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Address - Signup only */}
          {isSignup && (
            <div>
              <label className="block mb-1 font-medium">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="3"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {isSignup && (
              <p className="text-xs text-gray-500 mt-1">
                8-16 characters, 1 uppercase letter and 1 special character
              </p>
            )}
          </div>

          {/* Confirm Password - Signup only */}
          {isSignup && (
            <div>
              <label className="block mb-1 font-medium">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? isSignup
                ? "Creating Account..."
                : "Logging in..."
              : isSignup
                ? "Create Account"
                : "Login"}
          </button>

        </form>

        {/* Switch Login / Signup */}
        <div className="text-center mt-6">

          <p className="text-gray-500">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>

          <button
            onClick={switchMode}
            className="text-blue-600 font-semibold hover:underline mt-1"
          >
            {isSignup
              ? "Login"
              : "Create an account"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Login;