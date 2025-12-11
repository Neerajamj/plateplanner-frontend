import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function HomePage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/recipes?search=${search}`);
  };

  const filterOptions = [
    { tag: "veg", label: "Veg 🥦" },
    { tag: "vegan", label: "Vegan 🌱" },
    { tag: "high-protein", label: "High Protein 💪" },
    { tag: "budget", label: "Budget-Friendly 💸" }
  ];

  return (
    <div className="mt-10">

      {/* HERO */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-semibold text-center"
      >
        Plan Your Perfect Week ✨
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-gray-600 text-center mt-3"
      >
        Healthy meals made simple — search, plan, cook, enjoy 💚
      </motion.p>

      {/* SEARCH BAR */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 flex justify-center"
      >
        <input
          type="text"
          placeholder="Search for recipes (paneer, rice, egg...)"
          className="w-full max-w-xl px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="ml-3 px-5 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
        >
          Search
        </button>
      </motion.form>

      {/* FILTER BUTTONS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
        {filterOptions.map((f) => (
          <button
            key={f.tag}
            onClick={() => navigate(`/recipes?filter=${f.tag}`)}
            className="px-5 py-2 bg-white border rounded-xl shadow-sm hover:bg-green-50 transition"
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* ILLUSTRATION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-14 flex justify-center"
      >
        <img
          src="https://img.freepik.com/free-vector/people-learning-how-cook-from-books-internet_52683-37178.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Cooking"
          className="w-full max-w-2xl rounded-2xl shadow"
        />
      </motion.div>

    </div>
  );
}

export default HomePage;
