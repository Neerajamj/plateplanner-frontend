import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const url = `${import.meta.env.VITE_API_URL}/auth/login`;
      const res = await axios.post(url, { username, password });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        // ✅ Use SAME KEY everywhere
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);

        // 🔥 Notify Navbar
        window.dispatchEvent(new Event("authChanged"));

        navigate("/mealplanner");
      }

    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 flex justify-center px-4 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow p-8"
      >
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome back 👋
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Log in to see your meal plan & grocery list
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              className="w-full border rounded-xl px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-xl px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-green-600 text-white"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
