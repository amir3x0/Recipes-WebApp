import React, { useEffect } from "react";
import { motion } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 24 } },
  exit: { opacity: 0, y: 20, scale: 0.98 },
};

export default function RecipeDetailsModal({ recipe, onClose, showSelectButton, onSelect }) {
  const calories = recipe?.calories || { total: 0, protein: 0, carbs: 0, fat: 0 };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    // lock scroll
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = original;
    };
  }, [onClose]);

  if (!recipe) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
      >
        <div className="max-w-3xl w-full max-h-[85vh] flex flex-col rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur">
          {/* Header image */}
          <div className="relative shrink-0">
      <img src={recipe.picture} alt={recipe.title} className="w-full h-64 object-cover" />
            <button onClick={onClose} className="absolute top-3 right-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-full text-sm ring-1 ring-black/5 dark:ring-white/10">Close</button>
          </div>

          <div className="p-5 overflow-y-auto flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
        <h2 id="recipe-modal-title" className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{recipe.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{recipe.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400/20 to-fuchsia-400/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30">{recipe.difficulty}</span>
                {recipe.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 text-gray-800 dark:text-gray-200">{recipe.category}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">Ingredients</h3>
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length ? (
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i}>{`${ing.name} - ${ing.quantity} ${ing.unit}`}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No ingredients listed.</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">Steps</h3>
                {Array.isArray(recipe.instructions) && recipe.instructions.length ? (
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {recipe.instructions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No steps provided.</p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg text-center text-sm">Cal {Math.round(calories.total)}</div>
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg text-center text-sm">Prot {Math.round(calories.protein)}g</div>
              <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-lg text-center text-sm">Carb {Math.round(calories.carbs)}g</div>
              <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg text-center text-sm">Fat {Math.round(calories.fat)}g</div>
            </div>

            {showSelectButton && (
              <div className="flex justify-end gap-2 mt-6 sticky bottom-0 pt-3 bg-gradient-to-t from-white/90 to-white/0 dark:from-gray-900/90 dark:to-gray-900/0">
                <button onClick={onSelect} className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow hover:shadow-md transition-shadow">Select</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
