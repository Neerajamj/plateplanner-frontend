import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import RecipeSkeleton from "../components/RecipeSkeleton";

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

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
        setFetchError("");
        setLoading(true);

        const base = import.meta.env.VITE_API_URL;
        if (!base) {
          throw new Error("VITE_API_URL is not defined (check Vercel / .env)");
        }

        let url = `${base}/recipes`;
        if (search) url = `${base}/recipes/search/${encodeURIComponent(search)}`;
        if (filter) url = `${base}/recipes/filter/tag/${encodeURIComponent(filter)}`;

        // debug: log the final URL
        console.log("Fetching recipes from:", url);

        const res = await axios.get(url, { timeout: 10000 });

        // defensive: make sure res.data is an array
        const data = Array.isArray(res.data) ? res.data : (res.data?.recipes || []);
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setFetchError("Could not load recipes. Check console/network or backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [search, filter]);

  if (loading)
    return (
      <div className="mt-10 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeSkeleton key={i} />
        ))}
      </div>
    );

  if (fetchError)
    return (
      <div className="mt-10 text-center text-red-500">
        {fetchError}
      </div>
    );

  return (
    <div className="mt-10 px-6 mb-20">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Explore Recipes 🍽️
      </h1>

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
              ${filter === f.tag
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 hover:bg-green-50"}
            `}
          >
            {f.label}
          </button>
        ))}

        {filter && (
          <button
            onClick={() => navigate("/recipes")}
            className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            Clear ✖️
          </button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r) => (
          <motion.div
            key={r._id || Math.random()}
            whileHover={{ scale: 1.04 }}
            className="cursor-pointer bg-white p-4 rounded-2xl shadow hover:shadow-lg"
            onClick={() => r._id && navigate(`/recipe/${r._id}`)}
          >
            <img
              src={r.image || "/placeholder.png"}
              alt={r.title || "Recipe"}
              className="w-full h-48 object-cover rounded-xl"
            />

            <h2 className="text-xl font-semibold mt-3">{r.title || "Untitled"}</h2>

            <p className="text-gray-500 text-sm mt-1">
              {(r.cookTime ?? "--")} mins • {(r.calories ?? "--")} cal
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {(Array.isArray(r.tags) ? r.tags : []).map((tag) => (
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
