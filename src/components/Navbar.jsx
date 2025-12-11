import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  /* ---------------------------
     CHECK LOGIN STATUS
  --------------------------- */
  const checkLogin = () => {
    const token = localStorage.getItem("plateplanner_token");
    setLoggedIn(!!token);
  };

  useEffect(() => {
    checkLogin();

    // Update navbar on login/logout
    window.addEventListener("authChanged", checkLogin);
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("authChanged", checkLogin);
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  /* ---------------------------
     LOGOUT FUNCTION
  --------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("plateplanner_token");
    localStorage.removeItem("plateplanner_userId");

    window.dispatchEvent(new Event("authChanged"));

    setLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl font-semibold">🥗 PlatePlanner</span>
        </motion.div>

        {/* DESKTOP MENU */}
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
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden block text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* MOBILE MENU PANEL */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        className="md:hidden bg-white shadow-lg overflow-hidden rounded-b-xl"
      >
        <div className="px-6 py-4 text-lg flex flex-col gap-3">

          <Link to="/" onClick={() => setOpen(false)} className="block py-2 border-b border-gray-200">
            Home
          </Link>

          <Link to="/recipes" onClick={() => setOpen(false)} className="block py-2 border-b border-gray-200">
            Recipes
          </Link>

          <Link to="/mealplanner" onClick={() => setOpen(false)} className="block py-2 border-b border-gray-200">
            Meal Planner
          </Link>

          <Link to="/grocery" onClick={() => setOpen(false)} className="block py-2 border-b border-gray-200">
            Grocery
          </Link>

          {/* Divider */}
          <div className="border-t border-gray-300 my-2"></div>

          {!loggedIn ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block py-2 border-b border-gray-200">
                Login
              </Link>

              <Link to="/register" onClick={() => setOpen(false)} className="block py-2">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="block py-2 border-b border-gray-200">
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block py-2 text-red-500 text-left"
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
