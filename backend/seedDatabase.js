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

    // clear existing data to avoid duplicates on successive runs
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Meal.deleteMany({});

    // Sample users with hashed passwords and updated profile images
    const users = [
      {
        _id: new mongoose.Types.ObjectId("64f491e0b5a4c9a4a1a45f01"),
        name: "Miri Cohen",
        email: "miri@example.com",
        username: "miri28",
        password: await bcrypt.hash("password1", 10),
        bio: "Full‑stack developer and recipe enthusiast.",
        profileImageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Generic-person.svg/480px-Generic-person.svg.png",
        favoriteRecipes: [
          "64f49391b5a4c9a4a1a45f11",
          "64f49391b5a4c9a4a1a45f14",
          "64f49391b5a4c9a4a1a45f17",
        ],
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
        profileImageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Generic-person.svg/480px-Generic-person.svg.png",
        favoriteRecipes: [
          "64f49391b5a4c9a4a1a45f12",
          "64f49391b5a4c9a4a1a45f15",
          "64f49391b5a4c9a4a1a45f16",
        ],
        uploadedRecipes: [],
        MealPlans: [],
        theme: "dark",
      },
    ];

    await User.insertMany(users);
    console.log("Users inserted");

    // Recipes array combining original recipes with additional dishes and real image URLs
    const recipes = [
      {
        _id: new mongoose.Types.ObjectId("64f49391b5a4c9a4a1a45f11"),
        title: "Shakshuka",
        difficulty: "Easy",
        category: "Main Dish",
        description:
          "A hearty North African–Israeli dish of poached eggs cooked in a spiced tomato and pepper sauce.",
        instructions: [
          "Sauté onions, bell peppers and garlic in olive oil until soft.",
          "Add tomatoes, paprika, cumin and simmer until thickened.",
          "Make wells in the sauce and crack eggs into them.",
          "Cover and cook until eggs are set; garnish with parsley.",
        ],
        ingredients: [
          { name: "tomatoes", quantity: 6, unit: "piece" },
          { name: "bell pepper", quantity: 1, unit: "piece" },
          { name: "onion", quantity: 1, unit: "piece" },
          { name: "eggs", quantity: 4, unit: "piece" },
          { name: "cumin", quantity: 1, unit: "tsp" },
          { name: "paprika", quantity: 2, unit: "tsp" },
        ],
        calories: { total: 350, protein: 15, carbs: 20, fat: 22 },
        picture:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Shakshuka_(12149680454).jpg/1280px-Shakshuka_(12149680454).jpg",
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
        picture:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chocolate_Babka_-_31706252800.jpg/1280px-Chocolate_Babka_-_31706252800.jpg",
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
        picture:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Mediterranean_Salad.jpg/1280px-Mediterranean_Salad.jpg",
        Chef: "Miri Cohen",
      },
      {
        _id: new mongoose.Types.ObjectId("64f49391b5a4c9a4a1a45f14"),
        title: "Falafel in Pita",
        difficulty: "Intermediate",
        category: "Main Dish",
        description:
          "Classic Israeli street food featuring crispy falafel balls stuffed in pita with salad and tahini.",
        instructions: [
          "Soak dried chickpeas in water overnight.",
          "Blend chickpeas with herbs and spices; form into small balls.",
          "Fry falafel until crispy and golden.",
          "Warm pitas, fill with falafel, fresh salad, pickles and drizzle with tahini.",
        ],
        ingredients: [
          { name: "dried chickpeas", quantity: 200, unit: "g" },
          { name: "parsley", quantity: 1, unit: "bunch" },
          { name: "cilantro", quantity: 1, unit: "bunch" },
          { name: "onion", quantity: 1, unit: "piece" },
          { name: "garlic", quantity: 3, unit: "clove" },
          { name: "cumin", quantity: 2, unit: "tsp" },
          { name: "baking powder", quantity: 1, unit: "tsp" },
          { name: "salt", quantity: 1, unit: "tsp" },
          { name: "vegetable oil", quantity: 500, unit: "ml" },
          { name: "pita bread", quantity: 4, unit: "piece" },
          { name: "tahini", quantity: 100, unit: "ml" },
        ],
        calories: { total: 400, protein: 15, carbs: 50, fat: 15 },
        picture:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Falafel_in_a_pita.jpg/1280px-Falafel_in_a_pita.jpg",
        Chef: "Miri Cohen",
      },
      {
        _id: new mongoose.Types.ObjectId("64f49391b5a4c9a4a1a45f15"),
        title: "Israeli Couscous Salad",
        difficulty: "Easy",
        category: "Appetizers",
        description:
          "Toasted pearl couscous tossed with fresh vegetables and herbs in a lemony dressing.",
        instructions: [
          "Toast pearl couscous in a little olive oil until lightly golden.",
          "Simmer with water or vegetable broth until tender; let cool.",
          "Chop cucumbers, tomatoes, and parsley finely.",
          "Toss couscous with vegetables, lemon juice, olive oil, salt and pepper.",
        ],
        ingredients: [
          { name: "pearl couscous", quantity: 200, unit: "g" },
          { name: "cucumber", quantity: 1, unit: "piece" },
          { name: "tomato", quantity: 1, unit: "piece" },
          { name: "parsley", quantity: 0.5, unit: "bunch" },
          { name: "lemon", quantity: 1, unit: "piece" },
          { name: "olive oil", quantity: 3, unit: "tbsp" },
          { name: "salt", quantity: 0.5, unit: "tsp" },
          { name: "black pepper", quantity: 0.25, unit: "tsp" },
        ],
        calories: { total: 250, protein: 6, carbs: 40, fat: 6 },
        picture:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Israeli_Couscous_(140491483).jpeg/1280px-Israeli_Couscous_(140491483).jpeg",
        Chef: "Miri Cohen",
      },
      {
        _id: new mongoose.Types.ObjectId("64f49391b5a4c9a4a1a45f16"),
        title: "Hummus",
        difficulty: "Easy",
        category: "Appetizers",
        description:
          "Creamy blended dip made from chickpeas, tahini, lemon, and garlic.",
        instructions: [
          "Drain and rinse chickpeas.",
          "Blend chickpeas with tahini, lemon juice, garlic and olive oil until smooth.",
          "Add cold water gradually to adjust consistency and blend again.",
          "Season with salt; serve drizzled with olive oil and a sprinkle of paprika.",
        ],
        ingredients: [
          { name: "canned chickpeas", quantity: 400, unit: "g" },
          { name: "tahini", quantity: 60, unit: "ml" },
          { name: "lemon", quantity: 1, unit: "piece" },
          { name: "garlic", quantity: 2, unit: "clove" },
          { name: "olive oil", quantity: 2, unit: "tbsp" },
          { name: "salt", quantity: 0.5, unit: "tsp" },
          { name: "paprika", quantity: 0.25, unit: "tsp" },
        ],
        calories: { total: 150, protein: 5, carbs: 10, fat: 10 },
        picture:
          "https://cdn.pixabay.com/photo/2019/03/04/13/00/hummus-4034050_1280.jpg",
        Chef: "Paolina Gershon",
      },
      {
        _id: new mongoose.Types.ObjectId("64f49391b5a4c9a4a1a45f17"),
        title: "Sabich",
        difficulty: "Intermediate",
        category: "Main Dish",
        description:
          "Iraqi-Israeli pita sandwich stuffed with fried eggplant, hard-boiled eggs, salad, and tangy amba sauce.",
        instructions: [
          "Slice eggplants and fry in oil until golden; drain on paper towels.",
          "Hard-boil the eggs, peel and slice them.",
          "Prepare a simple salad by chopping tomatoes, cucumbers and onions.",
          "Warm pitas and assemble with eggplant slices, egg, salad, pickles, tahini and amba sauce.",
        ],
        ingredients: [
          { name: "eggplant", quantity: 2, unit: "piece" },
          { name: "eggs", quantity: 4, unit: "piece" },
          { name: "tomato", quantity: 2, unit: "piece" },
          { name: "cucumber", quantity: 2, unit: "piece" },
          { name: "onion", quantity: 1, unit: "piece" },
          { name: "pickles", quantity: 100, unit: "g" },
          { name: "tahini", quantity: 50, unit: "ml" },
          { name: "amba sauce", quantity: 30, unit: "ml" },
          { name: "pita bread", quantity: 4, unit: "piece" },
          { name: "vegetable oil", quantity: 300, unit: "ml" },
        ],
        calories: { total: 500, protein: 15, carbs: 50, fat: 25 },
        picture:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Sabich1.jpg/1280px-Sabich1.jpg",
        Chef: "Miri Cohen",
      },
    ];

    await Recipe.insertMany(recipes);
    console.log("Recipes inserted");

    // Meals linking users and various recipes
    const meals = [
      {
        _id: new mongoose.Types.ObjectId("64f494c3b5a4c9a4a1a45f21"),
        name: "Sunday Brunch",
        recipes: [
          "64f49391b5a4c9a4a1a45f11",
          "64f49391b5a4c9a4a1a45f13",
          "64f49391b5a4c9a4a1a45f14",
        ],
        userId: "64f491e0b5a4c9a4a1a45f01",
      },
      {
        _id: new mongoose.Types.ObjectId("64f494c3b5a4c9a4a1a45f22"),
        name: "Dessert Party",
        recipes: ["64f49391b5a4c9a4a1a45f12"],
        userId: "64f491e0b5a4c9a4a1a45f02",
      },
      {
        _id: new mongoose.Types.ObjectId("64f494c3b5a4c9a4a1a45f23"),
        name: "Middle Eastern Feast",
        recipes: [
          "64f49391b5a4c9a4a1a45f14",
          "64f49391b5a4c9a4a1a45f15",
          "64f49391b5a4c9a4a1a45f16",
          "64f49391b5a4c9a4a1a45f17",
        ],
        userId: "64f491e0b5a4c9a4a1a45f01",
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