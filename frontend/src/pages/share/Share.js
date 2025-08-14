import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../../context/UserContext";
import { shareRecipe, updateUserUploadedRecipes } from "../../services/BackendService";

const Share = () => {
  document.title = "Share Recipe";
  const apiKey = "99ef18d154da4865a3a651236819f073"; // 89b5d3e465a34953a553dabc2168d109
  const { user, updateUser } = useUser();
  const [shareMsg, setShareMsg] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
  const [mealCategory, setMealCategory] = useState("");
  const [instructions, setInstructions] = useState([""]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // To store API search results
  const [selectedIngredients, setSelectedIngredients] = useState([]); // To store user-selected ingredients with details
  const [totalNutrition, setTotalNutrition] = useState({
    total: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const fetchIngredients = async (query) => {
    const url = `https://api.spoonacular.com/food/ingredients/search?query=${query}&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    fetchIngredients(query);
  };

  const addIngredient = async (ingredient) => {
    if (!selectedIngredients.some((item) => item.id === ingredient.id)) {
      // Fetch detailed information including possibleUnits for the selected ingredient
      const detailedInfo = await fetchIngredientDetails(ingredient.id);
      if (detailedInfo) {
        setSelectedIngredients((prev) => [
          ...prev,
          {
            id: ingredient.id,
            name: ingredient.name,
            quantity: "",
            unit: detailedInfo.possibleUnits[0], // Use the first unit as default
            possibleUnits: detailedInfo.possibleUnits,
          },
        ]);
      }
    }
  };

  const updateNutritionForSelectedIngredient = async (
    ingredientIndex,
    newAmount,
    newUnit
  ) => {
    const ingredient = selectedIngredients[ingredientIndex];
    const apiUrl = `https://api.spoonacular.com/food/ingredients/${ingredient.id}/information?amount=${newAmount}&unit=${newUnit}&apiKey=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (response.ok) {
        const updatedNutrition = extractNutritionData(data);

        // Update the selected ingredient with new nutrition details
        const updatedIngredients = selectedIngredients.map((item, index) => {
          if (index === ingredientIndex) {
            return {
              ...item,
              nutrition: updatedNutrition,
              quantity: newAmount,
              unit: newUnit,
            };
          }
          return item;
        });

        setSelectedIngredients(updatedIngredients);
        calculateTotalNutrition(updatedIngredients);
      } else {
        throw new Error("Failed to fetch updated nutrition information");
      }
    } catch (error) {
      console.error("Error updating ingredient nutrition:", error);
    }
  };

  const calculateTotalNutrition = (ingredients) => {
    const totalNutrition = ingredients.reduce((acc, ingredient) => {
      Object.keys(ingredient.nutrition).forEach((key) => {
        acc[key] =
          (acc[key] || 0) +
          ingredient.nutrition[key] * parseFloat(ingredient.quantity);
      });
      return acc;
    }, {});

    setTotalNutrition(totalNutrition);
  };

  // Extract nutrition data from API response
  const extractNutritionData = (data) => {
    const nutrients = data.nutrition.nutrients;
    return {
      total: nutrients.find((n) => n.name === "Calories")?.amount || 0,
      protein: nutrients.find((n) => n.name === "Protein")?.amount || 0,
      carbs: nutrients.find((n) => n.name === "Carbohydrates")?.amount || 0,
      fat: nutrients.find((n) => n.name === "Fat")?.amount || 0,
    };
  };

  const fetchIngredientDetails = async (ingredientId) => {
    const url = `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?apiKey=${apiKey}&amount=1`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Failed to fetch ingredient details");
      }
    } catch (error) {
      console.error("Error fetching ingredient details:", error);
      return null;
    }
  };

  const updateSelectedIngredient = async (index, field, value) => {
    let updatedIngredients = [...selectedIngredients];
    let ingredientToUpdate = updatedIngredients[index];

    ingredientToUpdate[field] = value || 0;
    updatedIngredients[index] = ingredientToUpdate;

    // Update state immediately for UI reactivity
    setSelectedIngredients(updatedIngredients);

    // If the field updated is quantity or unit, re-fetch and update nutrition info
    if (field === "quantity" || field === "unit") {
      // This is where the conversion to grams should happen if you're targeting consistency in grams
      // Since we're assuming all nutritional info is based on grams, ensure conversion is handled here or in the API call
      await updateNutritionForSelectedIngredient(
        index,
        ingredientToUpdate.quantity,
        ingredientToUpdate.unit
      );
    }
  };

  // const calculateTotalNutrition = () => {
  //   const totals = selectedIngredients.reduce(
  //     (acc, item) => {
  //       const quantityFactor = parseFloat(item.quantity) || 0; // Convert to number and handle non-numeric inputs gracefully
  //       acc.total += item.total * quantityFactor;
  //       acc.protein += item.protein * quantityFactor;
  //       acc.carbs += item.carbs * quantityFactor;
  //       acc.fat += item.fat * quantityFactor;
  //       return acc;
  //     },
  //     { total: 0, protein: 0, carbs: 0, fat: 0 }
  //   );
  //   setTotalNutrition(totals); // Update the state with the new totals
  // };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]); // Add an empty string for the new step
  };

  const handleDeleteInstruction = (index) => {
    setInstructions(instructions.filter((_, idx) => idx !== index));
  };

  const updateInstruction = (index, value) => {
    const updatedInstructions = instructions.map((instruction, idx) =>
      idx === index ? value : instruction
    );
    setInstructions(updatedInstructions);
  };

  const handleMealCategoryChange = (e) => {
    setMealCategory(e.target.value);
  };

  const removeSelectedIngredient = (index) => {
    setSelectedIngredients(
      selectedIngredients.filter((_, idx) => idx !== index)
    );
  };

  // Removed unused placeholder calories object

  const handleShare = async () => {
    const ingredientsForShare = selectedIngredients.map((ingredient) => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    }));

    const recipeData = {
      title: recipeName,
      difficulty: difficulty,
      category: mealCategory,
      description: description,
      instructions: instructions,
      ingredients: ingredientsForShare,
      calories: totalNutrition,
      picture: imageUrl,
      Chef: user.username,
    };
    const res = await shareRecipe(recipeData);
    if (res && res.recipe) {
      // Updating the uploaded recipes list
      updateUser({
        uploadedRecipes: [...user.uploadedRecipes, res.recipe._id],
      });
      const updateRes = await updateUserUploadedRecipes(
        user._id,
        res.recipe._id
      );
      if (updateRes) {
        // Reseting the form.
        setDescription("");
        setDifficulty("");
        setImageUrl("");
        setSelectedIngredients([]);
        setInstructions([""]);
        setMealCategory("");
        setRecipeName("");
        setSearchTerm("");
        setSearchResults([]);
        setTotalNutrition({ total: 0, protein: 0, carbs: 0, fat: 0 });

        // Setting the message to show.
        setShareMsg("Your Recipe Published Successfully !");
      } else {
        setShareMsg("Couldnt Change Database !");
      }
    } else {
      setShareMsg("Something Went Wrong !");
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent mb-6"
      >
        Share Your Recipe
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="md:col-span-2 rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-4 flex flex-col md:flex-row items-center"
        >
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 dark:text-gray-300"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="inline-block md:ml-4 mt-4 md:mt-0 w-24 h-24 object-cover rounded-xl ring-1 ring-black/5 dark:ring-white/10"
            />
          )}
        </motion.div>

        {/* Recipe Name */}
        <div className="mb-5 rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-4">
          <label
            htmlFor="recipeName"
            className="block text-gray-700 dark:text-gray-300 text-base font-bold mb-2"
          >
            Recipe Name
          </label>
          <input
            type="text"
            id="recipeName"
            name="recipeName"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="Enter your recipe name"
            className="form-input mt-1 block w-full py-2 px-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Difficulty */}
    <div className="mb-5 rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-4">
          <label
      htmlFor="difficulty"
      className="block text-gray-700 dark:text-gray-300 text-base font-bold mb-2"
          >
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="form-select mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Hard">Hard</option>
            <option value="Chef Level">Chef Level</option>
          </select>
        </div>

        {/* Category */}
        <div className="col-span-1 md:col-span-2 rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-4">
          <label className="block text-gray-700 dark:text-gray-300 text-base font-bold mb-2">
            Meal Category
          </label>
          <select
            id="mealCategory"
            value={mealCategory}
            onChange={handleMealCategoryChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Meal Category</option>
            <option value="Appetizers">Appetizers</option>
            <option value="Starters">Starters</option>
            <option value="Main Dish">Main Course</option>
            <option value="Dessert">Desserts</option>
          </select>
        </div>

        {/* Description */}
    <div className="col-span-1 md:col-span-2 rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-4">
          <label
            htmlFor="description"
      className="block text-gray-700 dark:text-gray-300 text-base font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        {/* Instructions */}
        <div className="col-span-1 md:col-span-2 rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-4">
          <label className="block text-gray-700 dark:text-gray-300 text-base font-bold mb-2">
            Instructions
          </label>
          {instructions.map((instruction, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                onClick={() => handleDeleteInstruction(index)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-center">
            <button
              onClick={handleAddInstruction}
              className="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow"
            >
              Add Step
            </button>
          </div>
        </div>

        {/* Ingredient Search */}
        <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-4">
          <p className="font-semibold text-base text-gray-700 dark:text-gray-300 mb-3">
            Search Ingredients
          </p>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
          />
          <ul className="list-none">
            {searchResults &&
              searchResults.map((ingredient) => (
                <li
                  key={ingredient.id}
                  onClick={() => addIngredient(ingredient)}
                  className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition duration-150 ease-in-out"
                >
                  {ingredient.name}
                </li>
              ))}
          </ul>
        </div>

        {/* Selected Ingredients */}
        <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-4">
          <p className="font-semibold text-base mb-3 text-gray-700 dark:text-gray-300">
            Selected Ingredients
          </p>
          {selectedIngredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 mb-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-md dark:shadow-sm transition ease-in-out duration-150"
            >
              <span className="flex-grow text-gray-900 dark:text-gray-200">
                {ingredient.name}
              </span>
              <input
                type="number"
                placeholder="Quantity"
                value={ingredient.quantity}
                className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                onChange={(e) =>
                  updateSelectedIngredient(index, "quantity", e.target.value)
                }
              />
              <select
                className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300"
                value={ingredient.unit}
                onChange={(e) =>
                  updateSelectedIngredient(index, "unit", e.target.value)
                }
              >
                {ingredient.possibleUnits?.map((unit, unitIndex) => (
                  <option key={unitIndex} value={unit}>
                    {unit}
                  </option>
                )) || (
                  <option
                    value="unit"
                    className="dark:bg-gray-700 dark:text-gray-300"
                  >
                    Unit
                  </option>
                )}
              </select>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded-lg text-sm transition duration-150 ease-in-out"
                onClick={() => removeSelectedIngredient(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nutritional Info */}
      <div className="flex justify-center mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center text-center w-full md:w-auto">
          <div className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-lg shadow text-sm">
            Total Calories: {totalNutrition.total.toFixed(2)} kcal
          </div>
          <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1.5 rounded-lg shadow text-sm">
            Total Protein: {totalNutrition.protein.toFixed(2)} g
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-1.5 rounded-lg shadow text-sm">
            Total Carbs: {totalNutrition.carbs.toFixed(2)} g
          </div>
          <div className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1.5 rounded-lg shadow text-sm">
            Total Fat: {totalNutrition.fat.toFixed(2)} g
          </div>
        </div>
      </div>

      {/* Share Button */}
    <div className="flex justify-center mt-5 text-lg border-t-2 pt-5 dark:border-gray-700">
        <button
          onClick={handleShare}
          className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow hover:shadow-md transition-shadow"
        >
          Share
        </button>
      </div>

      {/* Message upon success or failure. */}
      {shareMsg && (
        <div
          className={`text-center font-semibold text-lg dark:text-gray-300 px-4 py-2 my-3 rounded-md shadow ${
            shareMsg.includes("Successful") ? "text-green-700 bg-green-50 dark:bg-green-900/40" : "text-rose-600 bg-rose-50 dark:bg-rose-900/40"
          }`}
        >
          {shareMsg}
        </div>
      )}
    </section>
  );
};

export default Share;
