import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { addFavoriteRecipe , removeFavoriteRecipe } from "../services/BackendService";
import { useUser } from "../context/UserContext";

const RecipeCard = ({
  recipe,
  isExpanded,
  onClick,
  onSelect,
  showSelectButton,
  showAddIngredientsButton, 
  onAddIngredients, 
}) => {
  const { user, updateUser } = useUser();
  const isLiked = user?.favoriteRecipes?.includes(recipe._id) || false; 
  const [liked, setLiked] = useState(isLiked);

  const handleLike = async () => {
    if (liked) {
      const success = await removeFavoriteRecipe(recipe._id, user._id);
      if (success) {
        const updatedFavorites = user.favoriteRecipes.filter(id => id !== recipe._id);
        updateUser({ favoriteRecipes: updatedFavorites });
        setLiked(false);
      } else {
        console.error("Failed to remove from favorites");
      }
    } else {
      const success = await addFavoriteRecipe(recipe._id, user._id);
      if (success) {
        updateUser({ favoriteRecipes: [...user.favoriteRecipes, recipe._id] });
        setLiked(true);
      } else {
        console.error("Failed to add to favorites");
        setLiked(false);
      }
    }
  };
  
  const handleAddIngredientsClick = () => {
    onAddIngredients(recipe.ingredients);
  };

  return (
    <div
    className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer ${
      isExpanded ? "scale-105" : "scale-100"
    }`}
    onClick={onClick}
  >
    <img
      src={recipe.picture}
      alt={recipe.title}
      className="w-full h-48 object-cover"
    />
    <div className={`p-4 ${isExpanded ? "px-8 py-6" : "px-4 py-4"} dark:bg-gray-800`}>
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{recipe.title}</p>
        {user && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            {liked ? <FaHeart color="red" /> : <FaRegHeart color="grey" />}
          </button>
        )}
      </div>
      {isExpanded && (
        <>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{recipe.description}</p>
          <div className="mt-4">
            <ul className="list-disc list-inside">
              <p className="text-sm font-semibold dark:text-gray-200">Steps:</p>
              {recipe.instructions.map((step, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                  {step}
                </li>
              ))}
            </ul>
            <p className="text-sm mt-2 dark:text-gray-200">
              <span className="font-semibold">Difficulty:</span> {recipe.difficulty}
            </p>
            <div className="mt-2">
              <p className="text-sm font-semibold dark:text-gray-200">Ingredients:</p>
              <ul className="list-disc list-inside">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >{`${ingredient.name} - ${ingredient.quantity} ${ingredient.unit}`}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <p className="text-sm dark:text-gray-200">
                <span className="font-semibold">Calories:</span> {recipe.calories.total} kcal
              </p>
              <p className="text-sm dark:text-gray-200">
                <span className="font-semibold">Protein:</span> {recipe.calories.protein} g
              </p>
              <p className="text-sm dark:text-gray-200">
                <span className="font-semibold">Carbs:</span> {recipe.calories.carbs} g
              </p>
              <p className="text-sm dark:text-gray-200">
                <span className="font-semibold">Fat:</span> {recipe.calories.fat} g
              </p>
            </div>
          </div>
          {/* Conditional buttons */}
          {showSelectButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(recipe._id);
              }}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-600 dark:hover:bg-blue-800"
            >
              Select
            </button>
          )}
          {showAddIngredientsButton && (
            <button
              onClick={handleAddIngredientsClick}
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded dark:bg-green-600 dark:hover:bg-green-800"
            >
              Add Ingredients
            </button>
          )}
        </>
      )}
    </div>
  </div>
  
  );
};

export default RecipeCard;
