import React, { createContext, useContext, useState } from 'react';

// Creating a context for user information to be accessible throughout the application.
const UserContext = createContext();

// UserProvider is a component that will wrap around parts of our app we want to provide this context to.
export const UserProvider = ({ children }) => {
  // Initializing user state with a default theme. This is just an example and can include more user details.
  const [user, setUser] = useState({ theme: 'light' });

  // Function to update user details. It takes updates (an object) and merges them with the current user state.
  const updateUser = (updates) => {
    setUser((currentUser) => ({ ...currentUser, ...updates }));
  };

  // The value that will be provided to the components that consume this context.
  // This includes the user object, the setUser function to directly update the user state,
  // and the updateUser function for more controlled updates.
  const value = { user, setUser, updateUser };

  // The context provider that passes down the user state and updater functions to its children.
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context. This makes consuming the context easier and cleaner.
export const useUser = () => useContext(UserContext);
