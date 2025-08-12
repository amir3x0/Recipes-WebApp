import React from "react";
import { useNavigate } from "react-router-dom";

import pastaImage from "../home_img/pasta.png";
import hamburgerImage from "../home_img/hamburger.png";
import healthyImage from "../home_img/Healthy.jpg";
import hungryImage from "../home_img/HungryHungry.jpg";
import shakshukaImage from "../home_img/shakshuka.png";
import toastImage from "../home_img/toast.png";
import hummusImage from "../home_img/hummus.png";
import shrimpImage from "../home_img/shrimp.png";
import snailsImage from "../home_img/snails.png";

function Welcome() {
  document.title = "Home";
  const navigate = useNavigate();

  const images = [
    pastaImage,
    hamburgerImage,
    healthyImage,
    hungryImage,
    shakshukaImage,
    toastImage,
    hummusImage,
    shrimpImage,
    snailsImage,
  ];

  // Calculate animation delay based on the specified order
  const getAnimationDelay = (index) => {
    const sequence = [0, 0.2, 0.4, 0.2, 0.4, 0.6, 0.4, 0.6, 0.8];
    return sequence[index] * 0.5;
  };

  const gotoRecipes = () => {
    navigate("/Recipes");
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg flex flex-col md:flex-row items-center max-w-6xl mx-auto px-10 py-10 text-gray-700 dark:text-gray-200 font-serif">
      {/* Info Section */}
      <div className="text-2xl md:w-1/2 font-bold pr-7 animate-fadeIn text-center md:text-left">
        <h1 className="text-5xl text-red-800 dark:text-red-400 mb-6 pt-10">
          Welcome!
        </h1>
        <p className="my-14">
          You can search and explore many kinds of recipes here including the
          required ingredients and their nutritional properties. Have fun
          exploring. You can select any of the desire tabs to start.
        </p>
        <p className="mb-16">
          <span className="text-red-800 dark:text-red-400">
            Popular Recipe:
          </span>{" "}
          Homemade Shakshuka for 5 people.
        </p>
        <p className="mb-4 pb-10">
          This website was created by Amir, Dana, Lital, and Michael.
        </p>

        <div className="flex justify-center">
          <button
            className="bg-red-800 dark:bg-red-700 text-white text-xl rounded-lg hover:-translate-y-1 px-6 py-3 font-semibold hover:bg-orange-600 dark:hover:bg-orange-700 transition duration-300"
            onClick={gotoRecipes}
          >
            Explore Now
          </button>
        </div>
      </div>

      {/* Images Section */}
      <div className="w-full md:w-1/2 grid grid-cols-3 gap-4 mt-10">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Recipe ${index}`}
            className={`w-full h-16 md:h-44 object-cover rounded-3xl animate-fadeIn opacity-0`}
            style={{ animationDelay: `${getAnimationDelay(index)}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default Welcome;
