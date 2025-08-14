import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
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
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur cursor-pointer ${
        isExpanded ? "outline outline-2 outline-rose-400/40" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={recipe.picture}
          alt={recipe.title}
          className="w-full h-44 md:h-48 object-cover"
        />
        {user && (
          <button
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-2 py-1 rounded-full shadow ring-1 ring-black/5 dark:ring-white/10"
          >
            {liked ? <FaHeart className="text-rose-500" /> : <FaRegHeart className="text-gray-500" />}
          </button>
        )}
      </div>
      <div className={`p-4 ${isExpanded ? "pt-5" : "pt-4"}`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
            {recipe.title}
          </h3>
          <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-amber-400/20 to-fuchsia-400/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30">
            {recipe.difficulty}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-gray-700 dark:text-gray-300">{recipe.description}</p>

            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 mb-1">Steps</p>
              <ul className="list-disc list-inside space-y-1">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 mb-1">Ingredients</p>
                <ul className="list-disc list-inside space-y-1">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      {`${ingredient.name} - ${ingredient.quantity} ${ingredient.unit}`}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 ring-1 ring-black/5 dark:ring-white/10">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 mb-2">Nutrition</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">Cal {recipe.calories.total}</span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">Prot {recipe.calories.protein}g</span>
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">Carb {recipe.calories.carbs}g</span>
                  <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">Fat {recipe.calories.fat}g</span>
                </div>
              </div>
            </div>

            {/* Conditional buttons */}
            <div className="flex gap-2 pt-1">
              {showSelectButton && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(recipe._id);
                  }}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow hover:shadow-md transition-shadow"
                >
                  Select
                </button>
              )}
              {showAddIngredientsButton && (
                <button
                  onClick={handleAddIngredientsClick}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow"
                >
                  Add Ingredients
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default RecipeCard;
