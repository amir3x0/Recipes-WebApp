import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const gridVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const tileVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 8 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35 } },
  };

  const gotoRecipes = () => {
    navigate("/Recipes");
  };

  return (
    <section className="relative">
      {/* top accent line */}
      <div className="absolute inset-x-0 -top-2 h-1 bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 rounded-full blur-[1px]" aria-hidden="true" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-6xl mx-auto px-4 py-10 md:py-12"
      >
        <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur ring-1 ring-black/5 dark:ring-white/10 shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 md:p-10 text-gray-700 dark:text-gray-200">
            {/* Info Section */}
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent">
                Welcome!
              </h1>
              <p className="mt-5 text-sm md:text-base leading-7 text-gray-600 dark:text-gray-300">
                You can search and explore many kinds of recipes here including the required ingredients and their nutritional properties. Have fun exploring. You can select any of the desired tabs to start.
              </p>
              <p className="mt-5 text-sm md:text-base">
                <span className="font-semibold text-rose-600 dark:text-rose-400">Popular Recipe:</span> Homemade Shakshuka for 5 people.
              </p>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                This website was created by Amir, Dana, Lital, and Michael.
              </p>

              <div className="mt-6 flex justify-center md:justify-start">
                <button
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-rose-400"
                  onClick={gotoRecipes}
                >
                  Explore Now
                </button>
              </div>
            </div>

            {/* Images Section */}
            <motion.div
              variants={gridVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
      className="w-full md:w-1/2 grid grid-cols-3 gap-2 md:gap-3"
            >
              {images.map((src, index) => (
                <motion.div
                  key={index}
                  variants={tileVariants}
                  whileHover={{ y: -4, rotate: [0, -1, 1, 0], transition: { duration: 0.4 } }}
                  className="overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-gray-100 dark:bg-gray-800"
                >
                  <img
                    src={src}
        alt={`Recipe ${index + 1}`}
        className="w-full h-16 md:h-36 object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Welcome;
