// First things first, we need mongoose for its magical database powers.
const mongoose = require('mongoose');

// Grabbing Schema from mongoose to craft our data models with precision.
const { Schema } = mongoose;

// Let's set up some enums for our recipe difficulties and categories to keep things tidy.
const difficultyEnum = ['Easy', 'Intermediate', 'Hard', 'Chef Level'];
const categoryEnum = ['Appetizers', 'Starters', 'Main Dish', 'Dessert'];

// Crafting our recipeSchema: a blueprint for all recipes in our database.
const recipeSchema = new Schema({
  title: {
    type: String,
    required: true, // Every recipe needs a title, no exceptions.
  },
  difficulty: {
    type: String,
    enum: difficultyEnum, // This makes sure the difficulty level is one we recognize.
    required: true,
  },
  category: {
    type: String,
    enum: categoryEnum, // Same as difficulty, but for recipe categories.
    required: true,
  },
  description: {
    type: String,
    required: true, // A brief intro or summary of the recipe.
  },
  instructions: {
    type: [String], // An array of steps because cooking is a journey.
    required: true,
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true, // What's a recipe without ingredients?
      },
      quantity: {
        type: Number, // How much of an ingredient
        required: true,
      },
      unit: {
        type: String, // Unit of measure, like cups or grams
        required: true,
      },
    },
  ],
  calories: {
    total: {
      type: Number, // Keeping an eye on those calories
      required: true,
    },
    protein: {
      type: Number, // Gotta get that protein
      required: true,
    },
    carbs: {
    type: Number, // Carbs are important too
      required: true,
    },
    fat: {
      type: Number, // And let's not forget about fats
      required: true,
    },
  },
  picture: {
    type: String,
    required: true, // A picture is worth a thousand words, especially for recipes.
  },
  Chef: {
    type: String,
    required: false, // Not all recipes have a chef's name attached, and that's okay.
  },
}, { timestamps: true }); // Adding timestamps for creation and updates automatically.

// Creating a Recipe model from our schema to interact with the 'Recipes' collection.
const Recipe = mongoose.model('Recipe', recipeSchema);

// Exporting the Recipe model to be used across our app.
module.exports = Recipe;
