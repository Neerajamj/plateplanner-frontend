import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function MealPlannerPage() {
  const [recipes, setRecipes] = useState([]);
  const [week, setWeek] = useState({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  });

  const userId = localStorage.getItem("plateplanner_userId");
  const API = import.meta.env.VITE_API_URL;

  // Fetch recipes
  useEffect(() => {
    axios.get(`${API}/recipes`).then(res => setRecipes(res.data));
  }, []);

  // Load saved week plan
  useEffect(() => {
    if (!userId) return;

    axios.get(`${API}/mealplan/${userId}`)
      .then(res => {
        if (res.data?.week) setWeek(res.data.week);
      })
      .catch(() => console.log("Failed to load meal plan"));
  }, []);

  // Save plan
  const savePlan = () => {
    axios.post(`${API}/mealplan/save`, { userId, week })
      .then(() => alert("Saved!"))
      .catch(() => alert("Save failed"));
  };

  // Auto-generator (random 7 recipes)
  const autoGenerate = () => {
    if (recipes.length < 7) return alert("Need at least 7 recipes");

    const selected = [...recipes]
      .sort(() => Math.random() - 0.5)
      .slice(0, 7);

    const newWeek = {
      monday: selected[0],
      tuesday: selected[1],
      wednesday: selected[2],
      thursday: selected[3],
      friday: selected[4],
      saturday: selected[5],
      sunday: selected[6],
    };

    setWeek(newWeek);
  };

  const days = [
    "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday", "sunday"
  ];

  return (
    <div className="mt-10 mb-20">

      <h1 className="text-3xl font-semibold text-center mb-6">
        Weekly Meal Planner 🍽️
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={autoGenerate}
          className="px-5 py-2 bg-green-600 text-white rounded-xl"
        >
          Auto Generate Week ⚡
        </button>

        <button
          onClick={savePlan}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl"
        >
          Save Plan 💾
        </button>
      </div>

      {/* Weekly grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {days.map((day) => (
          <div key={day} className="bg-white p-4 rounded-xl shadow">

            <h2 className="text-xl font-semibold capitalize mb-3">
              {day}
            </h2>

            {/* If empty */}
            {!week[day] && (
              <p className="text-gray-500 text-sm">
                Click a recipe to assign 👇
              </p>
            )}

            {/* Show recipe */}
            {week[day] && (
              <motion.div className="border rounded-xl p-3 mb-3 shadow-sm">
                <img
                  src={week[day].image}
                  className="w-full h-32 object-cover rounded"
                />
                <p className="font-medium mt-2">{week[day].title}</p>
                <p className="text-gray-500 text-sm">
                  {week[day].cookTime} mins • {week[day].calories} cal
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Recipe List */}
      <div className="mt-14">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Tap a recipe to assign ⬇️
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4">
          {recipes.map((r) => (
            <motion.div
              key={r._id}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-3 rounded-xl shadow cursor-pointer"
              onClick={() => {
                const day = prompt("Enter day (monday-sunday):")?.toLowerCase();
                if (!days.includes(day)) return alert("Invalid day!");
                setWeek((prev) => ({ ...prev, [day]: r }));
              }}
            >
              <img src={r.image} className="h-28 w-full object-cover rounded" />
              <p className="font-medium mt-2">{r.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MealPlannerPage;
