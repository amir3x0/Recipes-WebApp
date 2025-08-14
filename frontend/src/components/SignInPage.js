import React, { useState } from "react";
import { authenticateUser } from "../services/BackendService";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";

// SignInPage component receives an optional onSignIn callback prop, allowing for additional actions upon user sign-in.
const SignInPage = ({ onSignIn }) => {
  const { setUser } = useUser(); // Using the user context to manage user state.
  const navigate = useNavigate(); // Hook for programmatically navigating between routes.
  const [username, setUsername] = useState(""); // State to hold username input.
  const [password, setPassword] = useState(""); // State to hold password input.
  const [errorMessage, setErrorMessage] = useState(""); // State to hold any error messages from login attempts.
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handler function for form submission.
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior.
    setIsLoading(true);
    setErrorMessage("");
    const userData = await authenticateUser(username, password); // Attempt to authenticate the user.
    if (userData) {
      setUser(userData); // Update user state upon successful authentication.
      navigate("/MyYummy");
      if (onSignIn) onSignIn();
    } else {
      setErrorMessage("Login failed. Please try again.");
    }
    setIsLoading(false);
  };

  // JSX markup for the sign-in form, including input fields for username and password, and a submit button.
  return (
    <section className="max-w-md mx-auto my-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl overflow-hidden"
      >
        <div className="px-6 py-7">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent text-center">
            Welcome back
          </h1>
          <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-300">
            Sign in to continue
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Your username"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 px-2 text-xs text-gray-600 dark:text-gray-300"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-rose-500 text-sm">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-600 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link to="/SignUp" className="font-semibold text-rose-600 dark:text-rose-400 hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SignInPage;
