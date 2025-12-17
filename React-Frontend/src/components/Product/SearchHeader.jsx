import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SearchHeader = ({ query, onSearch }) => {
  const [searchInput, setSearchInput] = React.useState(query);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r bg-white border-gray-400 dark:from-slate-800 dark:to-slate-900 border-b dark:border-slate-700 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Find Best Prices</h1>

        <form onSubmit={handleSearch} className="relative">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-6 py-4 bg-gray-50 dark:bg-white/10 backdrop-blur-md border dark:border-white/20 rounded-2xl dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none dark:focus:border-blue-500 dark:focus:bg-white/15 transition-all duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="absolute right-3 bg-gradient-to-r dark:from-blue-600 dark:to-blue-500 dark:hover:from-blue-700 dark:hover:to-blue-600 dark:text-white p-2 rounded-xl transition-all flex items-center justify-center"
            >
              <FiSearch className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </form>

        <div className="mt-4 flex items-center gap-2 dark:text-slate-400 text-sm">
          <span>💡 Tip: Search for products like "iPhone 15", "Laptop", "Headphones"</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchHeader;