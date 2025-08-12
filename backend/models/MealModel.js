// First up, we're grabbing mongoose, which is our go-to for dealing with MongoDB. Think of it as a bridge.
const mongoose = require('mongoose');

// Here, we're pulling out Schema from mongoose. It's like a blueprint or a template for our data.
const { Schema } = mongoose;

// Alright, let's talk about our mealSchema. It's defining what a "meal" looks like in our database.
const mealSchema = new Schema({
    // Every meal needs a name, right? So we're making sure it's a String and it's required.
    name: {
        type: String,
        required: true,
    },
    // Here's a list (or array) of recipes. Each item is a String. We're starting it off as empty.
    recipes:  [{ type: String, default: [] }],
    // We also need to know who this meal belongs to, so we're keeping track with a userId.
    userId: {
        type: String,
        required: true,
    },
});

// With our schema in place, we're creating a model. This lets us interact with a 'Meals' collection in the database.
const Meal = mongoose.model('Meal', mealSchema);

// Last but not least, we're exporting the Meal model so other parts of our app can use it.
module.exports = Meal;
