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

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const calories = recipe?.calories || { total: 0, protein: 0, carbs: 0, fat: 0 };
  const ingredientsCount = Array.isArray(recipe?.ingredients) ? recipe.ingredients.length : 0;
  const category = recipe?.category;

  const onKeyActivate = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(e);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`group rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur cursor-pointer ${
        isExpanded ? "outline outline-2 outline-rose-400/40" : ""
      } ${liked ? "ring-rose-300/50" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-expanded={!!isExpanded}
      onKeyDown={onKeyActivate}
    >
      <div className="relative overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-44 md:h-48 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}
        {!imageError && (
          <img
            src={recipe.picture}
            alt={recipe.title}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-44 md:h-48 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {/* Top overlays */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          {category && (
            <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-white/80 dark:bg-gray-900/80 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 text-gray-800 dark:text-gray-200">
              {category}
            </span>
          )}
          <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-amber-400/20 to-fuchsia-400/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30">
            {recipe.difficulty}
          </span>
        </div>
        {user && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-2 py-1 rounded-full shadow ring-1 ring-black/5 dark:ring-white/10"
          >
            {liked ? <FaHeart className="text-rose-500" /> : <FaRegHeart className="text-gray-500" />}
          </motion.button>
        )}
        {/* Bottom gradient/title overlay when collapsed */}
        {!isExpanded && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
            <h3 className="text-sm md:text-base font-bold text-white drop-shadow line-clamp-1">{recipe.title}</h3>
          </div>
        )}
      </div>

      <div className={`p-4 ${isExpanded ? "pt-5" : "pt-3"}`}>
        {/* Header when expanded */}
        {isExpanded && (
          <div className="flex items-center justify-between gap-3 mb-1">
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-amber-400/20 to-fuchsia-400/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30">
                {recipe.difficulty}
              </span>
              {category && (
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 text-gray-800 dark:text-gray-200">
                  {category}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Collapsed quick stats */}
        {!isExpanded && (
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-300">
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10">{ingredientsCount} ingredients</span>
            <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 ring-1 ring-blue-200/50">{Math.round(calories.total)} kcal</span>
          </div>
        )}

        {isExpanded && (
          <div className="mt-3 space-y-3 text-sm">
            {recipe.description && (
              <p className="text-gray-700 dark:text-gray-300">{recipe.description}</p>
            )}

            {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 mb-1">Steps</p>
                <ol className="list-decimal list-inside space-y-1">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 mb-1">Ingredients</p>
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        {`${ingredient.name} - ${ingredient.quantity} ${ingredient.unit}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-xs">No ingredients listed.</p>
                )}
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 ring-1 ring-black/5 dark:ring-white/10">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 mb-2">Nutrition</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">Cal {Math.round(calories.total)}</span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">Prot {Math.round(calories.protein)}g</span>
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">Carb {Math.round(calories.carbs)}g</span>
                  <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">Fat {Math.round(calories.fat)}g</span>
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
