import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ALL_SUGGESTIONS = [
  'iPhone 15 Pro Max',
  'MacBook Pro 14"',
  'Sony WH-1000XM5',
  'Samsung 55" QLED',
  'iPad Air',
  'AirPods Pro',
  'Dell XPS 13',
  'OnePlus 12',
  'Canon EOS R5',
  'DJI Air 3S',
];

export const useSearch = (onSearch) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [error, setError] = useState(null);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setSelectedSuggestion(-1);
    setError(null);

    if (value.trim().length > 0) {
      const filtered = ALL_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchValue.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);
    setError(null);

    try {
      console.log('🔍 Searching for:', searchValue);
      console.log('📡 API URL:', API_URL);

      // Send query to parent component
      onSearch({
        query: searchValue,
        results: null, // ProductPage will fetch
      });
    } catch (err) {
      console.error('❌ Search error:', err);

      let errorMsg = 'Search failed. ';
      if (err.code === 'ECONNREFUSED') {
        errorMsg += 'Backend not running. Start FastAPI on port 8000';
      } else if (err.response?.status === 404) {
        errorMsg += 'API endpoint not found. Check backend.';
      } else if (err.response?.status === 500) {
        errorMsg += 'Backend error. Check server logs.';
      } else if (err.code === 'ENOTFOUND') {
        errorMsg += 'Cannot reach server at ' + API_URL;
      } else if (err.message === 'timeout of 60000ms exceeded') {
        errorMsg += 'Request timeout. Backend might be slow.';
      } else {
        errorMsg += err.message;
      }

      setError(errorMsg);
      onSearch({
        query: searchValue,
        results: [],
        error: errorMsg,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);

    // Auto-search after selecting suggestion
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }, 100);
  };

  const clearSearch = () => {
    setSearchValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
  };

  return {
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
  };
};
