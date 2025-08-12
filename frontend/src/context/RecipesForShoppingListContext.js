import React, { createContext, useContext, useState } from 'react';
import { fetchRecipeById } from '../services/BackendService'; // Importing the service to fetch recipe details.

// Creating a context for managing recipes specifically for a shopping list.
const RecipesForShoppingListContext = createContext();

// Custom hook to easily use the context in other components.
export const useRecipesForShoppingList = () => useContext(RecipesForShoppingListContext);

// Provider component that wraps the part of the app where recipes for shopping list are needed.
export const RecipesForShoppingListProvider = ({ children }) => {
  // State to hold the list of recipes designated for the shopping list.
  const [recipesForShoppingList, setRecipesForShoppingList] = useState([]);

  // Function to add a recipe to the shopping list by its ID.
  const addRecipeForShoppingList = async (recipeId) => {
    try {
      // Fetching recipe details from the backend using the provided recipe ID.
      const recipeDetails = await fetchRecipeById(recipeId);
      
      // Check if the recipe already exists in the shopping list to avoid duplicates.
      const existingRecipeIndex = recipesForShoppingList.findIndex(recipe => recipe._id === recipeDetails._id);
      if (existingRecipeIndex !== -1) {
        // If the recipe is already in the list, increase its quantity.
        const updatedRecipes = [...recipesForShoppingList];
        updatedRecipes[existingRecipeIndex].quantity += 1;
        setRecipesForShoppingList(updatedRecipes);
      } else {
        // If it's a new recipe, add it to the list with an initial quantity of 1.
        setRecipesForShoppingList(prevRecipes => [...prevRecipes, { ...recipeDetails, quantity: 1 }]);
      }
    } catch (error) {
      console.error("Error fetching recipe details: ", error);
    }
  };

  // Function to subtract the quantity of a specific recipe or remove it if the quantity becomes zero.
  const subRecipeForShoppingList = (recipeId) => {
    const updatedRecipes = recipesForShoppingList.map(recipe => {
      if (recipe._id === recipeId && recipe.quantity > 1) {
          // Decrease the quantity by 1 if more than 1.
          return { ...recipe, quantity: recipe.quantity - 1 };
      } else if (recipe._id === recipeId) {
          // If the quantity is 1, this function call will lead to the removal of the recipe.
          removeRecipeFromShoppingList(recipeId);
      }
      return recipe;
    }).filter(recipe => recipe !== undefined); // Filter out undefined entries caused by removals.

    setRecipesForShoppingList(updatedRecipes);
  };

  // Function to remove a recipe from the shopping list completely, regardless of quantity.
  const removeRecipeFromShoppingList = (recipeId) => {
    setRecipesForShoppingList(prevRecipes =>
      prevRecipes.filter(recipe => recipe._id !== recipeId)
    );
  };

  // Function to clear out all recipes from the shopping list.
  const clearRecipesForShoppingList = () => {
    setRecipesForShoppingList([]);
  };

  return (
    <RecipesForShoppingListContext.Provider value={{ recipesForShoppingList, addRecipeForShoppingList, subRecipeForShoppingList, removeRecipeFromShoppingList, clearRecipesForShoppingList }}>
      {children}
    </RecipesForShoppingListContext.Provider>
  );
};
