import React from "react";
import Welcome from "./container/Welcome"; 
import JoinUs from "./container/JoinUs";

const Home = () => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <Welcome />
      <JoinUs />
    </div>
  );
};

export default Home;