// Importing the Express framework to create and manage routes.
const express = require('express');

// Destructuring to import recipe-related functions from the recipe controller.
// These functions handle creating, retrieving, updating, and deleting recipes.
const {
  getRecipe,
  getRecipes,
  shareRecipe,
  deleteRecipe,
  updateRecipe,
} = require("../controllers/recipeController");

// Initializing Express router to define routes for recipe operations.
const router = express.Router();

// Route to get all recipes.
// This doesn't require any parameters and returns a list of all recipes.
router.get('/', getRecipes);

// Route to get a single recipe by its ID.
// The ':id' in the URL is a dynamic parameter that represents the recipe's ID.
router.get('/findone/:id', getRecipe);

// Route to share (post) a new recipe.
// Data for the new recipe should be included in the request body.
router.post("/share", shareRecipe);

// Route to update an existing recipe.
// This requires the recipe's ID as a URL parameter and the updated data in the request body.
router.patch('/:id',updateRecipe);

// Route to delete an existing recipe.
// This requires only the recipe's ID as a URL parameter.
router.delete('/:id', deleteRecipe);

// Exporting the router so it can be used in the main server file.
// This modularizes the routes, keeping the codebase clean and organized.
module.exports = router;
