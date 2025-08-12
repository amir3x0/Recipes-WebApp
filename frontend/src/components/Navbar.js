import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
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
    <li className="relative group">
      <Link
        to={item.path}
        className={`px-4 py-2 font-bold text-lg ${
          isActive
            ? "text-red-800 dark:text-red-400"
            : "text-gray-900 dark:text-gray-200"
        } hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300`}
        onClick={onItemClick}
      >
        {item.name}
      </Link>
      <span className="cursor-pointer text-blue-500 absolute transition-all duration-500 right-0 top-0 group-hover:right-[90%] opacity-0 group-hover:opacity-100">
        /
      </span>
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

  return (
    <section
      className={`shadow-lg sticky top-0 left-0 right-0 z-50 mb-10 bg-white dark:bg-gray-800 dark:shadow-gray-700/50`}
    >
      <header className="container mx-auto px-5 flex justify-between py-4 items-center">
        <div className="text-2xl font-bold text-red-800 dark:text-red-400">
          Yu<span className="text-black dark:text-white">mm</span>y
        </div>

        {logged && (
          <div>
            <div className="font-bold text-xl text-red-800 dark:text-white">
              {username}
            </div>
          </div>
        )}

        <div className="lg:hidden z-50">
          {navIsVisible ? (
            <AiOutlineClose
              className="w-6 h-6"
              onClick={navVisibilityHandler}
            />
          ) : (
            <AiOutlineMenu className="w-6 h-6" onClick={navVisibilityHandler} />
          )}
        </div>

        <div
          className={`${
            navIsVisible ? "right-0" : "-right-full"
          } transition-all duration-300 mt-[56px] lg:mt-0 bg-dark-hard lg:bg-transparent z-[49] flex flex-col w-full lg:w-auto justify-center lg:justify-end lg:flex-row fixed top-0 bottom-0 lg:static gap-x-9 items-center`}
        >
          <ul className="text-white items-center gap-y-5 lg:text-dark-soft flex flex-col lg:flex-row gap-x-2 font-semibold">
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                onItemClick={navVisibilityHandler}
                isActive={
                  location.pathname === item.path ||
                  (location.pathname === "/A6" && item.name === "Home")
                }
              />
            ))}
          </ul>
        </div>

        {logged && (
          <div className="flex justify-center">
            <button
            className="bg-red-500 dark:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 dark:focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
            onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </header>
    </section>
  );
};

export default NavBar;
