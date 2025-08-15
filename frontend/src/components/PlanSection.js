import React, { useState } from "react";
import { motion } from "framer-motion";
import RecipeCard from "./RecipeCard";
import PlanBg from "../pages/plan/plan_img/planBg.jpg";
import { useNavigate } from "react-router-dom";
import { useSelectedRecipes } from "../context/SelectedRecipesContext";
import { useUser } from "../context/UserContext";
import { saveMealPlan } from "../services/BackendService";


const PlanSection = () => {
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const { selectedRecipes, clearSelectedRecipes } = useSelectedRecipes();
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [mealPlanName, setMealPlanName] = useState('');
  const handleAddRecipe = (category) => {
    navigate(`/Recipes`, { state: { category } });
  };

  const handleSavePlanMeal = async () => {
    const mealPlanData = {
      name: mealPlanName,
      recipes: selectedRecipes.map(recipe => recipe._id), 
      userId: user._id,
    };
    const response = await saveMealPlan(mealPlanData);
    if (response) {
      updateUser({ MealPlans: [...user.MealPlans, response.meal_id] });
      setMealPlanName('');
    }
    clearSelectedRecipes();  
  };

  return (
    <section className="relative">
      {/* accent line */}
      <div className="absolute inset-x-0 -top-2 h-1 bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 rounded-full blur-[1px]" aria-hidden="true" />

      <div className="max-w-6xl mx-auto mt-10 px-4 text-gray-800 dark:text-gray-200">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full mb-8 overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-xl"
        >
          <div className="relative h-48 md:h-60">
            <img className="w-full h-full object-cover" src={PlanBg} alt="Plan Your Meal" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h1 className="text-white text-3xl md:text-4xl font-extrabold">Plan a Meal</h1>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-between gap-6">
          <div className="w-full lg:w-3/4">
            {["Appetizers", "Starters", "Main Dish", "Dessert"].map((category) => (
              <div key={category} className="mb-8 rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-4 md:p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-extrabold bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent uppercase">
                    {category}
                  </h2>
                  <button
                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow"
                    onClick={() => handleAddRecipe(category)}
                    aria-label={`Add recipe to ${category}`}
                  >
                    + Add
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedRecipes
                    .filter((recipe) => recipe.category === category)
                    .map((recipe) => (
                      <RecipeCard
                        key={recipe._id}
                        recipe={recipe}
                        isExpanded={expandedRecipeId === recipe._id}
                        onClick={() => setExpandedRecipeId(expandedRecipeId === recipe._id ? null : recipe._id)}
                        showSelectButton={false}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[calc(25%-0.5rem)]">
            <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-5">
              <label htmlFor="mealPlanName" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Meal plan name</label>
              <input
                id="mealPlanName"
                type="text"
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Enter meal plan name"
                value={mealPlanName}
                onChange={(e) => setMealPlanName(e.target.value)}
              />
              <button
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-rose-400"
                onClick={handleSavePlanMeal}
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanSection;