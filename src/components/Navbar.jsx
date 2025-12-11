import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 🔥 Check login on load + whenever storage changes
  useEffect(() => {
    function checkLogin() {
      const token = localStorage.getItem("token");
      setLoggedIn(!!token);
    }

    checkLogin();

    // Listen to login/logout changes
    window.addEventListener("storage", checkLogin);

    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
        
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
          <Link to="/">Home</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/mealplanner">Meal Planner</Link>
          <Link to="/grocery">Grocery</Link>

          {!loggedIn ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>
              <button 
                onClick={handleLogout}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>

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
          <Link onClick={() => setOpen(false)} to="/">Home</Link>
          <Link onClick={() => setOpen(false)} to="/recipes">Recipes</Link>
          <Link onClick={() => setOpen(false)} to="/mealplanner">Meal Planner</Link>
          <Link onClick={() => setOpen(false)} to="/grocery">Grocery</Link>

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
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;
