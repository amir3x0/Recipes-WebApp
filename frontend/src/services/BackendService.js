// First things first, we need axios. It's our handy tool for making HTTP requests.
import axios from "axios";
// Here's our base URL. Think of it as the home address for all our backend conversations.
const API_URL = "https://a6-final.onrender.com";

// Time to register a new user. It's like signing up for a cooking class.
export const registerNewUser = async (name, email, username, password) => {
  try {
    // We're sending a post request with the user's details. Simple and straight to the point.
    await axios.post(`${API_URL}/users`, { name, email, username, password });
    // If all goes well, we return true. Success!
    return true;
  } catch (error) {
    // If something goes wrong, like the email is already used, we return false.
    return false;
  }
};

// Sharing a recipe is next. This is how users contribute their favorite dishes.
export const shareRecipe = async (recipe) => {
  try {
    // We're passing the whole recipe object here. The backend takes care of the rest.
    const res = await axios.post(`${API_URL}/recipes/share`, recipe);
    // If successful, we get the data back, maybe to confirm or display something.
    return res.data;
  } catch (error) {
    // If the share fails, like missing ingredients, we return false.
    return false;
  }
};

// Here's where users can add their newly shared recipes to their profile.
export const updateUserUploadedRecipes = async (userId, recipeId) => {
  try {
    // We tell the server which user and which recipe. It's like pinning a recipe to your fridge.
    const res = await axios.post(`${API_URL}/users/updateShare`, { userId, recipeId });
    // Success! We get some data back, maybe confirmation or the updated user object.
    return res.data;
  } catch (error) {
    // If the update fails, maybe the recipe ID was wrong, we return false.
    return false;
  }
};

// Lastly, we have the login function. It's like the secret handshake to enter the club.
export const authenticateUser = async (username, password) => {
  try {
    // We're checking if the username and password match what's on file.
    const response = await axios.post(`${API_URL}/users/login`, {
      username,
      password,
    });
    // If we get a good response, we return it. This probably includes some user info and a token.
    return response.data; // Assuming the server sends back an object with accessToken
  } catch (error) {
    // If login fails, we log the error and return false. Maybe the password was incorrect.
    console.error(
      "Error during authentication:",
      error.response?.data?.message || error.message
    );
    return false;
  }
};

//Fetches a list of all recipes by making a GET request.
//It returns the list of recipes on success. 
//If it encounters an error (like a network issue or server error),
//it throws a more generic error to be caught by the calling code,
//which allows for centralized error handling in the UI layer.
export const fetchRecipes = async () => {
  try {
    const response = await axios.get(`${API_URL}/recipes`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch the recipes.");
  }
};

//Retrieves detailed information about a single recipe given its ID. 
//It's similar to fetchRecipes but targeted at a single record. On success, 
//it returns the recipe's details. On failure, it logs the specific error and throws a generic error message.
export const fetchRecipeById = async (recipeId) => {
  try {
    const response = await axios.get(`${API_URL}/recipes/findone/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    throw new Error("Failed to fetch recipe");
  }
};

//Fetches meal plan details by ID. 
//This is crucial for displaying or editing specific meal plans. 
//It returns the meal plan details on success.
// On failure, it logs the detailed error and throws a generic error message to indicate the failure.
export const fetchMealPlansbyId = async (mealId) => {
  try {
    const response = await axios.get(`${API_URL}/meals/loadmeal/${mealId}`);
    return response.data;
  } catch (error) {
    console.error("Axios error fetching meal plans:", error.response ? error.response.data : error.message);
    throw new Error("Failed to fetch the meal plans.");
  }
};

//Saves a new or updated meal plan to the database. 
//On success, it returns the saved meal plan's details from the response.
//If it fails (due to reasons like validation errors or network issues),
//it logs the error and returns false, signaling the operation's failure.
export const saveMealPlan = async (mealPlan) => {
  try {
    const response = await axios.post(`${API_URL}/meals/savemeal`, mealPlan);
    return response.data;
  } catch (error) {
    console.error("Error saving meal plan:", error);
    return false;
  }
};

//This function adds a recipe to the user's list of favorites.
//By sending a POST request with the recipeId and userId, it tries to update the user's favorite recipes.
//On success, it returns true, indicating the recipe was successfully added. 
//On failure, it logs the error and returns false, which could trigger a user-friendly error message on the frontend.
export const addFavoriteRecipe = async (recipeId, userId) => {
  try {
    await axios.post(`${API_URL}/users/favorite`, { recipeId, userId });
    return true;
  } catch (error) {
    console.error("Error adding favorite recipe:", error);
    return false;
  }
};


//Similar to addFavoriteRecipe, but instead, it removes a recipe from the user's favorites. 
//It makes a DELETE request, passing the recipeId and userId as query parameters. 
//A successful operation returns true, signaling that the recipe was removed from favorites. 
//On failure, it logs the error and returns false.
export const removeFavoriteRecipe = async (recipeId, userId) => {
  try {
    await axios.delete(`${API_URL}/users/deletefavorite?recipeId=${encodeURIComponent(recipeId)}&userId=${encodeURIComponent(userId)}`);
    return true;
  } catch (error) {
    console.error("Error removing favorite recipe:", error);
    return false;
  }
};

//Allows users to update their bio. 
//It sends a POST request with the userId and the new bio (newBio). 
//The function returns the updated user data on success, allowing the frontend to reflect the change immediately. 
//On failure, it throws an error, which can be caught and handled by the calling function to inform the user.
export const updateUserBio = async (userId, newBio) => {
  try {
    const response = await axios.post(`${API_URL}/users/bio/`, {userId,
      bio: newBio,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update user bio:', error);
    throw error; 
  }
};

//Enables users to customize their theme preference (e.g., light or dark mode). 
//This function sends a POST request with the userId and the selected theme (newTheme). 
//On success, it returns the response data, which could include the updated user object. 
//On failure, it throws an error, providing an opportunity for the frontend to display an appropriate message.
export const updateUserTheme = async (userId, newTheme) => {
  try {
    const response = await axios.post(`${API_URL}/users/theme/`, {userId,
      theme: newTheme,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update user theme:', error);
    throw error;
  }
};

//This function allows users to update their profile image. 
//It sends a POST request with the userId and the URL of the new profile image (newProfileImage). 
//Successful completion returns the updated user data, enabling the frontend to display the new image immediately. 
//On failure, it throws an error, allowing for error handling in the UI to notify the user.
export const updateUserProfileImage = async (userId, newProfileImage) => {
  try {
    const response = await axios.post(`${API_URL}/users/profileimage/`, {userId,
      profileImageUrl: newProfileImage,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update user profile image:', error);
    throw error;
  }
} 
