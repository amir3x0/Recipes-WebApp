import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RecipeCard from "./RecipeCard";
import { fetchRecipes } from "../services/BackendService";
import { useLocation } from "react-router-dom";
import { useSelectedRecipes } from "../context/SelectedRecipesContext";
import { useRecipesForShoppingList } from "../context/RecipesForShoppingListContext";
import { useNavigate } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext";

/**
 * The RecipeSection component displays a list of recipes categorized by their categories.
 * Users can filter recipes by category, search for specific recipes, and add selected recipes
 * to their list for further actions like shopping or cooking.
 */
const RecipeSection = () => {
  // State variables
  const [originalRecipes, setOriginalRecipes] = useState({}); // Original recipes fetched from the backend
  const [displayedRecipes, setDisplayedRecipes] = useState({}); // Recipes currently displayed based on filters
  const [searchTerm, setSearchTerm] = useState(""); // Search term to filter recipes
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Currently selected recipe
  const [loadingStatus, setLoadingStatus] = useState("Loading"); // Loading status of recipe data
  const location = useLocation(); // Location object to access state from router
  const fromShoppingList = location.state?.fromShoppingList; // Flag indicating if redirected from shopping list
  const passedCategory = location.state?.category; // Category passed from previous page
  const { addRecipe } = useSelectedRecipes(); // Function to add selected recipes to user's list
  const { addRecipeForShoppingList } = useRecipesForShoppingList(); // Function to add recipes to shopping list
  const navigate = useNavigate(); // Function to navigate to different routes
  // const { theme } = useTheme(); // Current theme used in the application

  // Effect to fetch recipes data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recipes data from backend
        const fetchedRecipes = await fetchRecipes();
        let categorized;
        if (passedCategory) {
          // Filter recipes by the passed category if available
          categorized = {
            [passedCategory]: fetchedRecipes.filter(
              (recipe) =>
                recipe.category.toLowerCase() === passedCategory.toLowerCase()
            ),
          };
        } else {
          // Original categorization logic if no specific category passed
          categorized = fetchedRecipes.reduce((acc, recipe) => {
            const category = recipe.category.toLowerCase();
            if (!acc[category]) acc[category] = [];
            acc[category].push({ ...recipe, picture: recipe.picture });
            return acc;
          }, {});
        }
        // Set original and displayed recipes
        setOriginalRecipes(categorized);
        setDisplayedRecipes(categorized);
        setLoadingStatus("Loaded");
      } catch (error) {
        setLoadingStatus("Error");
      }
    };

    fetchData();
  }, [passedCategory]);

  const handleSelectRecipe = (recipeId) => {
    // Use the addRecipe method from the context to add the selected recipe
    if (fromShoppingList) {
      addRecipeForShoppingList(recipeId)
        .then(() => {
          // After adding the recipe, navigate back to the PlanSection
          navigate("/Shopping");
        })
        .catch((error) => console.error("Error adding recipe:", error));
    } else {
      addRecipe(recipeId)
        .then(() => {
          // After adding the recipe, navigate back to the PlanSection
          navigate("/plan");
        })
        .catch((error) => console.error("Error adding recipe:", error));
    }
  };

  /**
   * The useEffect hook is used to update the displayed recipes based on the search term.
   * If the search term is empty, all original recipes are displayed.
   * If there's a search term, recipes are filtered based on the title containing the search term.
   */
  useEffect(() => {
    if (!searchTerm.trim()) {
      // If search term is empty, display all original recipes
      setDisplayedRecipes(originalRecipes);
    } else {
      // Filter original recipes based on search term and update displayed recipes
      const filtered = Object.keys(originalRecipes).reduce((acc, category) => {
        const filteredRecipes = originalRecipes[category].filter((recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredRecipes.length) acc[category] = filteredRecipes;
        return acc;
      }, {});
      setDisplayedRecipes(filtered);
    }
  }, [searchTerm, originalRecipes]);

  /**
   * The handleRecipeClick function toggles the selection of a recipe.
   * If a recipe is clicked, it becomes selected and its category is also set.
   * If the same recipe is clicked again, it becomes unselected.
   */
  const handleRecipeClick = (recipe, category) => {
    setSelectedRecipe(selectedRecipe === recipe ? null : recipe);
  };

  // Set document title
  document.title = "Our Recipes";

  // Removed legacy category color maps in favor of glass panels

  // Render error message if loading fails
  if (loadingStatus === "Error")
    return (
      <div className="text-center text-red-500">Error loading recipes.</div>
    );
  // Render loading message if data is still loading
  if (loadingStatus !== "Loaded")
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );

  /**
   * Renders a container with recipes, allowing users to explore recipes.
   * Provides a search bar to filter recipes by name.
   * Displays recipes grouped by category with recipe cards.
   * Handles recipe selection and click events.
   */
  const categories = Object.keys(displayedRecipes || {});

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-950 dark:to-black -z-10" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent">
            Explore Recipes
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Discover your next favorite dish
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="sticky top-16 z-10 mb-6">
          <div className="rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
                <input
                  type="text"
                  placeholder="Search for recipes..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 dark:text-gray-300"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <a
                      key={cat}
                      href={`#cat-${cat.replace(/\s+/g, "-")}`}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500/10 to-fuchsia-500/10 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/20 hover:ring-rose-500/40 transition"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {Object.entries(displayedRecipes).length > 0 ? (
          Object.entries(displayedRecipes).map(([category, recipes]) => (
            <section
              key={category}
              id={`cat-${category.replace(/\s+/g, "-")}`}
              className="scroll-mt-24 mb-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold capitalize bg-gradient-to-r from-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
                    {category}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {recipes.map((recipe) => (
                    <motion.div
                      key={recipe._id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35 }}
                      onClick={() => handleRecipeClick(recipe, category)}
                    >
                      <RecipeCard
                        recipe={recipe}
                        isExpanded={
                          selectedRecipe && selectedRecipe._id === recipe._id
                        }
                        onSelect={() => handleSelectRecipe(recipe._id)}
                        showSelectButton={!!passedCategory || fromShoppingList}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>
          ))
        ) : (
          <div className="text-center text-gray-800 dark:text-gray-200">
            No recipes found.
          </div>
        )}
      </div>
    </section>
  );
};

export default RecipeSection;
