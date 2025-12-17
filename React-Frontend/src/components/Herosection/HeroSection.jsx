import React from 'react';
import { motion } from 'framer-motion';

import HeroContent from './HeroContent';
import SearchBar from './searchBar/SearchBar';
import TrendingSearches from './TrendingSearches';

const HeroSection = ({ onSearch }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="relative pt-8 w-full min-h-screen bg-gradient-to-br bg-white dark:from-slate-900 dark:via-cyan-900 dark:to-slate-900 overflow-hidden">
      {/* Background decorative elements */}
  

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-8 py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title, subtitle, badge */}
        <HeroContent />

        {/* Search bar - the most important component */}
        <SearchBar onSearch={onSearch} />
      

        {/* Trending searches */}
        <TrendingSearches />
      </motion.div>
    </div>
  );
};

export default HeroSection;
