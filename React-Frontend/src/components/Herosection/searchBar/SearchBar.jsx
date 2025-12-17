import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';
import { useSearch } from './useSearch';

const searchBarVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3,
    },
  },
};

const SearchBar = ({ onSearch }) => {
  const {
    searchValue,
    isSearching,
    isFocused,
    setIsFocused,
    suggestions,
    showSuggestions,
    selectedSuggestion,
    error,
    handleSearchChange,
    handleSearchSubmit,
    handleKeyPress,
    handleSuggestionClick,
    clearSearch,
  } = useSearch(onSearch);

  return (
    <motion.div
      className="w-full max-w-3xl mb-10 md:mb-6"
      variants={searchBarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Search Container */}
      <form
        onSubmit={handleSearchSubmit}
        className={`relative flex items-center bg-white  rounded-xl shadow-lg dark:shadow-slate-900/50 overflow-hidden border border-gray-200 dark:border-slate-700 transition-all duration-300 ${
          isFocused ? 'ring-2 ring-cyan-500 shadow-xl' : ''
        }`}
      >
        {/* Search Icon */}
        <div className="pl-4 md:pl-6 text-gray-400 dark:text-gray-500 pointer-events-none">
          <FiSearch size={20} />
        </div>

        {/* Search Input */}
        <SearchInput
          searchValue={searchValue}
          isSearching={isSearching}
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false);
            }, 150);
          }}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onClear={clearSearch}
        />

        {/* Search Button */}
        <button
          type="submit"
          disabled={isSearching}
          className="px-6 md:px-8 py-3 md:py-4 bg-cyan-500 dark:bg-cyan-600 hover:bg-cyan-600 dark:hover:bg-cyan-700 text-white font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-0"
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Searching...
            </span>
          ) : (
            'Search'
          )}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      <SearchSuggestions
        show={showSuggestions}
        suggestions={suggestions}
        selectedIndex={selectedSuggestion}
        onSuggestionClick={handleSuggestionClick}
      />

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-lg text-red-700 dark:text-red-300 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
