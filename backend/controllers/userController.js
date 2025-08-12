const User = require("../models/UserModel");
const Recipe = require("../models/RecipesModel");

//Authenticates a user by checking their username and password. 
//It uses bcrypt to safely compare the hashed password.
// If successful, it returns the user's data, excluding the password for security reasons.
const getUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Login failed. User not found." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Login failed. Incorrect password." });
    }

    // Preparing user data to send back, excluding the password for security
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
      bio: user.bio,
      favoriteRecipes: user.favoriteRecipes,
      uploadedRecipes: user.uploadedRecipes,
      MealPlans: user.MealPlans,
      theme: user.theme,
    };
    // console.log(`User logged in: ${user}`);
    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Server error during login:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

//createUser: Creates a new user with the information provided in the request body. 
//This is where a new user's journey begins in your application.
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log(`User created: ${req.body.username}`);
    res.status(200).json(user);
  } catch (error) {
    console.log("Failed to create user:", error);
    res.status(500).json({ error: error.message });
  }
};

//Allows a user to add a recipe to their list of favorites.
// It checks if the recipe ID already exists in the user's favorites to avoid duplicates.
const addFavorite = async (req, res) => {
  const { recipeId, userId } = req.body;
  // console.log(`Adding recipe ${recipeId} to favorites for user ${userId}`);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Add the recipeId to the favoriteRecipes array if it's not already included
    if (!user.favoriteRecipes.includes(recipeId)) {
      user.favoriteRecipes.push(recipeId);
      await user.save();
    }
    res.status(200).send("Recipe added to favorites successfully");
  } catch (error) {
    console.error("Error adding favorite recipe:", error);
    res.status(500).send("Internal server error");
  }
};

//Removes a recipe from a user's favorites list. 
//It filters out the specified recipe ID from the user's favorite recipes.
const removeFavorite = async (req, res) => {
  const { recipeId, userId } = req.query;
  // console.log(`Removing recipe ${recipeId} from favorites for user ${userId}`);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.favoriteRecipes = user.favoriteRecipes.filter((id) => id !== recipeId);
    await user.save();
    res.status(200).send("Recipe removed from favorites successfully");
  } catch (error) {
    console.error("Error removing favorite recipe:", error);
    res.status(500).send("Internal server error");
  }
};

//Updates the biography information of a user's profile.
// This lets users personalize their profiles with a bio.
const bioUpdate = async (req, res) => {
  const { userId, bio } = req.body;
  console.log(`Updating bio for user ${userId}`);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.bio = bio;
    await user.save();
    res.status(200).send("Bio updated successfully");
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).send("Internal server error");
  }
};

//Allows users to change their profile theme. 
//This could be a way for users to customize the look of their profile or app interface.
const themeUpdate = async (req, res) => {
  const { userId, theme } = req.body;
  console.log(`Updating theme for user ${userId}`);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.theme = theme;
    await user.save();
    res.status(200).send("theme updated successfully");
  } catch (error) {
    console.error("Error updating theme:", error);
    res.status(500).send("Internal server error");
  }
};

//Adds a newly shared recipe to the user's list of uploaded recipes.
// This function is crucial for users who are active in contributing content to your platform.
const addUploadedRecipe = async (req, res) => {
  const { userId, recipeId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.uploadedRecipes.push(recipeId);
    await user.save();
    res.status(200).send("All guchi.");
  } catch (error) {
    res.status(500).send("Something went wrong, server side.");
  }
};

//Updates the profile image URL of a user. 
//This function supports personalization, letting users choose how they present themselves on the platform.
const changeProflieImage = async (req, res) => {
  const { userId, profileImageUrl } = req.body;
  console.log(`Updating profileImageUrl for user ${userId}`);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.profileImageUrl = profileImageUrl;
    await user.save();
    res.status(200).send("profileImageUrl updated successfully");
  } catch (error) {
    console.error("Error updating profileImageUrl:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  createUser,
  getUser,
  addFavorite,
  removeFavorite,
  addUploadedRecipe,
  bioUpdate,
  themeUpdate,
  changeProflieImage,
};
