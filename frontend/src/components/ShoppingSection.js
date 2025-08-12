import React, { useEffect, useState } from "react";
import { useShoppingList } from "../context/ShoppingListContext";
import { useNavigate } from "react-router-dom";
import { useRecipesForShoppingList } from "../context/RecipesForShoppingListContext";
import ShopBg from "../pages/shopping/shopping_img/Shopping-list-paper.jpg";

/**
 * The ShoppingSection component displays the shopping section interface,
 * allowing users to manage their shopping list by adding, removing, and adjusting
 * quantities of ingredients from selected recipes or manually.
 */
const ShoppingSection = () => {
  // Hooks and context variables
  const {
    recipesForShoppingList,
    addRecipeForShoppingList,
    subRecipeForShoppingList,
    removeRecipeFromShoppingList,
  } = useRecipesForShoppingList();
  const navigate = useNavigate();
  const { shoppingList: initialShoppingList, addIngredientToShoppingList } = useShoppingList();
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [manuallyAddedIngredients, setManuallyAddedIngredients] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);

  // useEffect to calculate recipe ingredients based on selected recipes
  useEffect(() => {
    const calculatedRecipeIngredients = recipesForShoppingList.flatMap(
      (recipe) =>
        recipe.ingredients.map((ingredient) => ({
          name: ingredient.name,
          quantity: parseQuantity(ingredient.quantity) * (recipe.quantity || 0),
          unit: ingredient.unit,
        }))
    );
    setRecipeIngredients(calculatedRecipeIngredients);
  }, [recipesForShoppingList]);

  // Function to parse quantity string to number
  const parseQuantity = (quantity) => {
    const quantityStr = String(quantity);
    if (!quantityStr) return 0;
    if (quantityStr.includes("/")) {
      const [numerator, denominator] = quantityStr.split("/");
      return parseFloat(numerator) / parseFloat(denominator);
    }
    return parseFloat(quantityStr);
  };

  // Handlers for adding, subtracting, and removing recipes
  const handleAddRecipe = () => {
    navigate("/recipes", { state: { fromShoppingList: true } });
  };

  const handleAddQuantity = (recipeId) => {
    addRecipeForShoppingList(recipeId);
  };

  const handleSubQuantity = (recipeId) => {
    subRecipeForShoppingList(recipeId);
  };

  const handleRemoveRecipe = (recipeId) => {
    removeRecipeFromShoppingList(recipeId);
  };

  const handleAddIngredient = () => {
    if (
      ingredientName.trim() === "" ||
      quantity.trim() === "" ||
      unit.trim() === ""
    ) {
      // Do not add ingredient if any field is empty
      return;
    }
    const newIngredient = {
      name: ingredientName.trim(),
      quantity: parseQuantity(quantity),
      unit: unit.trim(),
    };

    // Add manually added ingredient to the state
    addIngredientToShoppingList(newIngredient);

    // Clear input fields after adding ingredient
    setIngredientName("");
    setQuantity("");
    setUnit("");
  };

  // Combine manually added ingredients with recipe ingredients and initial shopping list
  const combinedShoppingList = [
    ...initialShoppingList,
    ...manuallyAddedIngredients,
    ...recipeIngredients,
  ];

  return (
    <div
      className="container mx-auto p-4 max-w-8xl relative grid grid-cols-2 gap-4"
      style={{
        backgroundImage: `url(${ShopBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="col-span-1 bg-opacity-50 dark:bg-opacity-30 p-4 rounded-lg flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <button
          className="mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-150 ease-in-out mb-4"
          onClick={handleAddRecipe}
        >
          Add Ingredients According To Recipe
        </button>
        <input
          type="text"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          placeholder="Ingredient Name..."
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 mb-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        />
        <div className="flex items-center mb-4">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="border border-gray-300 dark:border-gray-600 rounded-l-lg p-2 mr-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-r-lg p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <option value="">Select Unit</option>
            <option value="tsp">Teaspoon</option>
            <option value="cup">Cup</option>
            <option value="whole">Whole</option>
            <option value="g">Gram</option>
          </select>
        </div>
        <button
          onClick={handleAddIngredient}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-150 ease-in-out"
        >
          Add Ingredient
        </button>
      </div>
      <div className="col-span-1 bg-opacity-80 shadow-lg bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
          Selected recipes for shopping list
        </h2>
        <div className="overflow-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold text-left text-gray-600 dark:text-gray-300 uppercase">
                  Recipe
                </th>
                <th className="px-6 py-3 font-semibold text-left text-gray-600 dark:text-gray-300 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 font-semibold text-left text-gray-600 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recipesForShoppingList.map((recipe, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                    {recipe.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {recipe.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => handleAddQuantity(recipe._id)}
                      className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleSubQuantity(recipe._id)}
                      className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleRemoveRecipe(recipe._id)}
                      className="bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-1 shadow-lg bg-gray-100 dark:bg-gray-800 p-4 rounded-lg bg-opacity-80">
        <h2 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
          Shopping List
        </h2>
        <div className="overflow-auto max-h-96">
          <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold text-left text-gray-600 dark:text-gray-300 uppercase">
                  Ingredient
                </th>
                <th className="px-4 py-3 font-semibold text-left text-gray-600 dark:text-gray-300 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-3 font-semibold text-left text-gray-600 dark:text-gray-300 uppercase">
                  Unit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {combinedShoppingList.map(({ name, quantity, unit }, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {name}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {quantity}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShoppingSection;
