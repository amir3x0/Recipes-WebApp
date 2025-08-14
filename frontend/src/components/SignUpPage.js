import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { registerNewUser } from "../services/BackendService";

// SignUpPage component is responsible for rendering the sign-up form.
const SignUpPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      const ok = await registerNewUser(name, email, username, password);
      setMessage(ok ? "Account created! You can sign in now." : "User already exists.");
    } catch (e) {
      setMessage("Failed to create user.");
    }
    setIsSubmitting(false);
  };

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
            Create account
          </h1>
          <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-300">
            Join the community
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" placeholder="Your name" required />
            </div>
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Username</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" placeholder="Choose a username" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" placeholder="••••••••" minLength={6} required />
            </div>

            {message && (
              <p className={`text-sm ${message.startsWith("Account created") ? "text-green-600" : message === "User already exists." ? "text-yellow-600" : "text-rose-500"}`}>
                {message}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:opacity-60">
              {isSubmitting ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/SignIn" className="font-semibold text-rose-600 dark:text-rose-400 hover:underline">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SignUpPage;
