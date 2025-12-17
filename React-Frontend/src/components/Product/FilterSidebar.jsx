import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown, FiRotateCcw } from 'react-icons/fi';

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    platforms: true,
    rating: false,
    sort: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (value) => {
    onFilterChange({
      ...filters,
      priceRange: value,
    });
  };

  const handlePlatformToggle = (platform) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];

    onFilterChange({
      ...filters,
      platforms: newPlatforms,
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      rating,
    });
  };

  const handleSortChange = (sort) => {
    onFilterChange({
      ...filters,
      sort,
    });
  };

  const handleReset = () => {
    onFilterChange({
      priceRange: [0, 300000],
      platforms: ['amazon', 'flipkart', 'croma', 'reliancedigital'],
      rating: 0,
      sort: 'relevance',
    });
  };

  const platformOptions = [
    { id: 'flipkart', label: 'Flipkart', color: 'from-blue-600 to-blue-500' },
    { id: 'amazon', label: 'Amazon', color: 'from-orange-600 to-orange-500' },
    { id: 'croma', label: 'Croma', color: 'from-red-600 to-red-500' },
    { id: 'reliancedigital', label: 'Reliance Digital', color: 'from-purple-600 to-purple-500' },
  ];

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4, label: '4★ & Above' },
    { value: 3, label: '3★ & Above' },
    { value: 2, label: '2★ & Above' },
    { value: 1, label: '1★ & Above' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="dark:bg-slate-800/50 bg-white backdrop-blur-md rounded-2xl p-6 border dark:border-slate-700 sticky top-32 space-y-6"
    >
      {/* Header with Reset */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold dark:text-white">Filters</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="dark:text-slate-400 hover:text-gray-500 dark:hover:text-white transition-colors"
          title="Reset filters"
        >
          <FiRotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Price Range */}
      <motion.div
        initial={false}
        animate={{ opacity: expandedSections.price ? 1 : 0.7 }}
      >
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full dark:text-white dark:hover:text-blue-400 transition-colors group"
        >
          <span className="font-semibold">Price Range</span>
          <motion.div
            animate={{ rotate: expandedSections.price ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {expandedSections.price && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            <input
              type="range"
              min="0"
              max="300000"
              step="5000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange([filters.priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-blue-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer dark:accent-blue-500"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="dark:text-slate-400">₹0</span>
              <span className="dark:text-blue-400 font-semibold">
                ₹{filters.priceRange[1].toLocaleString()}
              </span>
              <span className="dark:text-slate-400">₹3L</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Platforms */}
      <motion.div
        initial={false}
        animate={{ opacity: expandedSections.platforms ? 1 : 0.7 }}
      >
        <button
          onClick={() => toggleSection('platforms')}
          className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
        >
          <span className="font-semibold">Platforms</span>
          <motion.div
            animate={{ rotate: expandedSections.platforms ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {expandedSections.platforms && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3"
          >
            {platformOptions.map((platform) => (
              <motion.label
                key={platform.id}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.platforms.includes(platform.id)}
                  onChange={() => handlePlatformToggle(platform.id)}
                  className="w-4 h-4 rounded dark:accent-blue-500 cursor-pointer"
                />
                <span className={`text-sm font-medium bg-gradient-to-r ${platform.color} bg-clip-text text-transparent group-hover:opacity-80`}>
                  {platform.label}
                </span>
              </motion.label>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Rating */}
      <motion.div
        initial={false}
        animate={{ opacity: expandedSections.rating ? 1 : 0.7 }}
      >
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full dark:text-white dark:hover:text-blue-400 transition-colors"
        >
          <span className="font-semibold">Rating</span>
          <motion.div
            animate={{ rotate: expandedSections.rating ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {expandedSections.rating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-2"
          >
            {ratingOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ x: 4 }}
                onClick={() => handleRatingChange(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  filters.rating === option.value
                    ? 'dark:bg-blue-600 bg-indigo-500 text-white'
                    : 'dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700/50'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Sort */}
      <motion.div
        initial={false}
        animate={{ opacity: expandedSections.sort ? 1 : 0.7 }}
      >
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full dark:text-white dark:hover:text-blue-400 transition-colors"
        >
          <span className="font-semibold">Sort By</span>
          <motion.div
            animate={{ rotate: expandedSections.sort ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {expandedSections.sort && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-2"
          >
            {sortOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ x: 4 }}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  filters.sort === option.value
                    ? 'dark:bg-blue-600 dark:text-white bg-indigo-500 text-white'
                    : 'dark:text-slate-300 dark:hover:bg-slate-700/50 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FilterSidebar;