import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("https://plateplanner-backend-1.onrender.com/auth/register", {
        username,
        password
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setSuccess("Account created! You can log in now.");
        setTimeout(() => navigate("/login"), 1200);
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
          Create your PlatePlanner 🌿
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Save your meal plans & grocery lists
        </p>

        {error && (
          <p className="mb-4 text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="mb-4 text-green-600 text-sm text-center">
            {success}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
