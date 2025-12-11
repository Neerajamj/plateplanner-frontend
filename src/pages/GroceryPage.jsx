import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function GroceryPage() {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const userId = localStorage.getItem("plateplanner_userId");

  useEffect(() => {
    async function loadPlan() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/mealplan/${userId}`);

        if (!res.data || !res.data.week) {
          setItems([]);
          return;
        }

        const week = res.data.week;
        let grocery = {};

        Object.values(week).forEach((meal) => {
          if (meal && meal.ingredients) {
            meal.ingredients.forEach((ing) => {
              grocery[ing.name] = ing.quantity || "1 unit";
            });
          }
        });

        const formatted = Object.entries(grocery).map(([name, qty]) => ({
          name,
          quantity: qty,
          category: getCategory(name),
        }));

        setItems(formatted);
      } catch (err) {
        console.log("Grocery load error:", err);
      }
    }

    loadPlan();
  }, []);

  // Auto-categorize item names
  function getCategory(name) {
    name = name.toLowerCase();
    if (["paneer", "milk", "curd", "cheese", "butter"].some((x) => name.includes(x))) return "Dairy";
    if (["tomato", "onion", "potato", "carrot", "beans"].some((x) => name.includes(x))) return "Vegetables";
    if (["masala", "spice", "jeera", "turmeric", "mirchi"].some((x) => name.includes(x))) return "Spices";
    return "Others";
  }

  // Toggle checkbox
  function toggleCheck(name) {
    setChecked((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }

  // Clear all
  function clearAll() {
    setChecked({});
  }

  // Generate PDF
  function downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Grocery List", 14, 15);

    let y = 30;
    doc.setFontSize(12);

    items.forEach((item) => {
      doc.text(`• ${item.name} — ${item.quantity}`, 14, y);
      y += 8;
    });

    doc.save("grocery-list.pdf");
  }

  // Mobile share
  async function shareList() {
    const text = items.map((i) => `${i.name} — ${i.quantity}`).join("\n");

    if (navigator.share) {
      await navigator.share({ title: "My Grocery List", text });
    } else {
      alert("Sharing not supported on this device");
    }
  }

  // Group by category
  const grouped = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6 mb-20">
      <h1 className="text-3xl font-semibold text-center mb-2">
        Grocery List 🛒
      </h1>

      <p className="text-center text-gray-500 mb-6">
        Auto-generated from your weekly meal plan
      </p>

      {/* Actions */}
      {items.length > 0 && (
        <div className="flex justify-center gap-3 mb-6">
          <button onClick={downloadPDF} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Download PDF 📄
          </button>

          <button onClick={shareList} className="px-4 py-2 bg-purple-500 text-white rounded-lg">
            Share 📤
          </button>

          <button onClick={clearAll} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
            Clear Checks ❌
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No items yet — add meals to your planner 🍽️
        </p>
      ) : (
        <div className="space-y-8">
          {Object.keys(grouped).map((category) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-3">{category}</h2>
              <div className="bg-white rounded-xl shadow p-4">
                {grouped[category].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked[item.name] || false}
                        onChange={() => toggleCheck(item.name)}
                        className="w-5 h-5"
                      />

                      <span
                        className={`text-lg ${
                          checked[item.name] ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <span className="text-gray-600">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroceryPage;
