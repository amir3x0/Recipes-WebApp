import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";

// Define navigation items for users who are logged in and logged out.
const loggedInItems = [
  // Paths for when the user is logged in.
  { name: "Home", path: "/" },
  { name: "Recipes", path: "/Recipes" },
  { name: "Plan Meal", path: "/Plan" },
  { name: "Share", path: "/Share" },
  { name: "Shopping", path: "/Shopping" },
  { name: "MyYummy", path: "/MyYummy" },
];

const loggedOutItems = [
  // Paths accessible to users who are not logged in.
  { name: "Home", path: "/" },
  { name: "Recipes", path: "/Recipes" },
  { name: "Sign In", path: "/SignIn" },
];

// Component for individual navigation items.
const NavItem = ({ item, onItemClick, isActive }) => {
  return (
    <li className="relative">
      <Link
        to={item.path}
        className={`px-3 py-2 text-sm font-semibold transition-colors ${
          isActive
            ? "text-rose-600 dark:text-rose-400"
            : "text-gray-800 dark:text-gray-200 hover:text-rose-500"
        }`}
        onClick={onItemClick}
      >
        <span className="relative">
          {item.name}
          {isActive && (
            <motion.span
              layoutId="nav-underline"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 rounded-full"
            />
          )}
        </span>
      </Link>
    </li>
  );
};

// The main NavBar component
const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Access user context
  const location = useLocation();
  const [logged, setLogged] = useState(false); // Track if user is logged in
  const [username, setUserName] = useState(""); // Store user's name
  const [navIsVisible, setNavIsVisible] = useState(false); // Manage mobile nav visibility
  const [navItems, setNavItems] = useState(loggedOutItems); // Dynamically adjust nav items based on login status

  
  // Effect hook to adjust nav items based on user login status
  useEffect(() => {
    if (user.name) {
      setNavItems(loggedInItems);
      setLogged(true);
      setUserName(user.name);
    } else {
      setNavItems(loggedOutItems);
      setLogged(false);
    }
  }, [user]);

  // Toggle visibility of mobile navigation
  const navVisibilityHandler = () => {
    setNavIsVisible((curState) => !curState);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("name"); // Remove user name from local storage
    navigate("/"); // Redirect to home page
    if (window.location.pathname === "/") {
      window.location.reload(); // Force reload if already on the home page
    }
  };

  // Variants for mobile menu animation
  const overlayVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const panelVariants = {
    hidden: { x: "100%" },
    show: { x: 0, transition: { type: "spring", stiffness: 260, damping: 30 } },
    exit: { x: "100%" },
  };

  const isPathActive = (path, name) => {
    const p = location.pathname;
    return (
      p === path ||
      ((p === "/A6" || p === "/A6-Final/" || p === "/A6-Final") && name === "Home")
    );
  };

  return (
    <section className="sticky top-0 left-0 right-0 z-50 mb-10">
      {/* gradient accent line */}
      <div className="h-1 bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500" />

      <header className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/60 ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-1">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent">
              Yummy
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  onItemClick={() => {}}
                  isActive={isPathActive(item.path, item.name)}
                />
              ))}
            </ul>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {logged && (
              <span className="hidden md:inline text-sm font-semibold text-gray-700 dark:text-gray-200">
                {username}
              </span>
            )}
            {logged && (
              <button
                className="hidden md:inline-flex items-center justify-center px-3 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-rose-400"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}

            {/* Mobile toggle */}
            <button
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400"
              aria-label="Toggle navigation menu"
              aria-expanded={navIsVisible}
              onClick={navVisibilityHandler}
            >
              {navIsVisible ? <AiOutlineClose className="w-6 h-6" /> : <AiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {navIsVisible && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={overlayVariants}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={navVisibilityHandler}
              aria-hidden
            />
            <motion.aside
              className="ml-auto h-full w-80 max-w-[85%] bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-6 flex flex-col"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={panelVariants}
            >
              <div className="flex items-center justify-between">
                <Link to="/" onClick={navVisibilityHandler} className="text-lg font-extrabold bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent">
                  Yummy
                </Link>
                <button
                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                  onClick={navVisibilityHandler}
                  aria-label="Close menu"
                >
                  <AiOutlineClose className="w-6 h-6" />
                </button>
              </div>

              <ul className="mt-6 space-y-1">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={navVisibilityHandler}
                      className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isPathActive(item.path, item.name)
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {logged && (
                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/10">
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">{username}</div>
                  <button
                    className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-rose-400"
                    onClick={() => {
                      navVisibilityHandler();
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NavBar;
