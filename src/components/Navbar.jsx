import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 🔥 Check login status
  const checkLogin = () => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  };

  useEffect(() => {
    checkLogin();

    // Update navbar when login/logout happens
    window.addEventListener("authChanged", checkLogin);
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("authChanged", checkLogin);
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    window.dispatchEvent(new Event("authChanged"));

    setLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl font-semibold">🥗 PlatePlanner</span>
        </motion.div>

        {/* ------------ DESKTOP MENU ------------ */}
        <div className="hidden md:flex gap-8 text-lg">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <Link to="/recipes" className="hover:text-green-600">Recipes</Link>
          <Link to="/mealplanner" className="hover:text-green-600">Meal Planner</Link>
          <Link to="/grocery" className="hover:text-green-600">Grocery</Link>

          {!loggedIn ? (
            <>
              <Link to="/login" className="hover:text-green-600">Login</Link>
              <Link to="/register" className="hover:text-green-600">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:text-green-600">Profile</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* ------------ MOBILE BUTTON ------------ */}
        <button
          className="md:hidden block text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* ------------ MOBILE MENU ------------ */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        className="md:hidden bg-white shadow-md overflow-hidden"
      >
        <div className="px-6 py-4 space-y-4 text-lg">

          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/recipes" onClick={() => setOpen(false)}>Recipes</Link>
          <Link to="/mealplanner" onClick={() => setOpen(false)}>Meal Planner</Link>
          <Link to="/grocery" onClick={() => setOpen(false)}>Grocery</Link>

          {!loggedIn ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
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
        </div>
      </motion.div>
    </nav>
  );
}
export default Navbar;
