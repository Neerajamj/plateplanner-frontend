import { useEffect, useState } from "react";
import axios from "axios";

function GroceryPage() {
  const [items, setItems] = useState([]);
  const userId = localStorage.getItem("plateplanner_userId");

  useEffect(() => {
    async function loadPlan() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/mealplan/${userId}`
        );

        if (!res.data || !res.data.week) {
          setItems([]);
          return;
        }

        const week = res.data.week;
        let grocery = {};

        Object.values(week).forEach((meal) => {
          if (meal && meal.ingredients) {
            meal.ingredients.forEach((ing) => {
              if (!grocery[ing.name]) {
                grocery[ing.name] = ing.quantity || "1 unit";
              }
            });
          }
        });

        setItems(
          Object.entries(grocery).map(([name, qty]) => ({
            name,
            quantity: qty
          }))
        );

      } catch (err) {
        console.log("Grocery load error:", err);
      }
    }

    loadPlan();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6">
      <h1 className="text-3xl font-semibold text-center mb-2">
        Grocery List 🛒
      </h1>

      <p className="text-center text-gray-500 mb-8">
        Auto-generated from your weekly meal plan
      </p>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No items yet — add meals to your planner 🍽️
        </p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow">
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex justify-between border-b pb-2 text-lg"
              >
                <span>{item.name}</span>
                <span className="text-gray-600">{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GroceryPage;
