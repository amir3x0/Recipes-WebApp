import React, { useMemo, useState } from "react";
import RecipeCard from "./RecipeCard";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { FaUtensils, FaFire } from "react-icons/fa";

// MealCard component is designed to display information about a meal,
// including a visual collage of recipes and an option to expand for more details.
const MealCard = ({ meal, onExpandChange }) => {
  // State to manage whether the meal details are expanded or not.
  const [isExpanded, setIsExpanded] = useState(false);

  // Derived meta
  const recipeCount = Array.isArray(meal?.recipes) ? meal.recipes.length : 0;
  const totalCalories = useMemo(
    () =>
      Array.isArray(meal?.recipes)
        ? meal.recipes.reduce((sum, r) => sum + (r?.calories?.total || 0), 0)
        : 0,
    [meal?.recipes]
  );
  const categories = useMemo(() => {
    if (!Array.isArray(meal?.recipes)) return [];
    const set = new Set(
      meal.recipes
        .map((r) => r?.category)
        .filter((c) => typeof c === "string" && c.trim().length > 0)
    );
    return Array.from(set);
  }, [meal?.recipes]);

  // Function to generate a collage of recipe images. Shows up to 4 images,
  // and adjusts image size based on the total number of images.
  const renderCollage = () => {
    const pics = (meal?.recipes || [])
      .map((r) => ({ src: r?.picture, title: r?.title }))
      .filter((p) => !!p.src);

    if (pics.length === 0) {
      return (
        <div
          className="h-48 md:h-56 w-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
          onClick={toggleExpand}
        />
      );
    }

    // Grid collage layout: large tile + two small tiles; show +N overlay if more.
    const moreCount = Math.max(0, pics.length - 3);

    return (
      <div
        className="relative grid grid-cols-3 grid-rows-2 gap-1 h-48 md:h-56 rounded-xl overflow-hidden cursor-pointer"
        onClick={toggleExpand}
      >
        {/* Big tile */}
        <div className="col-span-2 row-span-2 relative">
          <img
            src={pics[0].src}
            alt={pics[0].title || "Meal image"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent pointer-events-none" />
        </div>
        {/* Small tiles */}
        {pics[1] && (
          <div className="col-start-3 row-start-1 relative">
            <img src={pics[1].src} alt={pics[1].title || ""} className="w-full h-full object-cover" />
          </div>
        )}
        {pics[2] && (
          <div className="col-start-3 row-start-2 relative">
            <img src={pics[2].src} alt={pics[2].title || ""} className="w-full h-full object-cover" />
            {moreCount > 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-gray-900 ring-1 ring-black/5">
                  +{moreCount}
                </span>
              </div>
            )}
          </div>
        )}
        {/* Tap overlay hint */}
        <div className="absolute bottom-1 left-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-white/80 dark:bg-gray-900/80 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 text-gray-800 dark:text-gray-200">
          Tap to {isExpanded ? "collapse" : "expand"}
        </div>
      </div>
    );
  };

  // Function to toggle the expanded state of the meal card.
  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpandChange(meal._id, newExpandedState); // Callback for parent component.
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.004 }}
      animate={{ scale: isExpanded ? 1.01 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`group rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ${
        isExpanded ? "p-5 outline outline-2 outline-emerald-400/40" : "p-4"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent truncate">
            {meal.name}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 text-gray-800 dark:text-gray-200">
              <FaUtensils /> {recipeCount} recipes
            </span>
            {totalCalories > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 ring-1 ring-orange-200/50">
                <FaFire /> {Math.round(totalCalories)} kcal
              </span>
            )}
            {categories.slice(0, 2).map((c) => (
              <span key={c} className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-fuchsia-400/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30">
                {c}
              </span>
            ))}
            {categories.length > 2 && (
              <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 text-gray-600 dark:text-gray-300">
                +{categories.length - 2} more
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={toggleExpand}
          className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition"
          aria-label={isExpanded ? "Collapse meal" : "Expand meal"}
        >
          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
            <FiChevronDown />
          </motion.span>
        </button>
      </div>

      {/* Collage */}
      {!isExpanded && (
        <div className="mb-3">
          {renderCollage()}
        </div>
      )}

      {/* Recipe chips (collapsed) */}
      {!isExpanded && Array.isArray(meal.recipes) && meal.recipes.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {meal.recipes.slice(0, 4).map((recipe) => (
              <span key={recipe._id} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 ring-1 ring-rose-200/60">
                {recipe.title}
              </span>
            ))}
            {meal.recipes.length > 4 && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 ring-1 ring-black/5 dark:ring-white/10">
                +{meal.recipes.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10"
          >
            <div className="space-y-4 w-full">
              {meal.recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  isExpanded={true}
                  showSelectButton={false}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MealCard;
