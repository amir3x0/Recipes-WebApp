import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
      const n = parseFloat(numerator);
      const d = parseFloat(denominator) || 1;
      if (isNaN(n) || isNaN(d)) return 0;
      return n / d;
    }
    const v = parseFloat(quantityStr);
    return isNaN(v) ? 0 : v;
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

    // Persist to shopping list context
    addIngredientToShoppingList(newIngredient);

    // Clear inputs
    setIngredientName("");
    setQuantity("");
    setUnit("");
  };

  // Combine context shopping list with recipe-derived ingredients
  const combinedShoppingList = [...initialShoppingList, ...recipeIngredients];
  // Animations
  const card = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <section
      className="relative"
      style={{
        backgroundImage: `url(${ShopBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Ingredients / Manual Entry */}
          <motion.div
            variants={card}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-2xl bg-white/80 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-6"
          >
            <h3 className="text-lg font-extrabold bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent">
              Add Ingredients
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Add manually or from selected recipes.</p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow"
                onClick={handleAddRecipe}
              >
                Add from Recipes
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={ingredientName}
                onChange={(e) => setIngredientName(e.target.value)}
                placeholder="Ingredient name"
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Qty"
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="">Unit</option>
                <option value="tsp">Teaspoon</option>
                <option value="cup">Cup</option>
                <option value="whole">Whole</option>
                <option value="g">Gram</option>
              </select>
            </div>
            <div className="mt-3">
              <button
                onClick={handleAddIngredient}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow"
              >
                Add Ingredient
              </button>
            </div>
          </motion.div>

          {/* Selected Recipes */}
          <motion.div
            variants={card}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-2xl bg-white/80 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-6"
          >
            <h3 className="text-lg font-extrabold text-gray-800 dark:text-gray-100">Selected Recipes</h3>
            <div className="mt-3 overflow-auto max-h-80">
              <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-white/10">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Recipe</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Qty</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/70 dark:bg-gray-900/40 divide-y divide-gray-100 dark:divide-white/10">
                  {recipesForShoppingList.map((recipe, index) => (
                    <tr key={index} className="hover:bg-gray-50/80 dark:hover:bg-white/10">
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{recipe.title}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{recipe.quantity}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleAddQuantity(recipe._id)} className="px-2.5 py-1.5 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-semibold">+1</button>
                          <button onClick={() => handleSubQuantity(recipe._id)} className="px-2.5 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 text-xs font-semibold">-1</button>
                          <button onClick={() => handleRemoveRecipe(recipe._id)} className="px-2.5 py-1.5 rounded-md bg-rose-500 text-white hover:bg-rose-600 text-xs font-semibold">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Shopping List */}
          <motion.div
            variants={card}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl bg-white/80 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-6"
          >
            <h3 className="text-lg font-extrabold text-gray-800 dark:text-gray-100">Shopping List</h3>
            <div className="mt-3 overflow-auto max-h-80">
              <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-white/10">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Ingredient</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Unit</th>
                  </tr>
                </thead>
                <tbody className="bg-white/70 dark:bg-gray-900/40 divide-y divide-gray-100 dark:divide-white/10">
                  {combinedShoppingList.map(({ name, quantity, unit }, index) => (
                    <tr key={index} className="hover:bg-gray-50/80 dark:hover:bg-white/10">
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{name}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{quantity}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingSection;
