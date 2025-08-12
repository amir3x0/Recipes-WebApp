import React, { useState } from "react";
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
<div className="container mx-auto mt-10 px-5 dark:bg-gray-900 dark:text-gray-200">
      <div className="w-full mb-10">
        <div className="image-container relative overflow-hidden max-h-72">
          <img className="w-full" src={PlanBg} alt="Plan Your Meal" />
          <div className="overlay absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-55 p-5">
            <h1 className="text-white text-4xl font-serif mb-5">Plan A Meal</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between">
    <div className="w-full lg:w-3/4 pr-4 mb-10 lg:mb-0">
      {["Appetizers", "Starters", "Main Dish", "Dessert"].map((category) => (
        <div key={category} className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 uppercase">
              {category}
            </h2>
            <button
              className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-300"
              onClick={() => handleAddRecipe(category)}
            >
              +
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedRecipes.filter((recipe) => recipe.category === category).map((recipe) => (
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

    <div className="w-full lg:w-1/4 lg:pl-4">
      <div className="mt-4">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          placeholder="Enter meal plan name"
          value={mealPlanName}
          onChange={(e) => setMealPlanName(e.target.value)}
        />
        <button
          className="mt-2 w-full bg-green-500 dark:bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-800 focus:ring-opacity-50 shadow-lg"
          onClick={handleSavePlanMeal}
        >
          Save Plan Meal
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default PlanSection;