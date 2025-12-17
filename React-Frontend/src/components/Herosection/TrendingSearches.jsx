import React from 'react';
import { motion } from 'framer-motion';

const TrendingSearches = () => {
  const TRENDING = ['iPhone 15', 'MacBook Pro', 'Sony Headphones', 'Samsung TV'];

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

  const handleTrendingClick = (trend) => {
    const input = document.querySelector('input[type="text"]');
    if (input) {
      input.value = trend;
      input.focus();
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-4 mt-2"
      variants={itemVariants}
    >
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Trending:
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {TRENDING.map((trend, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => handleTrendingClick(trend)}
            className="px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-cyan-400/50 dark:border-cyan-500/50 text-cyan-600 dark:text-cyan-300 text-xs md:text-sm font-medium hover:bg-cyan-400/10 dark:hover:bg-cyan-400/20 bg-cyan-400/5 dark:bg-cyan-900/20 transition-all duration-200"
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(50, 184, 198, 0.8)',
              backgroundColor: 'rgba(50, 184, 198, 0.15)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            {trend}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default TrendingSearches;
