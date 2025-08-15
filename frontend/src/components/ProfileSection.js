import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { FaSearch, FaThLarge, FaList, FaFilter } from "react-icons/fa";
import {
  fetchRecipeById,
  fetchMealPlansbyId,
  updateUserBio,
  updateUserTheme,
  updateUserProfileImage,
} from "../services/BackendService";
import RecipeCard from "./RecipeCard";
import MealCard from "./MealCard";
import RecipeDetailsModal from "./RecipeDetailsModal";

/**
 * Renders a modal for user settings.
 * Allows the user to update their bio, theme, and profile image.
 * Displays current user information and form fields for updates.
 * Handles changes to bio, theme, and profile image.
 * Submits updated settings when saved.
 * Closes the modal when canceled.
 * @param {boolean} isVisible - Indicates if the modal is visible.
 * @param {function} onClose - Callback function to close the modal.
 * @param {object} currentUser - Current user data.
 * @param {function} onSaveBio - Callback function to save user bio.
 * @param {function} onUpdateTheme - Callback function to update user theme.
 * @param {function} onUpdateProfileImage - Callback function to update user profile image.
 */
const SettingsModal = ({
  isVisible,
  onClose,
  currentUser,
  onSaveBio,
  onUpdateTheme,
  onUpdateProfileImage,
}) => {
  // State variables for bio, theme, and profile image
  const [bio, setBio] = useState(currentUser.bio || "");
  const [theme, setTheme] = useState(currentUser.theme || "light");
  const [profileImageUrl, setProfileImageUrl] = useState(
    currentUser.profileImageUrl || ""
  );

  useEffect(() => {
    if (currentUser) {
      setBio(currentUser.bio || "");
      setTheme(currentUser.theme || "light");
      setProfileImageUrl(currentUser.profileImageUrl || "");
    }
  }, [currentUser]);

  // Event handlers for bio, theme, and profile image changes
  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleProfileImageUrlChange = (event) =>
    setProfileImageUrl(event.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSaveBio(bio);
    await onUpdateTheme(theme);
    await onUpdateProfileImage(profileImageUrl);
    onClose();
  };

  // Render null if the modal is not visible
  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
      >
        <div className="max-w-md w-full rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur">
          <div className="p-5">
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
              Profile Settings
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="bio" className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows="4"
                  className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 dark:text-gray-300"
                  value={bio}
                  onChange={handleBioChange}
                />
              </div>

              <div>
                <label htmlFor="theme" className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Theme
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={handleThemeChange}
                  className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 dark:text-gray-300"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="ocean">Ocean</option>
                  <option value="forest">Forest</option>
                  <option value="grape">Grape</option>
                </select>
              </div>

              <div>
                <label htmlFor="profileImageUrl" className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  id="profileImageUrl"
                  className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 dark:text-gray-300"
                  value={profileImageUrl}
                  onChange={handleProfileImageUrlChange}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 text-gray-800 dark:text-gray-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow hover:shadow-md transition-shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
};

/**
 * Renders the user's profile page with their favorite recipes, uploaded recipes, and meal plans.
 * Manages user data including favorite recipes, uploaded recipes, and meal plans.
 * Displays loading status while fetching data and handles errors.
 * Allows the user to expand/collapse recipe and meal plan details.
 * Allows the user to access settings to manage their profile.
 */
