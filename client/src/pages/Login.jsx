import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/auth/login",
        formData
      );

      // Save JWT Token
      localStorage.setItem(
        "token",
        response.data.access_token
      );

      // Save Logged-in User
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("✅ Login Successful");

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.detail ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">

      <div className="bg-gray-800 p-8 rounded-xl w-96 shadow-xl">

        <h1 className="text-3xl text-white font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded mb-4 bg-gray-700 text-white"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded mb-6 bg-gray-700 text-white"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded text-white font-bold"
          >
            Login
          </button>

        </form>

        <p className="text-gray-300 text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;