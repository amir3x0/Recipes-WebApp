// First off, we're bringing in Express because it's awesome for handling HTTP stuff.
const express = require("express");
// Next, we grab some cool functions from our mealController. It's like the brain for our meal routes.
const { createMeal , getMeal } = require("../controllers/mealController");

// Here we initialize our router. Think of it as a mini-app for all our meal-related adventures.
const router = express.Router();

// Want to grab a meal by its ID? This route's got you. Just pass the ID in the URL.
router.get("/loadmeal/:id", getMeal);
 
// Here's where the magic happens. Post a new meal, and this route takes care of saving it.
router.post("/savemeal", createMeal);

// Lastly, we export the router so our main app knows about these routes and can use them.
module.exports = router;
