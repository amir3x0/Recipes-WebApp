import React, { createContext, useContext, useState } from 'react';

// Creating a context for managing the shopping list throughout the app.
// Starting with 'null' as the default value since we'll be providing an actual value through a provider.
const ShoppingListContext = createContext(null);

// A custom hook for consuming the context easily within other components.
export const useShoppingList = () => useContext(ShoppingListContext);

// Provider component for the shopping list, allowing any child components to access and manipulate the shopping list.
export const ShoppingListProvider = ({ children }) => {
  // The shopping list state is initialized as an empty array, ready to hold our ingredients.
  const [shoppingList, setShoppingList] = useState([]);

  // Function to add a new ingredient to the shopping list.
  // It takes the new ingredient and adds it to the current list.
  const addIngredientToShoppingList = (newIngredient) => {
    setShoppingList(prevShoppingList => [...prevShoppingList, newIngredient]);
  };

  // Function to remove an ingredient from the shopping list based on its index.
  // This allows us to precisely target and remove specific items from our list.
  const removeIngredientFromShoppingList = (index) => {
    setShoppingList(prevShoppingList => {
      const newList = [...prevShoppingList];
      newList.splice(index, 1);
      return newList; // Returns the new list without the removed ingredient.
    });
  };

  // Function to clear out the shopping list entirely, resetting it back to an empty array.
  const clearShoppingList = () => {
    setShoppingList([]);
  };

  // The provider component passes down the shopping list and the functions to modify it to all child components.
  return (
    <ShoppingListContext.Provider value={{ shoppingList, addIngredientToShoppingList, removeIngredientFromShoppingList, clearShoppingList }}>
      {children} {/* This renders the child components, allowing them access to the shopping list context. */}
    </ShoppingListContext.Provider>
  );
};
