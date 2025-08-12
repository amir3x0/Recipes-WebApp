// First, we're bringing in mongoose to interact with our MongoDB database. It's our ORM buddy!
const mongoose = require("mongoose");
// bcrypt is here for hashing passwords because we care about security!
const bcrypt = require("bcrypt");

// Here's our user schema. It's like the DNA for user documents in our database.
const userSchema = new mongoose.Schema({
  // Every user has a name, and it's required because, well, we need to call them something!
  name: { type: String, required: true },
  // Email also needs to be unique because it's essentially their identifier (besides username).
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Username's gotta be unique too. We don't want any identity crises on our hands.
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // Passwords are crucial, and we're gonna hash them for safety. No plain text here!
  password: {
    type: String,
    required: true,
  },
  // A bio is optional. If they don't set one, it's "no bio available" by default.
  bio: { type: String, default: "no bio available" },
  // Profile image URL. There's a default one in case they don't upload a picture.
  profileImageUrl: {
    type: String, // URL to the user's profile image
    default: "https://ik.imagekit.io/k0hnty7yv/defaultpic.jpg?updatedAt=1710591249991",
  },
  // Favorite recipes and uploaded recipes are arrays that start empty.
  favoriteRecipes: [{ type: String, default: [] }],
  uploadedRecipes: [{ type: String, default: [] }],
  // MealPlans is also an array that'll contain the IDs of the user's meal plans.
  MealPlans: [ { type: String, default: [] }],
  // Users can choose a theme for their profile. "light" is the default setting.
  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "light"
  },
});

// Before saving a user to the database, let's hash their password for security.
userSchema.pre("save", async function (next) {
  // We only do this if the password is new or has been changed.
  if (!this.isModified("password")) return next();
  try {
    // Create a salt, then hash the password with it.
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // If something goes wrong, we move to the next middleware with the error.
    next(error);
  }
});

// We're adding a method to our schema to compare a provided password with the hashed one.
userSchema.methods.comparePassword = async function (candidatePassword) {
  // bcrypt does the heavy lifting of comparing the passwords for us.
  return bcrypt.compare(candidatePassword, this.password);
};

// And there we go! Let's export this model so it can be used throughout our app.
module.exports = mongoose.model("User", userSchema);
