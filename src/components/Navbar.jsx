import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function checkLogin() {
      const token = localStorage.getItem("token");
      setLoggedIn(!!token);
    }

    checkLogin();

    window.addEventListener("storage", checkLogin);
    window.addEventListener("authChanged", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("authChanged", checkLogin);
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
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl font-semibold">🥗 PlatePlanner</span>
        </motion.div>

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
              <button onClick={handleLogout} className="text-red-500">
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
    </nav>
  );
}

export default Navbar;
