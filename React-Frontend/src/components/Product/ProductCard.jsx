import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiTrendingDown, FiExternalLink } from 'react-icons/fi';

const ProductCard = ({ product, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  // Extract prices
  const prices = {
    flipkart: product.flipkart_price || 0,
    amazon: product.amazon_price || 0,
    croma: product.croma_price || 0,
    reliancedigital: product.reliancedigital_price || 0,
  };

  const validPrices = Object.entries(prices)
    .filter(([_, price]) => price > 0)
    .map(([platform, price]) => ({ platform, price }));

  const minPrice = Math.min(...validPrices.map((p) => p.price));
  const maxPrice = Math.max(...validPrices.map((p) => p.price));
  const savings = maxPrice - minPrice;
  const savingsPercent = ((savings / maxPrice) * 100).toFixed(1);
  const cheapestPlatform = validPrices.find((p) => p.price === minPrice)?.platform;

  const getRating = () => {
    const flipkartRating = product.flipkart?.rating;
    if (flipkartRating) {
      return parseFloat(flipkartRating) || 0;
    }
    return 0;
  };

  const getImage = () => {
    return (
      product.flipkart?.image ||
      product.amazon?.image ||
      product.croma?.image ||
      product.reliancedigital?.image ||
      'https://via.placeholder.com/300x300?text=No+Image'
    );
  };

  const platformColors = {
    flipkart: 'from-blue-600 to-blue-500',
    amazon: 'from-orange-600 to-orange-500',
    croma: 'from-red-600 to-red-500',
    reliancedigital: 'from-purple-600 to-purple-500',
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5rgba(0, 0, 0, 0.5)' }}
      className="relative bg-gradient-to-br bg-white dark:hover:bg-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl overflow-hidden border dark:border-slate-600/50 dark:hover:border-slate-500 transition-all duration-300 h-full flex flex-col group"
    >
      {/* Image Container */}
      <motion.div
        className="relative h-56 bg-white dark:bg-slate-900 overflow-hidden object-cover border-2 border-white m-2 dark:border-slate-900 rounded-xl"
      >
        <img
          src={getImage()}
          alt={product.flipkart?.title || 'Product'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />

        {/* Savings Badge */}
        {savings > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3 left-3 bg-gradient-to-r bg-white from-red-600 to-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
          >
            Save {savingsPercent}%
          </motion.div>
        )}

        {/* Rating Badge */}
        {getRating() > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <FiStar className="w-3 h-3" />
            {getRating()}/5
          </motion.div>
        )}

        {/* Platform Count Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileHover={{ scale: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute bottom-3 right-3 dark:bg-slate-900/90 backdrop-blur-sm dark:text-white px-3 py-1 rounded-lg text-xs font-semibold"
        >
          {validPrices.length} platform{validPrices.length > 1 ? 's' : ''}
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Title */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 mb-3">
            {product.flipkart?.title || product.amazon?.title || 'Product'}
          </h3>

          {/* Platform Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {validPrices.map(({ platform }) => (
              <motion.span
                key={platform}
                whileHover={{ scale: 1.05 }}
                className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${platformColors[platform]} text-white`}
              >
                {platform === 'reliancedigital'
                  ? 'Reliance'
                  : platform.charAt(0).toUpperCase() + platform.slice(1)}
              </motion.span>
            ))}
          </div>

          {/* Price Comparison */}
          <div className="space-y-2 mb-4">
            {product.flipkart_price > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center text-sm"
              >
                <span className="dark:text-slate-400">Flipkart</span>
                <span className="dark:text-white font-bold">
                  ₹{product.flipkart_price.toLocaleString()}
                </span>
              </motion.div>
            )}
            {product.amazon_price > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="flex justify-between items-center text-sm"
              >
                <span className="dark:text-slate-400">Amazon</span>
                <span className="dark:text-white font-bold">
                  ₹{product.amazon_price.toLocaleString()}
                </span>
              </motion.div>
            )}
            {product.croma_price > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between items-center text-sm"
              >
                <span className="dark:text-slate-400">Croma</span>
                <span className="dark:text-white font-bold">
                  ₹{product.croma_price.toLocaleString()}
                </span>
              </motion.div>
            )}
            {product.reliancedigital_price > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex justify-between items-center text-sm"
              >
                <span className="dark:text-slate-400">Reliance</span>
                <span className="dark:text-white font-bold">
                  ₹{product.reliancedigital_price.toLocaleString()}
                </span>
              </motion.div>
            )}
          </div>

          {/* Cheapest Indicator */}
          {cheapestPlatform && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg px-3 py-2 text-xs font-semibold text-white flex items-center gap-2 w-fit"
            >
              <FiTrendingDown className="w-4 h-4" />
              💰 Cheapest on{' '}
              {cheapestPlatform === 'reliancedigital' ? 'Reliance' : cheapestPlatform.charAt(0).toUpperCase() + cheapestPlatform.slice(1)}
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewDetails}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 group"
          >
            <span>Details</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const link = product[cheapestPlatform]?.url || product.flipkart?.url;
              if (link) window.open(link, '_blank');
            }}
            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span>Buy</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;