import React from 'react';
import { motion } from 'framer-motion';

const HeroContent = () => {
  const itemVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="mb-12 md:mb-16 text-center max-w-4xl mx-auto">

      {/* Main heading */}
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
        variants={itemVariants}
      >
        Find the Best Prices{' '}
        <span className="bg-gradient-to-br from-orange-400 to-orange-700 dark:from-cyan-300 dark:to-cyan-500 bg-clip-text text-transparent">
          Across All
        </span>{' '}
        E-Commerce Platforms
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4"
        variants={itemVariants}
      >
        Compare prices instantly across Amazon, Flipkart, Croma & Reliance Digital.
      </motion.p>

      <motion.p
        className="text-base md:text-lg text-gray-500 dark:text-gray-400"
        variants={itemVariants}
      >
        Save money on every purchase with intelligent real-time price comparisons.
      </motion.p>
    </div>
  );
};

export default HeroContent;
