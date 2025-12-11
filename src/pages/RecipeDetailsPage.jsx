import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function RecipeDetailsPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const base = import.meta.env.VITE_API_URL;  // ✅ Correct
        const url = `${base}/recipes/${id}`;        // ✅ Correct

        console.log("Fetching recipe details from:", url);

        const res = await axios.get(url);
        setRecipe(res.data);

      } catch (err) {
        console.log("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-xl text-gray-600">Loading recipe...</p>;
  }

  if (!recipe) {
    return <p className="text-center mt-10 text-xl text-red-500">Recipe not found.</p>;
  }

  return (
    <div className="mt-10 px-6 mb-20 max-w-3xl mx-auto">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-semibold text-center"
      >
        {recipe.title}
      </motion.h1>

      {/* Image */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-72 object-cover rounded-2xl shadow mt-6"
      />

      {/* Basic Info */}
      <div className="mt-6 text-center text-gray-600 text-lg">
        {recipe.cookTime} mins • {recipe.calories} cal
      </div>

      {/* Tags */}
      <div className="flex justify-center flex-wrap gap-2 mt-3">
        {recipe.tags?.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Ingredients */}
      <h2 className="text-2xl font-semibold mt-10 mb-3">Ingredients 🥗</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        {recipe.ingredients?.map((ing) => (
          <li key={ing._id}>
            <strong>{ing.name}: </strong> {ing.quantity}
          </li>
        ))}
      </ul>

      {/* Steps */}
      <h2 className="text-2xl font-semibold mt-10 mb-3">Steps 👩‍🍳</h2>
      <ol className="list-decimal list-inside space-y-3 text-gray-700">
        {recipe.steps?.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

    </div>
  );
}

export default RecipeDetailsPage;