export default function MyYummy() {
  const { user, setUser } = useUser();
  const [loadingStatus, setLoadingStatus] = useState("Loading");
  const [error, setError] = useState("");
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [MealPlans, setMealPlans] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [expandedMealId, setExpandedMealId] = useState(null);
  // Favorites UI controls
  const [favViewMode, setFavViewMode] = useState("grid"); // 'grid' | 'list'
  const [favSortBy, setFavSortBy] = useState("title-asc"); // 'title-asc' | 'calories-asc' | 'calories-desc' | 'ingredients-desc' | 'ingredients-asc' | 'difficulty-asc'
  const [favCategory, setFavCategory] = useState("all");
  const [favDifficulty, setFavDifficulty] = useState("all");
  const [favSearch, setFavSearch] = useState("");

  useEffect(() => {
    const initFetch = async () => {
      setLoadingStatus("Loading");
      try {
        if (user) {
          await fetchRecipes(user.favoriteRecipes, setFavoriteRecipes);
          await fetchRecipes(user.uploadedRecipes, setUploadedRecipes);
          await fetchMealPlans(user.MealPlans, setMealPlans);
          setLoadingStatus("Loaded");
        } else {
          throw new Error("User data not available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoadingStatus("Error");
      }
    };

    const fetchRecipes = async (recipeIds, setter) => {
      if (recipeIds.length > 0) {
        const recipes = await Promise.all(
          recipeIds.map((id) => fetchRecipeById(id))
        );
        setter(recipes);
      }
    };

    const fetchMealPlans = async (mealPlanIds, setter) => {
      if (mealPlanIds.length > 0) {
        const mealPlans = await Promise.all(
          mealPlanIds.map((id) => fetchMealPlansbyId(id))
        );
        setter(mealPlans);
      }
    };

    initFetch();
  }, [user]);

  const handleRecipeOpen = (recipe) => setSelectedRecipe(recipe);

  const renderRecipeCards = (recipes) => (
    <div className="max-w-screen-xl mx-auto px-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {recipes.map((recipe) => (
          <motion.div key={recipe._id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
            <RecipeCard recipe={recipe} isExpanded={false} onClick={() => handleRecipeOpen(recipe)} />
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Derived data for favorites filters/sort
  const favoriteCategories = useMemo(() => {
    const set = new Set(
      favoriteRecipes
        .map((r) => r?.category)
        .filter((c) => typeof c === "string" && c.trim().length > 0)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [favoriteRecipes]);

  const favoriteDifficulties = useMemo(() => {
    const set = new Set(
      favoriteRecipes
        .map((r) => r?.difficulty)
        .filter((d) => typeof d === "string" && d.trim().length > 0)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [favoriteRecipes]);

  const displayedFavorites = useMemo(() => {
    const q = favSearch.trim().toLowerCase();
    let list = favoriteRecipes.filter((r) => {
      const title = (r?.title || "").toLowerCase();
      const matchesQuery = q === "" || title.includes(q);
      const matchesCat = favCategory === "all" || (r?.category || "") === favCategory;
      const matchesDiff = favDifficulty === "all" || (r?.difficulty || "") === favDifficulty;
      return matchesQuery && matchesCat && matchesDiff;
    });

    const getIngCount = (r) => (Array.isArray(r?.ingredients) ? r.ingredients.length : 0);
    const getCalories = (r) => Math.round(r?.calories?.total || 0);

    switch (favSortBy) {
      case "calories-asc":
        list = list.sort((a, b) => getCalories(a) - getCalories(b));
        break;
      case "calories-desc":
        list = list.sort((a, b) => getCalories(b) - getCalories(a));
        break;
      case "ingredients-asc":
        list = list.sort((a, b) => getIngCount(a) - getIngCount(b));
        break;
      case "ingredients-desc":
        list = list.sort((a, b) => getIngCount(b) - getIngCount(a));
        break;
      case "difficulty-asc":
        list = list.sort((a, b) => (a?.difficulty || "").localeCompare(b?.difficulty || ""));
        break;
      case "title-asc":
      default:
        list = list.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
        break;
    }
    return list;
  }, [favoriteRecipes, favSearch, favCategory, favDifficulty, favSortBy]);

  const renderFavoriteList = (recipes) => (
    <div className="max-w-20xl mx-auto px-4">
      <div className="space-y-3">
        {recipes.map((recipe) => {
          const calories = Math.round(recipe?.calories?.total || 0);
          const ingredientsCount = Array.isArray(recipe?.ingredients) ? recipe.ingredients.length : 0;
          return (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 ring-1 ring-black/5 dark:ring-white/10 shadow hover:shadow-md cursor-pointer"
              onClick={() => handleRecipeOpen(recipe)}
            >
              <img
                src={recipe.picture}
                alt={recipe.title}
                className="h-16 w-16 md:h-20 md:w-20 rounded-lg object-cover flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/80";
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {recipe.title}
                </h4>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                  {recipe.category && (
                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 text-gray-800 dark:text-gray-200">
                      {recipe.category}
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-fuchsia-400/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/30">
                      {recipe.difficulty}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-[11px] md:text-xs text-gray-600 dark:text-gray-300">
                <div className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 ring-1 ring-blue-200/50 inline-block">
                  {calories} kcal
                </div>
                <div className="mt-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 inline-block">
                  {ingredientsCount} ingredients
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const handleExpandChange = (mealId, isExpanded) => {
    setExpandedMealId(isExpanded ? mealId : null);
  };

  const renderMealPlans = (mealPlans) => (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {mealPlans.map((meal) => (
          <div
            key={meal._id}
              className={`meal-plan-container transition duration-300 transform hover:-translate-y-1 ${
                expandedMealId === meal._id
                  ? "md:col-span-2 lg:col-span-2 xl:col-span-3"
                  : "col-span-1"
            }`}
          >
            <MealCard meal={meal} onExpandChange={handleExpandChange} />
          </div>
        ))}
      </div>
    </div>
  );

  const toggleSettingsVisibility = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };

  /**
   * Updates the user's biography in the database and updates the user state with the new biography.
   * @param {string} newBio - The new biography to be saved.
   */
  const onSaveBio = async (newBio) => {
    setLoadingStatus("Updating Bio");
    try {
      await updateUserBio(user._id, newBio); // Update user's bio in the database
      // Update user state with the new biography
      setUser((currentUser) => ({
        ...currentUser,
        bio: newBio,
      }));
      setLoadingStatus("Loaded");
    } catch (error) {
      console.error("Failed to update bio:", error);
      setError("Failed to update bio. Please try again.");
      setLoadingStatus("Error");
    }
  };

  /**
   * Updates the user's theme preference in the database and updates the user state with the new theme.
   * @param {string} newTheme - The new theme preference to be saved.
   */
  const onUpdateTheme = async (newTheme) => {
    setLoadingStatus("Updating Theme");
    try {
      await updateUserTheme(user._id, newTheme); // Update user's theme preference in the database
      // Update user state with the new theme
      setUser((currentUser) => ({
        ...currentUser,
        theme: newTheme,
      }));
      setLoadingStatus("Loaded");
    } catch (error) {
      console.error("Failed to update theme:", error);
      setError("Failed to update theme. Please try again.");
      setLoadingStatus("Error");
    }
  };

  /**
   * Updates the user's profile image URL in the database and updates the user state with the new URL.
   * @param {string} newProfileImageUrl - The new profile image URL to be saved.
   */
  const onUpdateProfileImage = async (newProfileImageUrl) => {
    setLoadingStatus("Updating Profile Image");
    try {
      await updateUserProfileImage(user._id, newProfileImageUrl); // Update user's profile image URL in the database
      // Update user state with the new profile image URL
      setUser((currentUser) => ({
        ...currentUser,
        profileImageUrl: newProfileImageUrl,
      }));
      setLoadingStatus("Loaded");
    } catch (error) {
      console.error("Failed to update profile image:", error);
      setError("Failed to update profile image. Please try again.");
      setLoadingStatus("Error");
    }
  };

  if (loadingStatus === "Loading")
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10"></div>
            ))}
          </div>
        </div>
      </div>
    );
  if (loadingStatus === "Error") return <div>Error: {error}</div>;

  // Stats
  const favCount = favoriteRecipes.length;
  const upCount = uploadedRecipes.length;
  const planCount = MealPlans.length;

  return (
    <section className="relative">
  <div className="absolute inset-0 page-gradient -z-10" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={user.profileImageUrl || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="rounded-full h-28 w-28 md:h-36 md:w-36 object-cover shadow ring-2 ring-rose-300/50"
                />
                <button onClick={toggleSettingsVisibility} className="absolute -bottom-2 right-0 px-3 py-1.5 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow ring-1 ring-black/5 dark:ring-white/10">
                  Edit
                </button>
              </div>
              <h2 className="text-2xl font-extrabold mt-4 accent-text">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 max-w-md">{user.bio || "No bio available"}</p>
              <div className="mt-5 grid grid-cols-3 gap-3 w-full">
                <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-3 text-center ring-1 ring-black/5 dark:ring-white/10">
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{favCount}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Favorites</div>
                </div>
                <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-3 text-center ring-1 ring-black/5 dark:ring-white/10">
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{upCount}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Uploads</div>
                </div>
                <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-3 text-center ring-1 ring-black/5 dark:ring-white/10">
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{planCount}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Plans</div>
                </div>
              </div>
              <button
                className="mt-5 inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow hover:shadow-md transition-shadow"
                onClick={toggleSettingsVisibility}
              >
                Settings
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <h3 className="text-xl md:text-2xl font-bold accent-text">Favorite Recipes</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={favSearch}
                      onChange={(e) => setFavSearch(e.target.value)}
                      placeholder="Search favorites..."
                      className="pl-8 pr-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                  {/* Category filter */}
                  <div className="flex items-center gap-1">
                    <FaFilter className="text-gray-400" />
                    <select
                      aria-label="Filter by category"
                      value={favCategory}
                      onChange={(e) => setFavCategory(e.target.value)}
                      className="px-2 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
                    >
                      <option value="all">All Categories</option>
                      {favoriteCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  {/* Difficulty filter */}
                  <select
                    aria-label="Filter by difficulty"
                    value={favDifficulty}
                    onChange={(e) => setFavDifficulty(e.target.value)}
                    className="px-2 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
                  >
                    <option value="all">All Difficulty</option>
                    {favoriteDifficulties.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {/* Sort */}
                  <select
                    aria-label="Sort favorites"
                    value={favSortBy}
                    onChange={(e) => setFavSortBy(e.target.value)}
                    className="px-2 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
                  >
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="calories-asc">Calories (Low-High)</option>
                    <option value="calories-desc">Calories (High-Low)</option>
                    <option value="ingredients-asc">Ingredients (Few-Many)</option>
                    <option value="ingredients-desc">Ingredients (Many-Few)</option>
                    <option value="difficulty-asc">Difficulty (A-Z)</option>
                  </select>
                  {/* View toggle */}
                  <div className="inline-flex rounded-lg overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                    <button
                      type="button"
                      aria-label="Grid view"
                      onClick={() => setFavViewMode("grid")}
                      className={`px-2 py-1.5 text-sm ${favViewMode === "grid" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
                    >
                      <FaThLarge />
                    </button>
                    <button
                      type="button"
                      aria-label="List view"
                      onClick={() => setFavViewMode("list")}
                      className={`px-2 py-1.5 text-sm ${favViewMode === "list" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
                    >
                      <FaList />
                    </button>
                  </div>
                </div>
              </div>

              {displayedFavorites.length === 0 ? (
                <div className="max-w-6xl mx-auto px-4">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-6 text-center text-gray-600 dark:text-gray-300 ring-1 ring-black/5 dark:ring-white/10">
                    No favorite recipes match your filters.
                  </div>
                </div>
              ) : favViewMode === "list" ? (
                renderFavoriteList(displayedFavorites)
              ) : (
                renderRecipeCards(displayedFavorites)
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-5">
              <h3 className="text-xl md:text-2xl font-bold mb-4 accent-text">Uploaded Recipes</h3>
              {renderRecipeCards(uploadedRecipes)}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl p-5">
              <h3 className="text-xl md:text-2xl font-bold mb-4 accent-text">Meal Plans</h3>
              {renderMealPlans(MealPlans)}
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {selectedRecipe && (
            <RecipeDetailsModal
              key={selectedRecipe._id}
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
              showSelectButton={false}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSettingsVisible && (
            <SettingsModal
              isVisible={isSettingsVisible}
              onClose={toggleSettingsVisibility}
              currentUser={user}
              onSaveBio={onSaveBio}
              onUpdateTheme={onUpdateTheme}
              onUpdateProfileImage={onUpdateProfileImage}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
