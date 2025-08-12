import React, { useState } from "react";
import RecipeCard from "./RecipeCard";

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
    <div
      onClick={toggleExpand} // Allows toggling expand/collapse on click.
      className={`meal-card border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-gray-800/50 hover:shadow-xl dark:hover:shadow-gray-700/50 transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? "p-8 w-full" : "p-4"
      } cursor-pointer dark:bg-gray-900 dark:text-gray-200`} // Styling adjusts based on theme and expansion state.
    >
      <h2 className="text-2xl font-extrabold mb-6 text-green-800 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors duration-200 ease-in-out cursor-pointer">{meal.name}</h2>
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
            <ul className="list-disc pl-5 space-y-1">
              {meal.recipes.map((recipe) => (
                <li key={recipe._id} className="dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 ease-in-out">{recipe.title}</li> // List out recipe titles as a quick reference.
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default MealCard;
