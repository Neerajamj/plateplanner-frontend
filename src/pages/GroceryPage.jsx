import { useEffect, useState } from "react";
import axios from "axios";

function GroceryPage() {
  const [items, setItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function loadGrocery() {
      if (!userId) return;

      try {
        const res = await axios.get(`${API}/mealplan/${userId}`);

        if (!res.data?.week) {
          setItems([]);
          return;
        }

        const week = res.data.week;
        let grocery = [];

        // Loop through all days and collect ingredients
        Object.values(week).forEach((meal) => {
          if (meal?.ingredients) {
            meal.ingredients.forEach((ing) => {
              grocery.push({
                name: ing.name,
                quantity: ing.quantity,
              });
            });
          }
        });

        setItems(grocery);
      } catch (err) {
        console.log("Grocery fetch error:", err);
      }
    }

    loadGrocery();
  }, []);

  return (
    <div className="mt-10 mb-20 px-6">
      <h1 className="text-3xl font-semibold text-center mb-2">
        Grocery List 🛒
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Auto-generated from your weekly meal plan
      </p>

      {items.length === 0 ? (
        <p className="text-center text-gray-600">
          No items yet — add meals to your planner 🍽️
        </p>
      ) : (
        <div className="bg-white shadow rounded-xl p-5 max-w-xl mx-auto">
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
