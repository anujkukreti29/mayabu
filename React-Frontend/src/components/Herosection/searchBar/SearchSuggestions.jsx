import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const SearchSuggestions = ({
  show,
  suggestions,
  selectedIndex,
  onSuggestionClick,
}) => {
  const suggestionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  if (!show || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl dark:shadow-slate-900/50 border border-gray-200 dark:border-slate-700 overflow-hidden z-50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => onSuggestionClick(suggestion)}
            className={`w-full px-4 md:px-6 py-3 text-left text-sm md:text-base transition-all flex items-center justify-between group border-b border-gray-100 dark:border-slate-700 last:border-b-0 ${
              selectedIndex === index
                ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'
            }`}
            variants={suggestionVariants}
            whileHover={{ paddingLeft: 28 }}
          >
            <span>{suggestion}</span>
            <FiArrowRight
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              size={16}
            />
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchSuggestions;
