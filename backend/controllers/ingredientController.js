// First, we need axios, our go-to library for making HTTP requests. It's like our internet messenger.
const axios = require('axios');

// Here's our function to get info on an ingredient by its name. It's async because we're gonna wait for some data to come back.
const getIngredientInfoByName = async (req, res) => {
  try {
    // We're pulling the ingredient's name from the URL parameters. It's what the user types in.
    const { name } = req.params;
    // And we're getting any query params too. These might include the amount and unit for the ingredient.
    const { amount, unit } = req.query;

    // Now, we're sending out a search request to Spoonacular's API to find our ingredient by name.
    // We're only asking for 1 result to keep things simple.
    const searchResponse = await axios.get(`https://api.spoonacular.com/food/ingredients/search`, {
      params: {
        query: name,
        number: 1, // Just one result, please!
        apiKey: process.env.SPOONACULAR_API_KEY // Our API key, kept secret in our env variables.
      }
    });

    // Once we get the search results, we grab the ID of the first (and only) ingredient.
    const ingredientId = searchResponse.data.results[0].id;

    // With the ID, we ask the API for more detailed info about the ingredient.
    // If the user didn't specify an amount or unit, we default to 1 and an empty string.
    const infoResponse = await axios.get(`https://api.spoonacular.com/food/ingredients/${ingredientId}/information`, {
      params: {
        amount: amount || 1, // Default to 1 if nothing is specified
        unit: unit || '',    // Default to an empty string if nothing is specified
        apiKey: process.env.SPOONACULAR_API_KEY // Again, using our secret API key.
      }
    });

    // Finally, we send the detailed info back to the user.
    res.json(infoResponse.data);
  } catch (error) {
    // If anything goes wrong (like the API is down), we catch the error and tell the user.
    console.error('Error:', error);
    res.status(error.response.status || 500).json({ error: 'Internal Server Error' });
  }
};

// We make sure to export our function so it can be used in other parts of our app.
module.exports = {
  getIngredientInfoByName
};
