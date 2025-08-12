// routes/ingredientRoutes.js

// Hey there! First, we're pulling in express because it's the backbone of our routing.
const express = require('express');
// Now, we're getting our ingredientController. This bad boy handles all the ingredient logic.
const ingredientController = require('../controllers/ingredientController');

// Let's get our router ready to go. Think of it as our little command center for ingredient routes.
const router = express.Router();

// Got a specific ingredient in mind? Hit up this route.
// Just toss the ingredient's name into the URL, and boom - you'll get all the info on it.
router.get('/:name/information', ingredientController.getIngredientInfoByName);

// And that's it! We're exporting the router so our app can use these routes to make magic happen.
module.exports = router;
