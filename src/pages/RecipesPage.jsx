import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import RecipeSkeleton from "../components/RecipeSkeleton";

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search");
  const filter = queryParams.get("filter");

  const filterOptions = [
    { tag: "veg", label: "Veg 🥦" },
    { tag: "vegan", label: "Vegan 🌱" },
    { tag: "high-protein", label: "High Protein 💪" },
    { tag: "budget", label: "Budget 💸" }
  ];

  useEffect(() => {
    async function fetchRecipes() {
      try {
        let url = "import.meta.env.VITE_API_URL/recipes";

        if (search) url = `import.meta.env.VITE_API_URL/recipes/search/${search}`;
        if (filter) url = `import.meta.env.VITE_API_URL/recipes/filter/tag/${filter}`;

        const res = await axios.get(url);
        setRecipes(res.data);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching recipes:", err);
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [search, filter]);

  // ⭐ SKELETON LOADING UI
  if (loading)
    return (
      <div className="mt-10 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeSkeleton key={i} />
        ))}
      </div>
    );

  return (
    <div className="mt-10 px-6 mb-20">

      <h1 className="text-3xl font-semibold text-center mb-6">
        Explore Recipes 🍽️
      </h1>

      {/* ⭐ FILTER CHIPS */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap justify-center gap-3 mb-10"
      >
        {filterOptions.map((f) => (
          <button
            key={f.tag}
            onClick={() => navigate(`/recipes?filter=${f.tag}`)}
            className={`px-4 py-2 rounded-full border shadow-sm transition
              ${
                filter === f.tag
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 hover:bg-green-50"
              }
            `}
          >
            {f.label}
          </button>
        ))}

        {/* ⭐ Clear Filter */}
        {filter && (
          <button
            onClick={() => navigate("/recipes")}
            className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            Clear ✖️
          </button>
        )}
      </motion.div>

      {/* ⭐ RECIPE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r) => (
          <motion.div
            key={r._id}
            whileHover={{ scale: 1.04 }}
            className="cursor-pointer bg-white p-4 rounded-2xl shadow hover:shadow-lg"
            onClick={() => navigate(`/recipe/${r._id}`)}
          >
            <img
              src={r.image}
              alt={r.title}
              className="w-full h-48 object-cover rounded-xl"
            />

            <h2 className="text-xl font-semibold mt-3">{r.title}</h2>

            <p className="text-gray-500 text-sm mt-1">
              {r.cookTime} mins • {r.calories} cal
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {r.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="text-center mt-10 text-gray-600">
          No recipes found ✨ Try another search.
        </p>
      )}
    </div>
  );
}

export default RecipesPage;
