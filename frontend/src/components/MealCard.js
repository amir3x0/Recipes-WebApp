import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import { motion } from "framer-motion";

// MealCard component is designed to display information about a meal,
// including a visual collage of recipes and an option to expand for more details.
const MealCard = ({ meal, onExpandChange }) => {
  // State to manage whether the meal details are expanded or not.
  const [isExpanded, setIsExpanded] = useState(false);

  

  // Function to generate a collage of recipe images. Shows up to 4 images,
  // and adjusts image size based on the total number of images.
  const renderCollage = () => {
    const images = meal.recipes.map((recipe, index) => (
      <img
        key={index}
        src={recipe.picture}
        alt={recipe.title}
        className={`w-full ${
          meal.recipes.length > 4 ? "h-full" : "h-2/3"
        } object-cover ${index > 3 ? "hidden" : ""}`} // Hide images beyond the 4th.
        style={{ maxHeight: "400px" }} // Ensures images don't get too large.
      />
    ));

    // Adjust grid layout based on the number of images.
    const gridTemplateColumns = {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-2",
    };

    return (
      <div
        className={`grid ${
          gridTemplateColumns[meal.recipes.length] || "grid-cols-1"
        } gap-1 cursor-pointer`}
        onClick={toggleExpand}
      >
        {images}
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
      whileHover={{ y: -3 }}
      onClick={toggleExpand}
      className={`rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur cursor-pointer ${
        isExpanded ? "p-6" : "p-4"
      }`}
    >
      <h2 className="text-xl md:text-2xl font-extrabold mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{meal.name}</h2>
      {isExpanded ? (
        <div className="space-y-4 w-full">
          {meal.recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              isExpanded={true} // Always render RecipeCard components in their expanded state here.
              showSelectButton={false} // Example prop, assuming it controls a button display within RecipeCard.
            />
          ))}
        </div>
      ) : (
        <>
          {renderCollage()} 
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {meal.recipes.map((recipe) => (
                <span key={recipe._id} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500/10 to-fuchsia-500/10 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/20">
                  {recipe.title}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MealCard;
