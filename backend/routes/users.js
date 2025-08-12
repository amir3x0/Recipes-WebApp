// Importing the Express framework to create our server routes.
const express = require("express");

// Destructuring and importing various user-related functions from the user controller.
// These functions handle operations like creating users, managing favorites, and updating profiles.
const {
  createUser,
  getUser,
  addFavorite,
  removeFavorite,
  addUploadedRecipe,
  bioUpdate,
  themeUpdate,
  changeProflieImage,
} = require("../controllers/userController");

// Importing the authentication middleware which is used to verify if a user is logged in.
const verifyToken = require("../middlewares/authmiddleware");

// Commented out code: possibly for adding favorite recipes. Might be used in future development.
// const { addfavoriteRecipe } = require("../../frontend/src/services/BackendService");

// Creating a new router object to define routes.
const router = express.Router();

// Define routes below:

// Public route: Login does not require authentication.
// This route uses the getUser function to log in a user.
router.post("/login", getUser);

// Public route: Creating a new user also does not require authentication.
// Uses the createUser function to add a new user to the database.
router.post("/", createUser);

// Route for adding a recipe to a user's favorites. Requires user to be authenticated.
router.post("/favorite", addFavorite);

// Route for removing a recipe from a user's favorites. Requires user to be authenticated.
router.delete("/deletefavorite", removeFavorite);

// Route for updating the bio information of a user's profile. Requires user to be authenticated.
router.post("/bio", bioUpdate);

// Route for updating the theme preferences of a user's profile. Requires user to be authenticated.
router.post("/theme", themeUpdate);

// Route for users to add recipes they have uploaded. Requires user to be authenticated.
router.post("/updateShare", addUploadedRecipe);

// Route for changing a user's profile image. Requires user to be authenticated.
router.post("/profileimage", changeProflieImage);

// Export the router so it can be used by other parts of the application.
module.exports = router;
