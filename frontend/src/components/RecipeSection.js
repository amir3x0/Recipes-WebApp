import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import { fetchRecipes } from "../services/BackendService";
import { useLocation } from "react-router-dom";
import { useSelectedRecipes } from "../context/SelectedRecipesContext";
import { useRecipesForShoppingList } from "../context/RecipesForShoppingListContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

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
  const [selectedCategory, setSelectedCategory] = useState(null); // Currently selected category
  const [loadingStatus, setLoadingStatus] = useState("Loading"); // Loading status of recipe data
  const location = useLocation(); // Location object to access state from router
  const fromShoppingList = location.state?.fromShoppingList; // Flag indicating if redirected from shopping list
  const passedCategory = location.state?.category; // Category passed from previous page
  const { addRecipe } = useSelectedRecipes(); // Function to add selected recipes to user's list
  const { addRecipeForShoppingList } = useRecipesForShoppingList(); // Function to add recipes to shopping list
  const navigate = useNavigate(); // Function to navigate to different routes
  const { theme } = useTheme(); // Current theme used in the application

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
    setSelectedCategory(selectedRecipe === recipe ? null : category);
  };

  // Set document title
  document.title = "Our Recipes";

  // Category colors for light theme
  const categoryColors = {
    appetizers: "bg-pink-50",
    starters: "bg-indigo-50",
    "main dish": "bg-green-50",
    dessert: "bg-yellow-50",
  };

  // Category colors for dark theme
  const categoryColorsDark = {
    appetizers: "bg-pink-900",
    starters: "bg-indigo-900",
    "main dish": "bg-green-900",
    dessert: "bg-yellow-900",
  };

  // Render error message if loading fails
  if (loadingStatus === "Error")
    return (
      <div className="text-center text-red-500">Error loading recipes.</div>
    );
  // Render loading message if data is still loading
  if (loadingStatus !== "Loaded")
    return <div className="text-center">Loading...</div>;

  /**
   * Renders a container with recipes, allowing users to explore recipes.
   * Provides a search bar to filter recipes by name.
   * Displays recipes grouped by category with recipe cards.
   * Handles recipe selection and click events.
   */
  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 dark:text-red-400">
          Explore Recipes
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
          Discover your next favorite dish
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search for recipes..."
          className="form-input mt-1 block w-full md:w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 bg-clip-padding border border-solid border-gray-300 dark:border-gray-700 rounded transition ease-in-out m-0 focus:text-gray-700 dark:focus:text-gray-300 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {Object.entries(displayedRecipes).length > 0 ? (
        Object.entries(displayedRecipes).map(([category, recipes]) => (
          <div
            key={category}
            className={`${
              theme === "dark"
                ? categoryColorsDark[category] || "bg-gray-950" // Deeper shades
                : categoryColors[category] || "bg-gray-100"
            } mb-12 p-4 rounded-lg shadow-lg dark:shadow-xl dark:shadow-black/30`} // Enhanced shadow
          >
            <h2 className="text-2xl font-bold mb-4 capitalize text-primary dark:text-primary-light">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className={`p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 bg-white ${
                    selectedRecipe === recipe
                      ? "ring-2 ring-offset-2 ring-blue-500"
                      : ""
                  }`}
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
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-800 dark:text-gray-200">
          No recipes found.
        </div>
      )}
    </div>
  );
};

export default RecipeSection;
