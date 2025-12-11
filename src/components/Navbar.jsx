import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // FIXED
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("plateplanner_token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("plateplanner_token");
    localStorage.removeItem("plateplanner_userId");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl font-semibold">🥗 PlatePlanner</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-lg">
          <Link to="/" className="hover:text-green-600 transition">Home</Link>
          <Link to="/recipes" className="hover:text-green-600 transition">Recipes</Link>
          <Link to="/mealplanner" className="hover:text-green-600 transition">Meal Planner</Link>
          <Link to="/grocery" className="hover:text-green-600 transition">Grocery</Link>

          {!loggedIn && (
            <>
              <Link to="/login" className="hover:text-green-600 transition">Login</Link>
              <Link to="/register" className="hover:text-green-600 transition">Register</Link>
            </>
          )}

          {loggedIn && (
            <>
              <Link to="/profile" className="hover:text-green-600 transition">Profile</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden block text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden bg-white shadow-md px-6 py-4 space-y-4 text-lg"
        >
          <Link onClick={() => setOpen(false)} to="/" className="block">Home</Link>
          <Link onClick={() => setOpen(false)} to="/recipes" className="block">Recipes</Link>
          <Link onClick={() => setOpen(false)} to="/mealplanner" className="block">Meal Planner</Link>
          <Link onClick={() => setOpen(false)} to="/grocery" className="block">Grocery</Link>

          {!loggedIn && (
            <>
              <Link onClick={() => setOpen(false)} to="/login" className="block">Login</Link>
              <Link onClick={() => setOpen(false)} to="/register" className="block">Register</Link>
            </>
          )}

          {loggedIn && (
            <>
              <Link onClick={() => setOpen(false)} to="/profile" className="block">Profile</Link>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="text-red-500 block"
              >
                Logout
              </button>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;
