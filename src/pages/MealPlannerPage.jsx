
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function MealPlannerPage() {
  const [recipes, setRecipes] = useState([]);
  const [week, setWeek] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  const userId = localStorage.getItem("userId");
  const API = import.meta.env.VITE_API_URL;

  const days = [
    "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday", "sunday"
  ];

  /* -------------------------------
      FETCH ALL RECIPES
  --------------------------------*/
  useEffect(() => {
    axios.get(`${API}/recipes`)
      .then(res => setRecipes(res.data))
      .catch(() => console.log("Failed to load recipes"));
  }, []);

  /* -------------------------------
      LOAD SAVED WEEK PLAN
  --------------------------------*/
  useEffect(() => {
    if (!userId) return;

    axios.get(`${API}/mealplan/${userId}`)
      .then(res => {
        if (res.data?.week) {
          // Ensure all days exist as arrays
          const fixedWeek = {};
          days.forEach(day => {
            fixedWeek[day] = Array.isArray(res.data.week[day])
              ? res.data.week[day]
              : [];
          });
          setWeek(fixedWeek);
        }
      })
      .catch(() => console.log("Failed to load meal plan"));
  }, []);

  /* -------------------------------
      SAVE WEEK PLAN
  --------------------------------*/
  const savePlan = () => {
    axios.post(`${API}/mealplan/save`, { userId, week })
      .then(() => alert("Meal Plan Saved!"))
      .catch(() => alert("Save failed"));
  };

  /* -------------------------------
      AUTO GENERATE 1 RECIPE PER DAY
  --------------------------------*/
  const autoGenerate = () => {
    if (recipes.length < 7) return alert("Need at least 7 recipes");

    const selected = [...recipes]
      .sort(() => Math.random() - 0.5)
      .slice(0, 7);

    const newWeek = {
      monday: [selected[0]],
      tuesday: [selected[1]],
      wednesday: [selected[2]],
      thursday: [selected[3]],
      friday: [selected[4]],
      saturday: [selected[5]],
      sunday: [selected[6]],
    };

    setWeek(newWeek);
  };

  /* -------------------------------
      ASSIGN RECIPE TO A DAY
  --------------------------------*/
  const assignRecipe = (recipe) => {
    const day = prompt("Enter day (monday-sunday):")?.toLowerCase();
    if (!days.includes(day)) return alert("Invalid day!");

    setWeek(prev => ({
      ...prev,
      [day]: [...prev[day], recipe]   // 👈 PUSH into array
    }));
  };

  /* -------------------------------
      REMOVE A RECIPE FROM A DAY
  --------------------------------*/
  const removeMeal = (day, index) => {
    setWeek(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="mt-10 mb-20">

      <h1 className="text-3xl font-semibold text-center mb-6">
        Weekly Meal Planner 🍽️
      </h1>

      {/* Top Buttons */}
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

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {days.map((day) => (
          <div key={day} className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold capitalize mb-3">
              {day}
            </h2>

            {/* If day empty */}
            {week[day].length === 0 && (
              <p className="text-gray-500 text-sm">
                Click a recipe below to assign 👇
              </p>
            )}

            {/* Multiple meals */}
            {week[day].map((meal, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="border rounded-xl p-3 mb-3 shadow-sm relative bg-gray-50"
              >
                <img
                  src={meal.image}
                  className="w-full h-32 object-cover rounded"
                />

                <p className="font-medium mt-2">{meal.title}</p>
                <p className="text-gray-500 text-sm">
                  {meal.cookTime} mins • {meal.calories} cal
                </p>

                {/* Remove Button */}
                <button
                  onClick={() => removeMeal(day, index)}
                  className="text-red-500 text-xs mt-2"
                >
                  Remove ❌
                </button>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Recipe List */}
      <div className="mt-14">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Tap a recipe to add it to a day ⬇️
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4">
          {recipes.map((r) => (
            <motion.div
              key={r._id}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-3 rounded-xl shadow cursor-pointer"
              onClick={() => assignRecipe(r)}
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
