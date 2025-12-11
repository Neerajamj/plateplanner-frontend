import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function MealPlannerPage() {
  const days = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const userId = localStorage.getItem("plateplanner_userId");

  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [recipes, setRecipes] = useState([]);

  // If no user → show message
  useEffect(() => {
    if (!userId) {
      console.log("No user logged in");
    }
  }, [userId]);

  // Load existing plan
  useEffect(() => {
    if (!userId) return;
    async function loadPlan() {
      const res = await axios.get(`import.meta.env.VITE_API_URL/mealplan/get/${userId}`);
      if (res.data && res.data.plan) {
        setWeeklyPlan(res.data.plan);
      }
    }
    loadPlan();
  }, [userId]);

  // Fetch all recipes
  useEffect(() => {
    async function fetchRecipes() {
      const res = await axios.get("import.meta.env.VITE_API_URL/recipes");
      setRecipes(res.data);
    }
    fetchRecipes();
  }, []);

  const openModal = (day) => {
    if (!userId) return;
    setSelectedDay(day);
    setModalOpen(true);
  };

  const selectRecipe = async (recipe) => {
    if (!userId) return;

    const updatedPlan = { ...weeklyPlan, [selectedDay]: recipe };
    setWeeklyPlan(updatedPlan);
    setModalOpen(false);

    await axios.post("import.meta.env.VITE_API_URL/mealplan/save", {
      userId,
      plan: updatedPlan
    });
  };

  const removeRecipe = async (day) => {
    if (!userId) return;

    const updatedPlan = { ...weeklyPlan };
    delete updatedPlan[day];

    setWeeklyPlan(updatedPlan);

    await axios.post("import.meta.env.VITE_API_URL/mealplan/save", {
      userId,
      plan: updatedPlan
    });
  };

  const autoGenerateWeek = async () => {
    if (!userId || !recipes.length) return;

    const updatedPlan = {};
    days.forEach((day) => {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      updatedPlan[day] = recipes[randomIndex];
    });

    setWeeklyPlan(updatedPlan);

    await axios.post("import.meta.env.VITE_API_URL/mealplan/save", {
      userId,
      plan: updatedPlan
    });
  };

  if (!userId) {
    return (
      <div className="mt-16 text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-2">Log in to use Meal Planner</h2>
        <p>Go to Login, create an account, and your weekly plans will be saved for you 💚</p>
      </div>
    );
  }

  return (
    <div className="mt-10 px-6 mb-20 max-w-4xl mx-auto">

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-semibold text-center"
      >
        Weekly Meal Planner 🗓️
      </motion.h1>

      <p className="text-center text-gray-600 mt-2">
        Tap a day to choose a recipe or auto-generate your week
      </p>

      <div className="flex justify-center mt-6 mb-4">
        <button
          onClick={autoGenerateWeek}
          className="px-5 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
        >
          Auto-generate Week ✨
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {days.map((day, i) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 bg-white rounded-2xl shadow border"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-3">{day}</h2>

              {weeklyPlan[day] && (
                <button
                  onClick={() => removeRecipe(day)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Clear ✖
                </button>
              )}
            </div>

            {weeklyPlan[day] ? (
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => openModal(day)}
              >
                <img
                  src={weeklyPlan[day].image}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <p className="font-medium">{weeklyPlan[day].title}</p>
              </div>
            ) : (
              <div
                className="h-24 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 cursor-pointer"
                onClick={() => openModal(day)}
              >
                + Add Recipe
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 rounded-2xl shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">
              Select a recipe for {selectedDay}
            </h2>

            <div className="space-y-4">
              {recipes.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center gap-4 p-3 border rounded-xl hover:bg-green-50 cursor-pointer transition"
                  onClick={() => selectRecipe(r)}
                >
                  <img
                    src={r.image}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div>
                    <p className="font-semibold">{r.title}</p>
                    <p className="text-sm text-gray-500">{r.cookTime} mins</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}

export default MealPlannerPage;
