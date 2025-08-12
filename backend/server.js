// Load environment variables from .env file. 
// This includes sensitive info like database connection strings, so keep it safe!
require('dotenv').config();

// Importing necessary modules for our server
const express = require('express'); // For handling HTTP requests
const mongoose = require('mongoose'); // For MongoDB interactions
const cors = require('cors'); // To enable Cross-Origin requests
const recipeRoutes = require('./routes/recipes'); // Routes for recipe-related operations
const userRoutes = require("./routes/users"); // Routes for user account operations
const mealPlanRoutes = require("./routes/meals"); // Routes for meal planning
const ingredientRoutes = require("./routes/ingredientRoutes"); // Routes for ingredient management

// Initializing the Express app
const app = express();

// Middleware setup
app.use(cors()); // Enables CORS for all routes, allowing requests from different origins
app.use(express.json()); // Parses incoming JSON requests and puts the parsed data in req.body

// A simple middleware that logs the request path and method to the console.
// Helps in debugging by showing you what's being requested.
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next(); // Proceed to the next middleware or route handler
});

// Routes setup
// Each "use" attaches specific routes to our app with a base path. 
// For example, all user-related routes will start with "/users".
app.use("/users", userRoutes);
app.use('/recipes', recipeRoutes);
app.use('/ingredient', ingredientRoutes);
app.use('/meals', mealPlanRoutes);

// Connect to MongoDB & start the server
// Uses the MONGO_URI environment variable for the MongoDB connection string.
mongoose.connect(process.env.MONGO_URI)
    .then(result => {
        // Once connected to the database, start listening for HTTP requests.
        const PORT = process.env.PORT || 3000; // Use the PORT from .env or default to 3000
        app.listen(PORT, () => {
            console.log(`Connected to DB & listening on port ${PORT}`); // Confirmation message
        });
    })
    .catch(err => console.log("Error:", err)); // Log errors if connection fails
