import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function GroceryPage() {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const userId = localStorage.getItem("userId");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function loadGrocery() {
      if (!userId) return;

      try {
        const res = await axios.get(`${API}/mealplan/${userId}`);
        const week = res.data?.week;

        if (!week) {
          setItems([]);
          return;
        }

        let grocery = [];

        // Loop through all days (each day has multiple meals now)
        Object.values(week).forEach((meals) => {
          if (Array.isArray(meals)) {
            meals.forEach((meal) => {
              meal?.ingredients?.forEach((ing) => {
                grocery.push({
                  name: ing.name,
                  quantity: ing.quantity,
                });
              });
            });
          }
        });

        // Combine duplicate items
        const combined = {};
        grocery.forEach((item) => {
          if (!combined[item.name]) {
            combined[item.name] = { ...item };
          } else {
            combined[item.name].quantity += ` + ${item.quantity}`;
          }
        });

        setItems(Object.values(combined));
      } catch (err) {
        console.log("Grocery fetch error:", err);
      }
    }

    loadGrocery();
  }, []);

  // ✔ Toggle checkbox state
  const toggleCheck = (name) => {
    setChecked((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // ✔ Download as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Grocery List", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    let y = 35;

    items.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(`${index + 1}. ${item.name} — ${item.quantity}`, 14, y);
      y += 10;
    });

    doc.save("grocery-list.pdf");
  };

  return (
    <div className="mt-10 mb-20 px-6">
      <h1 className="text-3xl font-semibold text-center mb-2">Grocery List 🛒</h1>
      <p className="text-center text-gray-500 mb-6">
        Auto-generated from your weekly meal plan
      </p>

      {/* PDF Button */}
      {items.length > 0 && (
        <div className="text-center mb-4">
          <button
            onClick={downloadPDF}
            className="px-5 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
          >
            Download PDF 📄
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center text-gray-600">
          No items yet — add meals to your planner 🍽️
        </p>
      ) : (
        <div className="bg-white shadow rounded-xl p-5 max-w-xl mx-auto">
          <ul className="space-y-4">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked[item.name] || false}
                    onChange={() => toggleCheck(item.name)}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span
                    className={`text-lg ${
                      checked[item.name] ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

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
