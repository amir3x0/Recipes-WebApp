import React, { createContext, useContext, useState } from 'react';
import { fetchRecipeById } from '../services/BackendService'; // Importing a function to fetch recipe details by ID.

// Creating a context for managing selected recipes in our app.
const SelectedRecipesContext = createContext();

// A custom hook to make using our context easier and cleaner in other parts of our app.
export const useSelectedRecipes = () => useContext(SelectedRecipesContext);

// The provider component for our selected recipes context.
export const SelectedRecipesProvider = ({ children }) => {
  // State to hold our selected recipes array.
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  // Function to add a recipe to our selection.
  const addRecipe = async (recipeId) => {
    try {
      // Fetch the full details of the recipe by its ID.
      const recipeDetails = await fetchRecipeById(recipeId);

      // Update the selected recipes state to include the new recipe.
      setSelectedRecipes((prevRecipes) => {
        // First, check if the recipe is already selected to avoid duplicates.
        const isExisting = prevRecipes.some(recipe => recipe._id === recipeDetails._id);
        if (!isExisting) {
          // If it's a new recipe, add it to our list of selected recipes.
          return [...prevRecipes, recipeDetails];
        }
        // If the recipe is already in the list, just return the current list unchanged.
        return prevRecipes;
      });
    } catch (error) {
      console.error("Error fetching recipe details: ", error);
      // Here, you might want to handle the error, such as displaying a notification to the user.
    }
  };

  // Function to clear out all selected recipes.
  const clearSelectedRecipes = () => {
    setSelectedRecipes([]);
  };

  // Providing our selected recipes state and functions to any children components.
  return (
    <SelectedRecipesContext.Provider value={{ selectedRecipes, addRecipe, clearSelectedRecipes }}>
      {children}
    </SelectedRecipesContext.Provider>
  );
};
