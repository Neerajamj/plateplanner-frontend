import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

function GroceryPage() {
  const userId = localStorage.getItem("plateplanner_userId");

  const [plan, setPlan] = useState({});
  const [groceryList, setGroceryList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("groceryChecked");
    if (stored) setCheckedItems(JSON.parse(stored));
  }, []);

  const saveCheckedState = (state) => {
    localStorage.setItem("groceryChecked", JSON.stringify(state));
    setCheckedItems(state);
  };

  useEffect(() => {
    if (!userId) return;
    async function loadPlan() {
      const res = await axios.get(`https://plateplanner-backend-1.onrender.com/mealplan/get/${userId}`);
      if (res.data?.plan) {
        setPlan(res.data.plan);
        generateGrocery(res.data.plan);
      }
    }
    loadPlan();
  }, [userId]);

  const generateGrocery = (planObj) => {
    const items = {};
    Object.values(planObj).forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        if (!items[ing.name]) items[ing.name] = [];
        items[ing.name].push(ing.quantity);
      });
    });
    const finalList = Object.entries(items).map(([name, qty]) => ({
      name,
      quantityList: qty
    }));
    setGroceryList(finalList);
  };

  const toggleItem = (name) => {
    const updated = { ...checkedItems, [name]: !checkedItems[name] };
    saveCheckedState(updated);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Grocery List", 14, 20);
    let y = 35;
    doc.setFontSize(12);

    groceryList.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`• ${item.name}`, 14, y);
      y += 7;
      item.quantityList.forEach((q) => {
        doc.text(`   - ${q}`, 18, y);
        y += 6;
      });
      y += 4;
    });

    doc.save("grocery-list.pdf");
  };

  if (!userId) {
    return (
      <div className="mt-16 text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-2">Log in to see Grocery List</h2>
        <p>Your grocery list is created from your saved weekly meal plan 🥕</p>
      </div>
    );
  }

  return (
    <div className="mt-10 px-6 mb-20 max-w-3xl mx-auto">

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold text-center"
      >
        Grocery List 🛒
      </motion.h1>

      <p className="text-center text-gray-600 mt-2">
        Auto-generated from your weekly meal plan
      </p>

      {groceryList.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={downloadPDF}
            className="px-5 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
          >
            Download PDF 📄
          </button>
        </div>
      )}

      {groceryList.length === 0 && (
        <p className="text-center mt-14 text-gray-500 text-lg">
          No items yet — add meals to your planner 🍽️
        </p>
      )}

      <div className="mt-10 space-y-4">
        {groceryList.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-xl shadow border bg-white flex items-start gap-4 
              ${checkedItems[item.name] ? "opacity-50" : ""}`}
          >
            <input
              type="checkbox"
              checked={checkedItems[item.name] || false}
              onChange={() => toggleItem(item.name)}
              className="w-5 h-5 mt-1 accent-green-600 cursor-pointer"
            />

            <div>
              <h2
                className={`text-lg font-semibold 
                ${checkedItems[item.name] ? "line-through text-gray-400" : ""}`}
              >
                {item.name}
              </h2>

              <ul className="list-disc ml-6 text-gray-600 mt-1">
                {item.quantityList.map((q, idx) => (
                  <li
                    key={idx}
                    className={`${checkedItems[item.name] ? "line-through text-gray-400" : ""}`}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
}

export default GroceryPage;
