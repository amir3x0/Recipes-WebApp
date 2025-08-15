// Seed script to populate MongoDB with users, recipes and meals for the recipe app.
//
// This script connects to a MongoDB instance defined by the MONGO_URI environment
// variable, wipes out existing User, Recipe and Meal collections, and then
// inserts a fresh set of documents.  In addition to the seven example recipes
// already used in the project (Shakshuka, Chocolate Babka, Mediterranean
// Salad, Falafel in Pita, Israeli Couscous Salad, Hummus and Sabich), this
// version seeds thirteen additional dishes scraped from Hen in the Kitchen,
// Kobi Edri and Joshua Weissman’s websites.  Each new recipe includes
// approximate calorie information and a direct image URL that should display
// correctly without further processing.  The script also replaces the two
// placeholder users with real‑world authors plus an entry for you (Amir).  If
// you wish to update favourite recipes or uploaded recipes later, you can
// modify the arrays inside the user objects.

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/UserModel');
const Recipe = require('./models/RecipesModel');
const Meal = require('./models/MealModel');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data to avoid duplicates on successive runs
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Meal.deleteMany({});

    // Create a handful of users.  Each password is hashed at runtime.  When
    // adding new users be sure to provide a unique _id so you can easily
    // reference them from meals or other collections.
    const users = [
      {
        _id: new mongoose.Types.ObjectId('64f491e0b5a4c9a4a1a45f31'),
        name: 'Hen Mizrahi',
        email: 'hen@example.com',
        username: 'hen_mizrahi',
        password: await bcrypt.hash('passwordhen', 10),
        bio: 'Food blogger and recipe developer behind Hen in the Kitchen.',
        profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Generic-person.svg/480px-Generic-person.svg.png',
        favoriteRecipes: [],
        uploadedRecipes: [],
        MealPlans: [],
        theme: 'light',
      },
      {
        _id: new mongoose.Types.ObjectId('64f491e0b5a4c9a4a1a45f32'),
        name: 'Kobi Edri',
        email: 'kobi@example.com',
        username: 'kobi_edri',
        password: await bcrypt.hash('passwordkobi', 10),
        bio: 'Chef, food stylist and TV personality from Kobi Edri’s kitchen.',
        profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Generic-person.svg/480px-Generic-person.svg.png',
        favoriteRecipes: [],
        uploadedRecipes: [],
        MealPlans: [],
        theme: 'light',
      },
      {
        _id: new mongoose.Types.ObjectId('64f491e0b5a4c9a4a1a45f33'),
        name: 'Joshua Weissman',
        email: 'joshua@example.com',
        username: 'joshua',
        password: await bcrypt.hash('passwordjoshua', 10),
        bio: 'Chef, YouTuber and cookbook author.',
        profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Generic-person.svg/480px-Generic-person.svg.png',
        favoriteRecipes: [],
        uploadedRecipes: [],
        MealPlans: [],
        theme: 'light',
      },
      {
        _id: new mongoose.Types.ObjectId('64f491e0b5a4c9a4a1a45f34'),
        name: 'Amir Mishayev',
        email: 'amir.mishayev@gmail.com',
        username: 'amirM',
        password: await bcrypt.hash('123456', 10),
        bio: 'Software engineer and recipe enthusiast.',
        profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Generic-person.svg/480px-Generic-person.svg.png',
        favoriteRecipes: [],
        uploadedRecipes: [],
        MealPlans: [],
        theme: 'light',
      },
    ];

    await User.insertMany(users);
    console.log('Users inserted');

    // Existing recipes from the earlier seed.  Keep these so that any hard
    // references (e.g. in the sample meals) still resolve correctly.  Calorie
    // values are approximate.
    const baseRecipes = [
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f11'),
        title: 'Shakshuka',
        difficulty: 'Easy',
        category: 'Main Dish',
        description: 'A hearty North African–Israeli dish of poached eggs cooked in a spiced tomato and pepper sauce.',
        instructions: [
          'Sauté onions, bell peppers and garlic in olive oil until soft.',
          'Add tomatoes, paprika, cumin and simmer until thickened.',
          'Make wells in the sauce and crack eggs into them.',
          'Cover and cook until eggs are set; garnish with parsley.',
        ],
        ingredients: [
          { name: 'tomatoes', quantity: 6, unit: 'piece' },
          { name: 'bell pepper', quantity: 1, unit: 'piece' },
          { name: 'onion', quantity: 1, unit: 'piece' },
          { name: 'eggs', quantity: 4, unit: 'piece' },
          { name: 'cumin', quantity: 1, unit: 'tsp' },
          { name: 'paprika', quantity: 2, unit: 'tsp' },
        ],
        calories: { total: 350, protein: 15, carbs: 20, fat: 22 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Shakshuka_(12149680454).jpg/1280px-Shakshuka_(12149680454).jpg',
        Chef: 'Miri Cohen',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f12'),
        title: 'Chocolate Babka',
        difficulty: 'Intermediate',
        category: 'Dessert',
        description: 'A rich yeasted cake with swirls of chocolate filling.',
        instructions: [
          'Prepare dough and let it rise until doubled.',
          'Roll out dough, spread chocolate filling and roll up.',
          'Twist into a braid and let rise again.',
          'Bake until golden brown and brush with syrup.',
        ],
        ingredients: [
          { name: 'flour', quantity: 500, unit: 'g' },
          { name: 'yeast', quantity: 7, unit: 'g' },
          { name: 'dark chocolate', quantity: 200, unit: 'g' },
          { name: 'butter', quantity: 100, unit: 'g' },
        ],
        calories: { total: 550, protein: 10, carbs: 70, fat: 25 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chocolate_Babka_-_31706252800.jpg/1280px-Chocolate_Babka_-_31706252800.jpg',
        Chef: 'Paolina Gershon',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f13'),
        title: 'Mediterranean Salad',
        difficulty: 'Easy',
        category: 'Starters',
        description: 'A refreshing salad with cucumbers, tomatoes, feta and olives.',
        instructions: [
          'Chop cucumbers, tomatoes and red onions.',
          'Crumble feta cheese and add to the vegetables.',
          'Add olives, drizzle with olive oil and lemon juice, sprinkle oregano.',
        ],
        ingredients: [
          { name: 'cucumber', quantity: 2, unit: 'piece' },
          { name: 'tomato', quantity: 2, unit: 'piece' },
          { name: 'feta', quantity: 100, unit: 'g' },
          { name: 'olive', quantity: 50, unit: 'g' },
        ],
        calories: { total: 200, protein: 6, carbs: 8, fat: 14 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Mediterranean_Salad.jpg/1280px-Mediterranean_Salad.jpg',
        Chef: 'Miri Cohen',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f14'),
        title: 'Falafel in Pita',
        difficulty: 'Intermediate',
        category: 'Main Dish',
        description: 'Classic Israeli street food featuring crispy falafel balls stuffed in pita with salad and tahini.',
        instructions: [
          'Soak dried chickpeas in water overnight.',
          'Blend chickpeas with herbs and spices; form into small balls.',
          'Fry falafel until crispy and golden.',
          'Warm pitas, fill with falafel, fresh salad, pickles and drizzle with tahini.',
        ],
        ingredients: [
          { name: 'dried chickpeas', quantity: 200, unit: 'g' },
          { name: 'parsley', quantity: 1, unit: 'bunch' },
          { name: 'cilantro', quantity: 1, unit: 'bunch' },
          { name: 'onion', quantity: 1, unit: 'piece' },
          { name: 'garlic', quantity: 3, unit: 'clove' },
          { name: 'cumin', quantity: 2, unit: 'tsp' },
          { name: 'baking powder', quantity: 1, unit: 'tsp' },
          { name: 'salt', quantity: 1, unit: 'tsp' },
          { name: 'vegetable oil', quantity: 500, unit: 'ml' },
          { name: 'pita bread', quantity: 4, unit: 'piece' },
          { name: 'tahini', quantity: 100, unit: 'ml' },
        ],
        calories: { total: 400, protein: 15, carbs: 50, fat: 15 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Falafel_in_a_pita.jpg/1280px-Falafel_in_a_pita.jpg',
        Chef: 'Miri Cohen',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f15'),
        title: 'Israeli Couscous Salad',
        difficulty: 'Easy',
        category: 'Appetizers',
        description: 'Toasted pearl couscous tossed with fresh vegetables and herbs in a lemony dressing.',
        instructions: [
          'Toast pearl couscous in a little olive oil until lightly golden.',
          'Simmer with water or vegetable broth until tender; let cool.',
          'Chop cucumbers, tomatoes, and parsley finely.',
          'Toss couscous with vegetables, lemon juice, olive oil, salt and pepper.',
        ],
        ingredients: [
          { name: 'pearl couscous', quantity: 200, unit: 'g' },
          { name: 'cucumber', quantity: 1, unit: 'piece' },
          { name: 'tomato', quantity: 1, unit: 'piece' },
          { name: 'parsley', quantity: 0.5, unit: 'bunch' },
          { name: 'lemon', quantity: 1, unit: 'piece' },
          { name: 'olive oil', quantity: 3, unit: 'tbsp' },
          { name: 'salt', quantity: 0.5, unit: 'tsp' },
          { name: 'black pepper', quantity: 0.25, unit: 'tsp' },
        ],
        calories: { total: 250, protein: 6, carbs: 40, fat: 6 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Israeli_Couscous_(140491483).jpeg/1280px-Israeli_Couscous_(140491483).jpeg',
        Chef: 'Miri Cohen',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f16'),
        title: 'Hummus',
        difficulty: 'Easy',
        category: 'Appetizers',
        description: 'Creamy blended dip made from chickpeas, tahini, lemon, and garlic.',
        instructions: [
          'Drain and rinse chickpeas.',
          'Blend chickpeas with tahini, lemon juice, garlic and olive oil until smooth.',
          'Add cold water gradually to adjust consistency and blend again.',
          'Season with salt; serve drizzled with olive oil and a sprinkle of paprika.',
        ],
        ingredients: [
          { name: 'canned chickpeas', quantity: 400, unit: 'g' },
          { name: 'tahini', quantity: 60, unit: 'ml' },
          { name: 'lemon', quantity: 1, unit: 'piece' },
          { name: 'garlic', quantity: 2, unit: 'clove' },
          { name: 'olive oil', quantity: 2, unit: 'tbsp' },
          { name: 'salt', quantity: 0.5, unit: 'tsp' },
          { name: 'paprika', quantity: 0.25, unit: 'tsp' },
        ],
        calories: { total: 150, protein: 5, carbs: 10, fat: 10 },
        picture: 'https://cdn.pixabay.com/photo/2019/03/04/13/00/hummus-4034050_1280.jpg',
        Chef: 'Paolina Gershon',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f17'),
        title: 'Sabich',
        difficulty: 'Intermediate',
        category: 'Main Dish',
        description: 'Iraqi-Israeli pita sandwich stuffed with fried eggplant, hard-boiled eggs, salad, and tangy amba sauce.',
        instructions: [
          'Slice eggplants and fry in oil until golden; drain on paper towels.',
          'Hard-boil the eggs, peel and slice them.',
          'Prepare a simple salad by chopping tomatoes, cucumbers and onions.',
          'Warm pitas and assemble with eggplant slices, egg, salad, pickles, tahini and amba sauce.',
        ],
        ingredients: [
          { name: 'eggplant', quantity: 2, unit: 'piece' },
          { name: 'eggs', quantity: 4, unit: 'piece' },
          { name: 'tomato', quantity: 2, unit: 'piece' },
          { name: 'cucumber', quantity: 2, unit: 'piece' },
          { name: 'onion', quantity: 1, unit: 'piece' },
          { name: 'pickles', quantity: 100, unit: 'g' },
          { name: 'tahini', quantity: 50, unit: 'ml' },
          { name: 'amba sauce', quantity: 30, unit: 'ml' },
          { name: 'pita bread', quantity: 4, unit: 'piece' },
          { name: 'vegetable oil', quantity: 300, unit: 'ml' },
        ],
        calories: { total: 500, protein: 15, carbs: 50, fat: 25 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Sabich1.jpg/1280px-Sabich1.jpg',
        Chef: 'Miri Cohen',
      },
    ];

    // Additional recipes scraped and translated to English.  Each entry
    // includes an approximate macro breakdown, a category drawn from the
    // application’s enum (Appetizers, Starters, Main Dish, Dessert), a set of
    // instructions, and a reliable image URL.  The Chef field records the
    // original author for attribution.
    const extraRecipes = [
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f18'),
        title: 'Kubaneh',
        difficulty: 'Intermediate',
        category: 'Appetizers',
        description: 'Yemenite Jewish buttery pull‑apart bread baked overnight for Shabbat.',
        instructions: [
          'Prepare a yeast dough with flour, sugar, salt, yeast and warm water; knead until smooth.',
          'Let the dough rise until doubled in size; divide into equal pieces.',
          'Flatten each piece, spread with butter and roll into coils; arrange coils in a baking tin.',
          'Cover and bake at low heat overnight or until bread is golden and cooked through.',
        ],
        ingredients: [
          { name: 'flour', quantity: 500, unit: 'g' },
          { name: 'dry yeast', quantity: 10, unit: 'g' },
          { name: 'sugar', quantity: 50, unit: 'g' },
          { name: 'salt', quantity: 1, unit: 'tsp' },
          { name: 'water', quantity: 250, unit: 'ml' },
          { name: 'butter', quantity: 150, unit: 'g' },
        ],
        calories: { total: 450, protein: 7, carbs: 60, fat: 18 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Kubaneh_bread.jpg/1280px-Kubaneh_bread.jpg',
        Chef: 'Hen Mizrahi',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f19'),
        title: 'Shabbat Challah',
        difficulty: 'Intermediate',
        category: 'Starters',
        description: 'Soft braided bread traditionally served on Friday night dinner.',
        instructions: [
          'Combine flour, yeast, sugar, eggs, oil and water to form a dough; knead until smooth.',
          'Let the dough rise until doubled; divide into strands and braid.',
          'Place the braided loaf on a baking sheet, let rise again until puffy.',
          'Brush with egg wash and bake until deep golden brown.',
        ],
        ingredients: [
          { name: 'flour', quantity: 500, unit: 'g' },
          { name: 'dry yeast', quantity: 10, unit: 'g' },
          { name: 'sugar', quantity: 50, unit: 'g' },
          { name: 'eggs', quantity: 2, unit: 'piece' },
          { name: 'vegetable oil', quantity: 60, unit: 'ml' },
          { name: 'water', quantity: 240, unit: 'ml' },
          { name: 'salt', quantity: 1, unit: 'tsp' },
        ],
        calories: { total: 350, protein: 8, carbs: 65, fat: 5 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Challah_Bread.jpg',
        Chef: 'Hen Mizrahi',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f1a'),
        title: 'Malabi',
        difficulty: 'Easy',
        category: 'Dessert',
        description: 'Creamy Middle Eastern milk pudding topped with syrup and nuts.',
        instructions: [
          'Combine milk, sugar and cornstarch in a saucepan and cook over medium heat until thickened.',
          'Pour the pudding into serving cups and refrigerate until set.',
          'Prepare a rose water or fruit syrup and cool completely.',
          'Top the chilled malabi with syrup and garnish with chopped pistachios or coconut.',
        ],
        ingredients: [
          { name: 'milk', quantity: 500, unit: 'ml' },
          { name: 'sugar', quantity: 80, unit: 'g' },
          { name: 'cornstarch', quantity: 40, unit: 'g' },
          { name: 'rose water', quantity: 1, unit: 'tbsp' },
          { name: 'pistachios', quantity: 30, unit: 'g' },
        ],
        calories: { total: 300, protein: 6, carbs: 40, fat: 12 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Israeli_malabi_dessert.jpg/1280px-Israeli_malabi_dessert.jpg',
        Chef: 'Hen Mizrahi',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f1b'),
        title: 'Baked Sufganiyot',
        difficulty: 'Intermediate',
        category: 'Dessert',
        description: 'Yeasted Hanukkah doughnuts baked instead of fried and filled with jam.',
        instructions: [
          'Make a soft yeast dough with flour, yeast, sugar, eggs, milk and butter.',
          'Let the dough rise until doubled in volume; roll and cut into rounds.',
          'Arrange on a baking sheet, allow a second rise until puffy.',
          'Bake until golden; when cool, fill with jam and dust with powdered sugar.',
        ],
        ingredients: [
          { name: 'flour', quantity: 500, unit: 'g' },
          { name: 'dry yeast', quantity: 7, unit: 'g' },
          { name: 'sugar', quantity: 80, unit: 'g' },
          { name: 'eggs', quantity: 2, unit: 'piece' },
          { name: 'milk', quantity: 250, unit: 'ml' },
          { name: 'butter', quantity: 50, unit: 'g' },
          { name: 'jam', quantity: 150, unit: 'g' },
          { name: 'powdered sugar', quantity: 20, unit: 'g' },
        ],
        calories: { total: 350, protein: 6, carbs: 55, fat: 12 },
        // Use a distinct image for baked sufganiyot to avoid duplicating the
        // classic deep‑fried photo.  This picture shows a tray of assorted
        // doughnuts (sufganiyot) from a bakery in Tel Aviv and loads reliably
        // at 1,280px width.
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sufganiot.jpg/1280px-Sufganiot.jpg',
        Chef: 'Hen Mizrahi',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f1c'),
        title: 'Classic Jam Sufganiyot',
        difficulty: 'Intermediate',
        category: 'Dessert',
        description: 'Traditional deep‑fried Hanukkah doughnuts filled with strawberry jam and dusted with powdered sugar.',
        instructions: [
          'Prepare a yeast dough with flour, sugar, eggs, milk and butter; knead until smooth.',
          'Let rise until doubled; roll out and cut into rounds.',
          'Fry the rounds in hot oil until golden on both sides; drain on paper towels.',
          'Inject jam into each doughnut and dust generously with powdered sugar.',
        ],
        ingredients: [
          { name: 'flour', quantity: 500, unit: 'g' },
          { name: 'dry yeast', quantity: 7, unit: 'g' },
          { name: 'sugar', quantity: 80, unit: 'g' },
          { name: 'eggs', quantity: 2, unit: 'piece' },
          { name: 'milk', quantity: 250, unit: 'ml' },
          { name: 'butter', quantity: 50, unit: 'g' },
          { name: 'oil', quantity: 1, unit: 'l' },
          { name: 'strawberry jam', quantity: 150, unit: 'g' },
          { name: 'powdered sugar', quantity: 20, unit: 'g' },
        ],
        calories: { total: 400, protein: 7, carbs: 60, fat: 14 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Classic_Hanukkah_sufganiyot.JPG/1280px-Classic_Hanukkah_sufganiyot.JPG',
        Chef: 'Hen Mizrahi',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f1d'),
        title: 'Ratatouille',
        difficulty: 'Intermediate',
        category: 'Main Dish',
        description: 'Classic Provençal stew of eggplant, zucchini, peppers and tomatoes.',
        instructions: [
          'Slice the eggplant, zucchini and bell peppers into thin rounds.',
          'Sauté onions and garlic in olive oil until fragrant, add chopped tomatoes and herbs; simmer to make a sauce.',
          'Arrange alternating slices of vegetables in the sauce in a spiral pattern.',
          'Bake until the vegetables are tender; drizzle with olive oil and serve warm.',
        ],
        ingredients: [
          { name: 'eggplant', quantity: 1, unit: 'piece' },
          { name: 'zucchini', quantity: 2, unit: 'piece' },
          { name: 'bell pepper', quantity: 2, unit: 'piece' },
          { name: 'tomatoes', quantity: 4, unit: 'piece' },
          { name: 'onion', quantity: 1, unit: 'piece' },
          { name: 'garlic', quantity: 3, unit: 'clove' },
          { name: 'olive oil', quantity: 3, unit: 'tbsp' },
          { name: 'thyme', quantity: 1, unit: 'tsp' },
          { name: 'salt', quantity: 1, unit: 'tsp' },
          { name: 'black pepper', quantity: 0.5, unit: 'tsp' },
        ],
        calories: { total: 200, protein: 4, carbs: 25, fat: 10 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Ratatouille-Dish.jpg/1280px-Ratatouille-Dish.jpg',
        Chef: 'Kobi Edri',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f1e'),
        title: 'Arayes Twist',
        difficulty: 'Intermediate',
        category: 'Main Dish',
        description: 'Grilled pita halves stuffed with spiced ground meat, a Middle Eastern street‑food classic.',
        instructions: [
          'Mix ground beef or lamb with chopped onions, parsley, garlic and spices.',
          'Cut pitas in half and stuff generously with the meat mixture.',
          'Brush the outsides with olive oil and grill over medium heat until the meat is cooked and the pita is crisp.',
          'Serve hot with tahini sauce, pickles and salad.',
        ],
        ingredients: [
          { name: 'ground beef', quantity: 500, unit: 'g' },
          { name: 'onion', quantity: 1, unit: 'piece' },
          { name: 'parsley', quantity: 1, unit: 'bunch' },
          { name: 'garlic', quantity: 3, unit: 'clove' },
          { name: 'cumin', quantity: 2, unit: 'tsp' },
          { name: 'paprika', quantity: 1, unit: 'tsp' },
          { name: 'salt', quantity: 1, unit: 'tsp' },
          { name: 'black pepper', quantity: 0.5, unit: 'tsp' },
          { name: 'pita bread', quantity: 4, unit: 'piece' },
          { name: 'olive oil', quantity: 2, unit: 'tbsp' },
        ],
        calories: { total: 350, protein: 12, carbs: 30, fat: 18 },
        picture: 'https://kobiedri.co.il/wp-content/uploads/2023/04/78C83A3D-CC7F-410D-A521-00744BECFFF9-1024x683.jpeg',
        Chef: 'Kobi Edri',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f1f'),
        title: 'Asian Salmon Burger',
        difficulty: 'Intermediate',
        category: 'Main Dish',
        description: 'Pan‑seared patties of chopped salmon seasoned with ginger and soy, served on a bun.',
        instructions: [
          'Finely chop fresh salmon and combine with minced scallions, grated ginger, soy sauce and breadcrumbs.',
          'Form into patties and chill to firm up.',
          'Heat a skillet with a little oil and pan‑fry the patties until browned on both sides and cooked through.',
          'Serve on buns with lettuce, pickles and a drizzle of spicy mayo.',
        ],
        ingredients: [
          { name: 'fresh salmon', quantity: 500, unit: 'g' },
          { name: 'scallions', quantity: 2, unit: 'piece' },
          { name: 'ginger', quantity: 1, unit: 'tbsp' },
          { name: 'soy sauce', quantity: 2, unit: 'tbsp' },
          { name: 'breadcrumbs', quantity: 50, unit: 'g' },
          { name: 'eggs', quantity: 1, unit: 'piece' },
          { name: 'buns', quantity: 4, unit: 'piece' },
          { name: 'lettuce', quantity: 4, unit: 'leaf' },
          { name: 'pickles', quantity: 50, unit: 'g' },
          { name: 'mayonnaise', quantity: 3, unit: 'tbsp' },
        ],
        calories: { total: 500, protein: 25, carbs: 35, fat: 22 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Salmon_Burger.jpg/1280px-Salmon_Burger.jpg',
        Chef: 'Kobi Edri',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f20'),
        title: 'Fish Arayes Skewers',
        difficulty: 'Intermediate',
        category: 'Appetizers',
        description: 'Skewered pieces of fish and pita grilled to perfection and served with dips.',
        instructions: [
          'Cut boneless white fish into cubes and season with salt, pepper and cumin.',
          'Cut pita bread into squares.',
          'Thread fish and pita alternately onto metal or wooden skewers.',
          'Grill over medium heat, turning until fish is cooked through and the pita is toasted.',
          'Serve with tahini sauce and a squeeze of lemon.',
        ],
        ingredients: [
          { name: 'white fish fillets', quantity: 400, unit: 'g' },
          { name: 'pita bread', quantity: 2, unit: 'piece' },
          { name: 'cumin', quantity: 1, unit: 'tsp' },
          { name: 'salt', quantity: 1, unit: 'tsp' },
          { name: 'black pepper', quantity: 0.5, unit: 'tsp' },
          { name: 'lemon', quantity: 1, unit: 'piece' },
          { name: 'tahini sauce', quantity: 50, unit: 'ml' },
        ],
        calories: { total: 300, protein: 20, carbs: 15, fat: 15 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Meat_and_fish_skewer_(5).jpg/1280px-Meat_and_fish_skewer_(5).jpg',
        Chef: 'Kobi Edri',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f21'),
        title: 'Falafel (White Chickpeas)',
        difficulty: 'Intermediate',
        category: 'Main Dish',
        description: 'Falafel balls made from white chickpeas, fried until crisp and served with pita and tahini.',
        instructions: [
          'Soak dried white chickpeas overnight; drain well.',
          'Process chickpeas with onions, garlic, parsley, cilantro and spices until a coarse paste forms.',
          'Stir in baking powder and flour if needed; shape into small balls.',
          'Fry the balls in hot oil until deeply golden and crisp.',
          'Serve with pita bread, chopped salad and tahini sauce.',
        ],
        ingredients: [
          { name: 'white chickpeas', quantity: 250, unit: 'g' },
          { name: 'onion', quantity: 1, unit: 'piece' },
          { name: 'garlic', quantity: 3, unit: 'clove' },
          { name: 'parsley', quantity: 1, unit: 'bunch' },
          { name: 'cilantro', quantity: 1, unit: 'bunch' },
          { name: 'cumin', quantity: 2, unit: 'tsp' },
          { name: 'salt', quantity: 1, unit: 'tsp' },
          { name: 'baking powder', quantity: 1, unit: 'tsp' },
          { name: 'flour', quantity: 2, unit: 'tbsp' },
          { name: 'vegetable oil', quantity: 500, unit: 'ml' },
          { name: 'pita bread', quantity: 4, unit: 'piece' },
          { name: 'tahini sauce', quantity: 100, unit: 'ml' },
        ],
        calories: { total: 400, protein: 15, carbs: 50, fat: 15 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Falafels_2.jpg/1280px-Falafels_2.jpg',
        Chef: 'Kobi Edri',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f22'),
        title: 'Garlic‑Butter Rolls & Egg Sandwich',
        difficulty: 'Intermediate',
        category: 'Starters',
        description: 'Rich garlic butter rolls paired with a soft scrambled egg filling.',
        instructions: [
          'Mix butter with minced garlic and parsley to make a garlic butter spread.',
          'Split dinner rolls and spread generously with the garlic butter; toast in a hot oven until golden.',
          'Scramble eggs gently with a little milk, salt and pepper until just set.',
          'Fill the toasted rolls with scrambled eggs and serve warm.',
        ],
        ingredients: [
          { name: 'dinner rolls', quantity: 4, unit: 'piece' },
          { name: 'butter', quantity: 50, unit: 'g' },
          { name: 'garlic', quantity: 2, unit: 'clove' },
          { name: 'parsley', quantity: 2, unit: 'tbsp' },
          { name: 'eggs', quantity: 4, unit: 'piece' },
          { name: 'milk', quantity: 2, unit: 'tbsp' },
          { name: 'salt', quantity: 0.5, unit: 'tsp' },
          { name: 'black pepper', quantity: 0.25, unit: 'tsp' },
        ],
        calories: { total: 600, protein: 20, carbs: 50, fat: 30 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Garlic_bread.jpg/1280px-Garlic_bread.jpg',
        Chef: 'Joshua Weissman',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f23'),
        title: 'Hokkaido Dinner Rolls',
        difficulty: 'Intermediate',
        category: 'Starters',
        description: 'Soft and fluffy Japanese milk rolls made with a tangzhong starter.',
        instructions: [
          'Cook a small portion of flour and milk to make a tangzhong starter and cool to room temperature.',
          'Combine the tangzhong with the remaining dough ingredients and knead until elastic.',
          'Let the dough rise until doubled; divide into equal portions and shape into rolls.',
          'Place rolls in a baking pan, proof until puffy and bake until golden; brush with butter.',
        ],
        ingredients: [
          { name: 'flour', quantity: 400, unit: 'g' },
          { name: 'milk', quantity: 200, unit: 'ml' },
          { name: 'dry yeast', quantity: 7, unit: 'g' },
          { name: 'sugar', quantity: 50, unit: 'g' },
          { name: 'butter', quantity: 50, unit: 'g' },
          { name: 'salt', quantity: 1, unit: 'tsp' },
          { name: 'egg', quantity: 1, unit: 'piece' },
        ],
        calories: { total: 350, protein: 8, carbs: 50, fat: 10 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Braided_Hokkaido_milk_bread.jpg/1024px-Braided_Hokkaido_milk_bread.jpg',
        Chef: 'Joshua Weissman',
      },
      {
        _id: new mongoose.Types.ObjectId('64f49391b5a4c9a4a1a45f24'),
        title: 'Sesame Bagel Garlic Butter Rolls',
        difficulty: 'Intermediate',
        category: 'Starters',
        description: 'Bagels topped with sesame seeds brushed in garlic butter for extra flavour.',
        instructions: [
          'Prepare a bagel dough with flour, yeast, water, sugar and salt; knead until smooth.',
          'Let the dough rise, then shape into rings and proof briefly.',
          'Boil the bagels in water to set the crust, then brush with garlic butter and sprinkle with sesame seeds.',
          'Bake until deep golden brown and fragrant.',
        ],
        ingredients: [
          { name: 'flour', quantity: 500, unit: 'g' },
          { name: 'dry yeast', quantity: 7, unit: 'g' },
          { name: 'water', quantity: 260, unit: 'ml' },
          { name: 'sugar', quantity: 20, unit: 'g' },
          { name: 'salt', quantity: 1, unit: 'tsp' },
          { name: 'butter', quantity: 50, unit: 'g' },
          { name: 'garlic', quantity: 2, unit: 'clove' },
          { name: 'sesame seeds', quantity: 30, unit: 'g' },
        ],
        calories: { total: 450, protein: 10, carbs: 55, fat: 18 },
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Bagel_with_sesame_3.jpg/1280px-Bagel_with_sesame_3.jpg',
        Chef: 'Joshua Weissman',
      },
    ];

    // Combine base recipes and extra recipes for insertion.
    const recipes = [...baseRecipes, ...extraRecipes];

    await Recipe.insertMany(recipes);
    console.log('Recipes inserted');

    // Define some sample meals that link recipes and users.  Feel free to
    // customise these or add more.  The userId values refer to the new users
    // created above.
    const meals = [
      {
        _id: new mongoose.Types.ObjectId('64f494c3b5a4c9a4a1a45f31'),
        name: 'Sunday Brunch',
        recipes: [
          '64f49391b5a4c9a4a1a45f11', // Shakshuka
          '64f49391b5a4c9a4a1a45f16', // Hummus
          '64f49391b5a4c9a4a1a45f1d', // Ratatouille
        ],
        userId: '64f491e0b5a4c9a4a1a45f34', // Amir
      },
      {
        _id: new mongoose.Types.ObjectId('64f494c3b5a4c9a4a1a45f32'),
        name: 'Dessert Party',
        recipes: [
          '64f49391b5a4c9a4a1a45f1a', // Malabi
          '64f49391b5a4c9a4a1a45f1b', // Baked Sufganiyot
          '64f49391b5a4c9a4a1a45f12', // Chocolate Babka
        ],
        userId: '64f491e0b5a4c9a4a1a45f31', // Hen
      },
      {
        _id: new mongoose.Types.ObjectId('64f494c3b5a4c9a4a1a45f33'),
        name: 'Middle Eastern Feast',
        recipes: [
          '64f49391b5a4c9a4a1a45f14', // Falafel in Pita
          '64f49391b5a4c9a4a1a45f15', // Israeli Couscous Salad
          '64f49391b5a4c9a4a1a45f21', // Falafel (White Chickpeas)
          '64f49391b5a4c9a4a1a45f17', // Sabich
        ],
        userId: '64f491e0b5a4c9a4a1a45f32', // Kobi
      },
    ];

    await Meal.insertMany(meals);
    console.log('Meals inserted');

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

seed();