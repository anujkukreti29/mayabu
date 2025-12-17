import React from 'react';
import { IoClose } from 'react-icons/io5';

const SearchInput = ({
  searchValue,
  isSearching,
  isFocused,
  onFocus,
  onBlur,
  onChange,
  onKeyPress,
  onClear,
}) => {
  return (
    <div className="flex-1 relative flex items-center">
      <input
        type="text"
        value={searchValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        placeholder="Search for products (e.g., iPhone 15, Nike shoes)..."
        disabled={isSearching}
        autoComplete="off"
        className="flex-1 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-800  placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none bg-white disabled:opacity-70 disabled:cursor-not-allowed"
      />

      {/* Clear button */}
      {searchValue && !isSearching && (
        <button
          type="button"
          onClick={onClear}
          className="mr-3 md:mr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Clear search"
        >
          <IoClose size={20} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
