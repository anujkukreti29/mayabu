import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import ProductGrid from '../components/Product/ProductGrid';
import SearchHeader from '../components/Product/SearchHeader';
import FilterSidebar from '../components/Product/FilterSidebar';
import ProductDetailModal from '../components/Product/ProductDetailModal';
import LoadingSkeletons from '../components/Product/LoadingSkeletons';
import NoResults from '../components/Product/NoResults';

// ✅ Helper: Extract numeric price from string like "₹51,999"
const extractPrice = (priceStr) => {
  if (!priceStr || priceStr === 'N/A') return 0;
  const cleaned = String(priceStr).replace(/[₹,\s]/g, '').trim();
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
};

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 300000],
    platforms: ['amazon', 'flipkart', 'croma', 'reliancedigital'],
    rating: 0,
    sort: 'relevance',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    if (!query) {
      setProducts([]);
      setFilteredProducts([]);
      setLoading(false);
      return;
    }

    fetchProducts();
  }, [query]);

  // ✅ FIXED: Call new /api/compare endpoint with correct params
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    const cleanQuery = query.trim().replace(/\s+/g, ' ').slice(0, 100);
    
    if (cleanQuery.length < 2) {
      console.log('❌ Query too short:', cleanQuery);
      setProducts([]);
      setFilteredProducts([]);
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 Fetching from backend:', cleanQuery);
      
      // ✅ FIXED: Use /api/compare endpoint with limit param
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/compare?query=${encodeURIComponent(query)}&limit=10`

      );
      
      if (!response.ok) {
        const text = await response.text();
        console.error('❌ API error', response.status, text);
        throw new Error(`API ${response.status}: ${text}`);
      }
      
      const data = await response.json();
      console.log('✅ Backend response:', data);
      console.log('✅ Results count:', data.results?.length || 0);
      
      if (!data.results || data.results.length === 0) {
        console.log('ℹ️ No results from backend');
        setProducts([]);
        setFilteredProducts([]);
        return;
      }
      
      // ✅ TRANSFORM: Backend returns {flipkart: {...}, amazon: {...}} structure
      // Frontend expects flipkart_price, amazon_price numeric fields
      const transformedResults = data.results.map((result, idx) => {
        const flipkart_price = extractPrice(result.flipkart?.currentPrice || result.flipkart?.price);
        const amazon_price = extractPrice(result.amazon?.currentPrice || result.amazon?.price);
        const croma_price = extractPrice(result.croma?.currentPrice || result.croma?.price);
        const reliancedigital_price = extractPrice(result.reliancedigital?.currentPrice || result.reliancedigital?.price);
        
        console.log(`Product ${idx}:`, { flipkart_price, amazon_price, croma_price, reliancedigital_price });
        
        return {
          ...result, // Keep all original data (flipkart, amazon, croma, reliancedigital objects)
          // Add numeric price fields for filtering
          flipkart_price,
          amazon_price,
          croma_price,
          reliancedigital_price,
        };
      });
      
      console.log('✅ Transformed products:', transformedResults.length);
      setProducts(transformedResults);
      applyFilters(transformedResults, filters);
    } catch (err) {
      console.error('❌ Search error:', err);
      setError(err.message);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to products
  const applyFilters = (productsToFilter, currentFilters) => {
    console.log('🎯 Filtering', productsToFilter.length, 'products');
    
    let filtered = productsToFilter;

    // Price filter
    filtered = filtered.filter((product) => {
      const prices = [
        product.flipkart_price || 0,
        product.amazon_price || 0,
        product.croma_price || 0,
        product.reliancedigital_price || 0,
      ].filter((p) => p > 0);
      
      if (prices.length === 0) return false;
      
      const minPrice = Math.min(...prices);
      return (
        minPrice >= currentFilters.priceRange[0] &&
        minPrice <= currentFilters.priceRange[1]
      );
    });

    // Platform filter
    filtered = filtered.filter((product) => {
      const availablePlatforms = [];
      if ((product.flipkart_price || 0) > 0) availablePlatforms.push('flipkart');
      if ((product.amazon_price || 0) > 0) availablePlatforms.push('amazon');
      if ((product.croma_price || 0) > 0) availablePlatforms.push('croma');
      if ((product.reliancedigital_price || 0) > 0) availablePlatforms.push('reliancedigital');
      
      if (availablePlatforms.length === 0) return false;
      return availablePlatforms.some((p) => currentFilters.platforms.includes(p));
    });

    // Rating filter
    if (currentFilters.rating > 0) {
      filtered = filtered.filter((product) => {
        const rating = parseFloat(product.flipkart?.rating || 0);
        return rating >= currentFilters.rating;
      });
    }

    // Sort
    if (currentFilters.sort === 'price_low') {
      filtered.sort((a, b) => {
        const pricesA = [a.flipkart_price, a.amazon_price, a.croma_price, a.reliancedigital_price].filter((p) => p > 0);
        const pricesB = [b.flipkart_price, b.amazon_price, b.croma_price, b.reliancedigital_price].filter((p) => p > 0);
        const minA = pricesA.length ? Math.min(...pricesA) : Infinity;
        const minB = pricesB.length ? Math.min(...pricesB) : Infinity;
        return minA - minB;
      });
    } else if (currentFilters.sort === 'price_high') {
      filtered.sort((a, b) => {
        const pricesA = [a.flipkart_price, a.amazon_price, a.croma_price, a.reliancedigital_price].filter((p) => p > 0);
        const pricesB = [b.flipkart_price, b.amazon_price, b.croma_price, b.reliancedigital_price].filter((p) => p > 0);
        const maxA = pricesA.length ? Math.max(...pricesA) : 0;
        const maxB = pricesB.length ? Math.max(...pricesB) : 0;
        return maxB - maxA;
      });
    } else if (currentFilters.sort === 'rating') {
      filtered.sort((a, b) => {
        const ratingA = parseFloat(a.flipkart?.rating || 0);
        const ratingB = parseFloat(b.flipkart?.rating || 0);
        return ratingB - ratingA;
      });
    }

    console.log('🎯 After filters:', filtered.length, 'products');
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(products, newFilters);
  };

  const handleNewSearch = (newQuery) => {
    window.location.href = `/products?q=${encodeURIComponent(newQuery)}`;
  };

  return (
    <div className="min-h-screen mt-5 pt-8 bg-gradient-to-b bg-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      <Navbar />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 w-full"
      >
        {/* Search Header */}
        <SearchHeader query={query} onSearch={handleNewSearch} />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300`}
            >
              {sidebarOpen && (
                <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
              )}
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex-1"
            >
              {/* Results Info */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Search Results for "{query}"
                  </h1>
                  <p className="text-gray-500 dark:text-slate-400 mt-1">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 text-slate-900 bg-amber-400 hover:bg-amber-500 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white rounded-lg transition-colors"
                >
                  {sidebarOpen ? 'Hide' : 'Show'} Filters
                </button>
              </div>

              {/* Loading State */}
              {loading && <LoadingSkeletons />}

              {/* Error State */}
              {error && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 dark:text-red-400 text-red-700"
                >
                  Error: {error}
                </motion.div>
              )}

              {/* No Results */}
              {!loading && !error && filteredProducts.length === 0 && <NoResults query={query} />}

              {/* Products Grid */}
              {!loading && !error && filteredProducts.length > 0 && (
                <ProductGrid
                  products={filteredProducts}
                  onSelectProduct={setSelectedProduct}
                />
              )}
            </motion.div>
          </div>
        </div>
      </motion.main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;