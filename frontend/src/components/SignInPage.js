import React, { useState } from "react";
import { authenticateUser } from "../services/BackendService";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// SignInPage component receives an optional onSignIn callback prop, allowing for additional actions upon user sign-in.
const SignInPage = ({ onSignIn }) => {
  const { setUser } = useUser(); // Using the user context to manage user state.
  const navigate = useNavigate(); // Hook for programmatically navigating between routes.
  const [username, setUsername] = useState(""); // State to hold username input.
  const [password, setPassword] = useState(""); // State to hold password input.
  const [errorMessage, setErrorMessage] = useState(""); // State to hold any error messages from login attempts.

  // Handler function for form submission.
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior.
    const userData = await authenticateUser(username, password); // Attempt to authenticate the user.
    if (userData) {
      setUser(userData); // Update user state upon successful authentication.
      // Optional: Store user data or token in localStorage or a secure storage solution.
      navigate("/MyYummy"); // Navigate the user to a protected route upon successful login.
      if (onSignIn) onSignIn(); // Call the onSignIn callback, if provided.
    } else {
      setErrorMessage("Login failed. Please try again."); // Set an error message if authentication fails.
    }
  };

  // JSX markup for the sign-in form, including input fields for username and password, and a submit button.
  return (
    <form
      onSubmit={handleLogin} // Form submission handler.
      className="max-w-lg mx-auto my-10 p-6 bg-white rounded shadow-md" // Styling for the form.
    >
      {/* Username input field */}
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state on change.
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your Username"
        />
      </div>

      {/* Password input field */}
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on change.
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="******************"
        />
      </div>

      {/* Login button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </div>

      {/* Error message display */}
      {errorMessage && (
        <div className="text-center">
          <p className="text-red-500 text-xs italic mt-4">{errorMessage}</p>
        </div>
      )}
    </form>
  );
};

export default SignInPage;
