import React from "react";
import { Link } from "react-router-dom";

// SignUpPage component is responsible for rendering the sign-up form.
const SignUpPage = () => (
  <div className="min-h-screen flex flex-col justify-center items-center">
    {/* Container for the form with maximum width set to ensure the form is not too wide on larger screens */}
    <div className="w-full max-w-xs">
      {/* Form section with rounded corners and shadow for depth */}
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Username field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="username" 
            type="text" 
            placeholder="Username" 
          />
        </div>
        
        {/* Email field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="email" 
            type="email" 
            placeholder="Email" 
          />
        </div>
        
        {/* Password field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
            id="password" 
            type="password" 
            placeholder="**********" 
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
            type="button">
            Sign Up
          </button>
          
          {/* Link to sign-in page for users who already have an account */}
          <Link 
            to="/signin" 
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  </div>
);

export default SignUpPage;
