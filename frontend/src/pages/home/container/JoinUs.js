import React, { useState } from "react";
import sign from "../home_img/sign.png";
import { registerNewUser } from "../../../services/BackendService";

/**
 * The JoinUs component renders a section inviting users to join a community
 * called "The Fatties". It displays reasons to join and a form to sign up.
 */
export default function JoinUs() {
  // State variables for form input fields and submission message
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitMessage, setSubmitMessage] = useState(false);

  // Images and reasons to join
  const images = [sign];
  const reasons = [
    "Worldwide Contribution.",
    "Verified by the people.",
    "2 is plenty.",
  ];

  // Function to handle input change for form fields
  const handleInputChange = (e, setter) => setter(e.target.value);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Call backend service to register new user
      const response = registerNewUser(name, email, username, password);
      if (response) {
        setSubmitMessage("User Created!");
      } else {
        setSubmitMessage("User already exists.");
      }
    } catch (e) {
      setSubmitMessage("Failed to create user.");
    }
  };

  // JSX for rendering the JoinUs component
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-36 p-8 my-20 animate-fadeIn rounded-lg dark:bg-gray-800">
      {/* Image Section */}
      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="Sign"
            className="w-48 md:w-64 lg:w-80 xl:w-96 rounded-full"
          />
        ))}
      </div>

      {/* Content Section */}
      <div className="text-center md:text-left md:pl-4 font-bold dark:text-gray-200">
        <h1 className="text-4xl text-red-800 dark:text-red-400 mb-4">
          Join The Fatties!
        </h1>
        <p className="text-3xl text-gray-700 dark:text-gray-300">
          Why, you ask? <br />
        </p>

        {reasons.map((item, index) => (
          <div
            key={index}
            className="mb-3 pl-4 border-l-4 border-red-800 dark:border-red-400"
          >
            <p className="text-2xl text-gray-600 dark:text-gray-300">{item}</p>
          </div>
        ))}

        <div className="flex justify-center">
          <button
            onClick={() => setShowForm(!showForm)} // Toggle form visibility
            className="bg-red-800 hover:bg-red-600 text-white text-xl rounded-lg px-8 py-3 my-5 font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Sign Up
          </button>
        </div>

        {/* Sign Up Section */}
        {showForm && (
          <div className="mt-5 mx-auto transition-all duration-500 transform origin-top bg-white dark:bg-gray-700 shadow-md rounded-lg p-6">
            <div className="text-red-800 dark:text-red-400 font-bold text-xl mb-5 border-b-4">
              Enter Info
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => handleInputChange(e, setName)}
                className="input border-2 border-gray-300 rounded-lg p-2 w-full"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => handleInputChange(e, setEmail)}
                className="input border-2 border-gray-300 rounded-lg p-2 w-full"
              />
              <input
                type="text"
                placeholder="User Name"
                value={username}
                onChange={(e) => handleInputChange(e, setUsername)}
                className="input border-2 border-gray-300 rounded-lg p-2 w-full"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => handleInputChange(e, setPassword)}
                className="input border-2 border-gray-300 rounded-lg p-2 w-full"
              />
              <button
                type="submit"
                className="bg-red-800 hover:bg-red-600 text-white text-lg rounded-lg px-4 py-2 mt-4 font-semibold transition duration-300"
              >
                Submit
              </button>
            </form>
            {submitMessage && (
              <p
                className={`flex justify-center font-bold mt-5 ${
                  submitMessage === "Failed to login."
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {submitMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
