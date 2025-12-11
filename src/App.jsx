import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import MealPlannerPage from "./pages/MealPlannerPage";
import GroceryPage from "./pages/GroceryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";


function App() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#222222]">
      
      <Navbar />

      <div className="max-w-6xl mx-auto py-6 px-4">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Recipes */}
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipe/:id" element={<RecipeDetailsPage />} />

          {/* Meal Planner */}
            <Route path="/mealplanner" element={<MealPlannerPage />} />
          {/* Grocery List */}
          <Route path="/grocery" element={<GroceryPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />

        </Routes>
      </div>

    </div>
  );
}

export default App;
