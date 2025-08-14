import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      const response = await registerNewUser(name, email, username, password);
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
  <section className="relative max-w-6xl mx-auto px-4 my-16">
      {/* accent line */}
      <div className="absolute inset-x-0 -top-3 h-1 bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 rounded-full blur-[1px]" aria-hidden="true" />

      <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-start gap-8 p-6 md:p-10">
          {/* Image Section */}
          <div className="flex-1 flex items-center justify-center">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Sign"
                className="w-48 md:w-60 lg:w-64 xl:w-72 rounded-full ring-1 ring-black/5 dark:ring-white/10"
                loading="lazy"
              />
            ))}
          </div>

          {/* Content Section */}
          <div className="flex-1 text-center md:text-left dark:text-gray-200">
            <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent">
              Join The Fatties!
            </h2>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">Why, you ask?</p>

            <div className="mt-6 space-y-3">
              {reasons.map((item, index) => (
                <div key={index} className="pl-4 border-l-4 border-rose-500/60">
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-semibold">{item}</p>
                </div>
              ))}
            </div>

      <div className="mt-6 flex justify-center md:justify-start">
              <button
                onClick={() => setShowForm((s) => !s)}
        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                {showForm ? "Hide Form" : "Sign Up"}
              </button>
            </div>

            {/* Sign Up Section */}
            <AnimatePresence initial={false}>
              {showForm && (
                <motion.div
                  key="signup"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 rounded-2xl p-5">
                    <div className="text-rose-600 dark:text-rose-400 font-bold text-base mb-3">
                      Enter Info
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => handleInputChange(e, setName)}
                        className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => handleInputChange(e, setEmail)}
                        className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="User Name"
                        value={username}
                        onChange={(e) => handleInputChange(e, setUsername)}
                        className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                        required
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handleInputChange(e, setPassword)}
                        className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                        minLength={6}
                        required
                      />
                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-rose-400"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                    {submitMessage && (
                      <p
                        className={`mt-4 text-sm font-semibold ${
                          submitMessage === "Failed to create user."
                            ? "text-red-500"
                            : submitMessage === "User already exists."
                            ? "text-yellow-500"
                            : "text-green-600"
                        }`}
                      >
                        {submitMessage}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
