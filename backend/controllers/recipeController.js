// First up, we're requiring our Recipe model. This is how we'll interact with the recipes in the database.
const Recipe = require("../models/RecipesModel");
// We also need mongoose, mainly for its ObjectId type checking.
const mongoose = require("mongoose");

// This function fetches all recipes and sends them back, sorted by creation date.
const getRecipes = async (req, res) => {
  // Fetch all recipes from the database, sort them by the createdAt field in descending order.
  const recipes = await Recipe.find({}).sort({ createdAt: -1 });

  // Send the fetched recipes back to the client.
  res.status(200).json(recipes);
};

// This function fetches a single recipe by ID.
const getRecipe = async (req, res) => {
  const { id } = req.params; // Grab the recipe ID from the URL parameters.
  if (!id) {
    // If no ID is provided, just return an empty object.
    return res.status(200).json({});
  }
  try {
    // Check if the provided ID is valid. If not, let the client know.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such recipe" });
    }
    // Find the recipe by ID.
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      // If the recipe isn't found, return an empty object instead of an error.
      return res.status(200).json({});
    }
    // Send the found recipe back to the client.
    res.status(200).json(recipe);
  } catch (error) {
    // If anything goes wrong, log the error and notify the client.
    console.error(error);
    res.status(500).json({ error: "Server error fetching recipe" });
  }
};

// This function allows a user to share (create) a new recipe.
const shareRecipe = async (req, res) => {
  try {
    // Log the body of the request. It's good practice to see what's being sent to our server.
    console.log(req.body);
    // Create a new recipe instance with the request body.
    const recipe = new Recipe(req.body);
    // Save the new recipe to the database.
    await recipe.save();
    // Respond to the client that the recipe was shared successfully.
    res
      .status(200)
      .json({ message: "Recipe shared successfully!", recipe: recipe });
  } catch (error) {
    // If there's an issue, log it and respond with an error message.
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: error.message });
  }
};

// This function deletes a recipe by its ID.
const deleteRecipe = async (req, res) => {
  const { id } = req.params; // Again, grabbing the ID from the URL parameters.
  // First, check if the provided ID is valid.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such recipe" });
  }
  // Attempt to find and delete the recipe by its ID.
  const recipe = await Recipe.findOneAndDelete({ _id: id });
  // If no recipe was found to delete, let the client know.
  if (!recipe) {
    return res.status(404).json({ error: "No such recipe" });
  }
  // If the delete was successful, send the deleted recipe back to the client.
  res.status(200).json(recipe);
};
// This function updates a recipe given its ID.
const updateRecipe = async (req, res) => {
  const { id } = req.params; // Grabbing the ID from the URL.
  // Check the validity of the provided ID.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such recipe" });
  }
  // Attempt to find the recipe by ID and update it with the request body.
  const recipe = await Recipe.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  // If the recipe isn't found, inform the client.
  if (!recipe) {
    return res.status(404).json({ error: "No such recipe" });
  }
  // Send the updated recipe back to the client.
  res.status(200).json(recipe);
};

// Exporting all our functions so they can be used elsewhere in our application.
module.exports = {
  getRecipe,
  getRecipes,
  shareRecipe,
  deleteRecipe,
  updateRecipe,
};
