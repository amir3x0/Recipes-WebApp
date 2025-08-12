// First up, we're requiring mongoose - our go-to ODM for MongoDB. It helps us manage relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.
const mongoose = require("mongoose");
// We're pulling in our User, Recipe, and Meal models. These are our blueprints for how users, recipes, and meals are structured in our database.
const User = require("../models/UserModel");
const Recipe = require("../models/RecipesModel");
const Meal = require("../models/MealModel");

// getMeal is an async function that fetches a specific meal by its ID.
const getMeal = async (req, res) => {
  const { id } = req.params; // Grabbing the ID from the URL parameters.
  try {
    // First, we check if the provided ID is a valid MongoDB ObjectId. If not, we return a 404 error saying "No such meal".
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such meal" });
    }
    // If the ID is valid, we attempt to find the meal by its ID in the database.
    const meal = await Meal.findById(id);
    // If no meal is found with that ID, we also return a 404 error.
    if (!meal) {
      return res.status(404).json({ error: "No such meal" });
    }

    // Assuming each meal contains an array of recipe IDs, we fetch the full recipe details for each ID.
    const recipes = await Promise.all(
      meal.recipes.map(
        (recipeId) => Recipe.findById(recipeId) // Fetch each recipe using its ID.
      )
    );

    // We then prepare the meal object to include the detailed recipe objects, filtering out any that couldn't be found.
    const mealWithRecipes = {
      ...meal.toObject(), // Convert the Mongoose document to a plain JavaScript object
      recipes: recipes.filter((recipe) => recipe !== null), // Exclude any null results from failed fetches
    };

    // Send back the enriched meal object to the client.
    res.status(200).json(mealWithRecipes);
  } catch (error) {
    // If there's a server error during the process, log it and return a 500 error.
    console.error(error);
    res.status(500).json({ error: "Server error fetching meal" });
  }
};

// createMeal is an async function that creates a new meal document in the database.
const createMeal = async (req, res) => {
  try {
    // Log the attempt to create a new meal.
    console.log("creating meal");
    // Create a new Meal instance with the request body data.
    const meal = new Meal(req.body);
    // Save the new meal document to the database.
    await meal.save();

    // After saving, we try to associate the meal with a user by their userId.
    console.log(req.body.userId);
    const userId = req.body.userId;
    const user = await User.findById(userId);
    // If the user is not found, return a 404 error.
    if (!user) {
      return res.status(404).send("User not found");
    }
    // If the user exists and the meal isn't already in their MealPlans array, add it.
    if (!user.MealPlans.includes(meal._id)) {
      user.MealPlans.push(meal._id);
      // Save the updated user document.
      await user.save();
    }
    // Respond with the ID of the newly created meal.
    res.status(200).json({meal_id: meal._id});
  } catch (error) {
    // Log any errors that occur during meal creation and return a 500 server error.
    console.log("Failed to create meal:", error);
    res.status(500).json({ error: error.message });
  }
};

// We make sure to export our functions so they can be used in other parts of our app.
module.exports = {
  getMeal,
  createMeal,
};
