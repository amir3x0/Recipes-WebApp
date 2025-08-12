// backend/seedDatabase.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/UserModel");
const Recipe = require("./models/RecipesModel");
const Meal = require("./models/MealModel");
const bcrypt = require("bcrypt");

async function seed() {
try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // OPTIONAL: clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Meal.deleteMany({});

    // Sample users (hash passwords securely)
    const users = [
    {
        _id: new mongoose.Types.ObjectId("64f491e0b5a4c9a4a1a45f01"),
        name: "Miri Cohen",
        email: "miri@example.com",
        username: "miri28",
        password: await bcrypt.hash("password1", 10),
        bio: "Full‑stack developer and recipe enthusiast.",
        profileImageUrl: "https://ik.imagekit.io/k0hnty7yv/defaultpic.jpg",
        favoriteRecipes: [],
        uploadedRecipes: [],
        MealPlans: [],
        theme: "light",
    },
    {
        _id: new mongoose.Types.ObjectId("64f491e0b5a4c9a4a1a45f02"),
        name: "Paolina Gershon",
        email: "paolina@example.com",
        username: "paulinaChef",
        password: await bcrypt.hash("password2", 10),
        bio: "Home cook specialising in desserts.",
        profileImageUrl: "https://ik.imagekit.io/k0hnty7yv/defaultpic.jpg",
        favoriteRecipes: [],
        uploadedRecipes: [],
        MealPlans: [],
        theme: "dark",
    },
    ];

    await User.insertMany(users);
    console.log("Users inserted");

    // Sample recipes
    const recipes = [
    {
        _id: new mongoose.Types.ObjectId("64f49391b5a4c9a4a1a45f11"),
        title: "Classic Shakshuka",
        difficulty: "Easy",
        category: "Main Dish",
        description:
        "A traditional North African dish of poached eggs in a spicy tomato sauce.",
        instructions: [
        "Heat olive oil in a skillet and cook onions and peppers until soft.",
        "Add garlic, cumin and paprika; cook for 1 minute.",
        "Add crushed tomatoes; simmer for 10 minutes.",
        "Make wells in the sauce and crack in eggs; cover and cook until eggs set.",
        ],
        ingredients: [
        { name: "onion", quantity: 1, unit: "piece" },
        { name: "bell pepper", quantity: 1, unit: "piece" },
        { name: "crushed tomatoes", quantity: 400, unit: "g" },
        { name: "eggs", quantity: 4, unit: "piece" },
        ],
        calories: { total: 300, protein: 16, carbs: 24, fat: 12 },
        picture: "https://example.com/images/shakshuka.jpg",
        Chef: "Miri Cohen",
    },
    {
        _id: new mongoose.Types.ObjectId("64f49391b5a4c9a4a1a45f12"),
        title: "Chocolate Babka",
        difficulty: "Intermediate",
        category: "Dessert",
        description: "A rich yeasted cake with swirls of chocolate filling.",
        instructions: [
        "Prepare dough and let it rise until doubled.",
        "Roll out dough, spread chocolate filling and roll up.",
        "Twist into a braid and let rise again.",
        "Bake until golden brown and brush with syrup.",
        ],
        ingredients: [
        { name: "flour", quantity: 500, unit: "g" },
        { name: "yeast", quantity: 7, unit: "g" },
        { name: "dark chocolate", quantity: 200, unit: "g" },
        { name: "butter", quantity: 100, unit: "g" },
        ],
        calories: { total: 550, protein: 10, carbs: 70, fat: 25 },
        picture: "https://example.com/images/babka.jpg",
        Chef: "Paolina Gershon",
    },
    {
        _id: new mongoose.Types.ObjectId("64f49391b5a4c9a4a1a45f13"),
        title: "Mediterranean Salad",
        difficulty: "Easy",
        category: "Starters",
        description:
        "A refreshing salad with cucumbers, tomatoes, feta and olives.",
        instructions: [
        "Chop cucumbers, tomatoes and red onions.",
        "Crumble feta cheese and add to the vegetables.",
        "Add olives, drizzle with olive oil and lemon juice, sprinkle oregano.",
        ],
        ingredients: [
        { name: "cucumber", quantity: 2, unit: "piece" },
        { name: "tomato", quantity: 2, unit: "piece" },
        { name: "feta", quantity: 100, unit: "g" },
        { name: "olive", quantity: 50, unit: "g" },
        ],
        calories: { total: 200, protein: 6, carbs: 8, fat: 14 },
        picture: "https://example.com/images/mediterranean_salad.jpg",
        Chef: "Miri Cohen",
    },
    ];

    await Recipe.insertMany(recipes);
    console.log("Recipes inserted");

    // Sample meals linking users and recipes
    const meals = [
    {
        _id: new mongoose.Types.ObjectId("64f494c3b5a4c9a4a1a45f21"),
        name: "Sunday Brunch",
        recipes: ["64f49391b5a4c9a4a1a45f11", "64f49391b5a4c9a4a1a45f13"],
        userId: "64f491e0b5a4c9a4a1a45f01",
    },
    {
        _id: new mongoose.Types.ObjectId("64f494c3b5a4c9a4a1a45f22"),
        name: "Dessert Party",
        recipes: ["64f49391b5a4c9a4a1a45f12"],
        userId: "64f491e0b5a4c9a4a1a45f02",
    },
    ];

    await Meal.insertMany(meals);
    console.log("Meals inserted");

    console.log("Database seeding complete");
    await mongoose.disconnect();
} catch (err) {
    console.error(err);
}
}

seed();
