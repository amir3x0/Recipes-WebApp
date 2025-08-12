// We start off by importing the essentials. React itself, our styling, and all the pages and components we've cooked up.
import React from "react";
import "./App.css"; // That's for making everything pretty.
import Home from "./pages/home/Home";
import Shopping from "./pages/shopping/Shopping";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // These guys handle our navigation.
import NavBar from "./components/Navbar"; // Everyone needs a good nav bar to find their way.
import Recipes from "./pages/Recipes";
import PlanMeal from "./pages/plan/Plan";
import Share from "./pages/share/Share";
import MyYummy from "./pages/profile/MyYummy"; // A place for users to feel at home.
import Footer from "./components/Footer"; // Can't forget about the footer, it ties everything together.
import SignInPage from "./components/SignInPage"; // For our users to sign in.
// Contexts - these are like our recipe ingredients for global state management.
import { ShoppingListProvider } from "./context/ShoppingListContext";
import { SelectedRecipesProvider } from "./context/SelectedRecipesContext";
import { UserProvider } from "./context/UserContext";
import { RecipesForShoppingListProvider } from "./context/RecipesForShoppingListContext";
import {ThemeProvider} from "./context/ThemeContext"; // To switch between light and dark mode, fancy!

// Here's our App function. It's like the main dish of our codebase.
function App() {
  return (
    <Router> {/* Our Router, it's like the plate everything sits on. */}
      <UserProvider> {/* UserProvider wraps everything to manage user state globally. */}
        <ThemeProvider> {/* ThemeProvider, for that light/dark mood setting. */}
          <SelectedRecipesProvider> {/* This one keeps track of what recipes we're playing with. */}
            <RecipesForShoppingListProvider> {/* Manages recipes specifically for the shopping list feature. */}
              <ShoppingListProvider> {/* Takes care of our shopping list state. */}
                {/* Below is our UI layout, starting with the theme-adjusted background. */}
                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <NavBar /> {/* Our navigation bar, always at the top. */}
                  <div className="font-serif"> {/* Here we define the font for our content. */}
                    <Routes> {/* Routes determine what content is shown based on the URL path. */}
                      {/* Each Route is like a signpost, pointing to different pages of our app. */}
                      <Route path="/" element={<Home />} />
                      <Route path="/A6-Final/" element={<Home />} />
                      <Route path="/Home" element={<Home />} />
                      <Route path="/Recipes" element={<Recipes />} />
                      <Route path="/Plan" element={<PlanMeal />} />
                      <Route path="/Share" element={<Share />} />
                      <Route path="/Shopping" element={<Shopping />} />
                      <Route path="/MyYummy" element={<MyYummy />} />
                      <Route path="/SignIn" element={<SignInPage />} />
                    </Routes>
                  </div>
                  <Footer /> {/* Our footer, because every page needs a solid base. */}
                </div>
              </ShoppingListProvider>
            </RecipesForShoppingListProvider>
          </SelectedRecipesProvider>
        </ThemeProvider>
      </UserProvider>
    </Router>
  );
}

// Finally, we export our App so it can be served up to users.
export default App;
