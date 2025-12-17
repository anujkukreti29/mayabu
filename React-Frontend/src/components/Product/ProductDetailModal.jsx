import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiShoppingCart, FiTrendingDown, FiExternalLink } from 'react-icons/fi';

const ProductDetailModal = ({ product, onClose }) => {
  const [selectedTab, setSelectedTab] = useState('platforms');

  if (!product) return null;

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

  const getRating = () => {
    return parseFloat(product.flipkart?.rating || 0) || 0;
  };

  const getImage = () => {
    return (
      product.flipkart?.image ||
      product.amazon?.image ||
      product.croma?.image ||
      product.reliancedigital?.image ||
      'https://via.placeholder.com/400x400?text=No+Image'
    );
  };

  const platformDetails = [
    {
      name: 'Flipkart',
      key: 'flipkart',
      color: 'from-blue-600 to-blue-500',
      price: product.flipkart_price,
      data: product.flipkart,
    },
    {
      name: 'Amazon',
      key: 'amazon',
      color: 'from-orange-600 to-orange-500',
      price: product.amazon_price,
      data: product.amazon,
    },
    {
      name: 'Croma',
      key: 'croma',
      color: 'from-red-600 to-red-500',
      price: product.croma_price,
      data: product.croma,
    },
    {
      name: 'Reliance Digital',
      key: 'reliancedigital',
      color: 'from-purple-600 to-purple-500',
      price: product.reliancedigital_price,
      data: product.reliancedigital,
    },
  ];

  const availablePlatforms = platformDetails.filter((p) => p.price > 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Product Details</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
            >
              <FiX className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title & Image Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-1 bg-slate-900 rounded-2xl p-4 flex items-center justify-center"
              >
                <img
                  src={getImage()}
                  alt="Product"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 space-y-4"
              >
                <h1 className="text-2xl font-bold text-white">
                  {product.flipkart?.title || product.amazon?.title || 'Product'}
                </h1>

                {/* Rating & Reviews */}
                {getRating() > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <FiStar
                            className={`w-5 h-5 ${
                              i < Math.round(getRating())
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-white">
                      {getRating()}/5
                    </span>
                    <span className="text-slate-400 text-sm">
                      ({product.flipkart?.reviews || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Price Summary */}
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 border border-slate-600">
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Lowest Price</p>
                      <p className="text-4xl font-bold text-blue-400">
                        ₹{minPrice.toLocaleString()}
                      </p>
                    </div>
                    {savings > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg px-4 py-2 text-white"
                      >
                        <p className="text-xs text-red-100">You Save</p>
                        <p className="text-lg font-bold">₹{savings.toLocaleString()}</p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Discount Info */}
                {product.flipkart?.discount && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-green-400"
                  >
                    <FiTrendingDown className="w-5 h-5" />
                    <span className="font-semibold">{product.flipkart.discount} Discount</span>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Tab Buttons */}
              <div className="flex gap-2 border-b border-slate-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTab('platforms')}
                  className={`px-4 py-3 font-semibold transition-all ${
                    selectedTab === 'platforms'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Platforms
                </motion.button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {selectedTab === 'platforms' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {availablePlatforms.map((platform, idx) => (
                      <motion.div
                        key={platform.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-xl p-4 border border-slate-600 hover:border-slate-500 transition-all hover:from-slate-700/50 hover:to-slate-800/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className={`px-4 py-2 rounded-lg bg-gradient-to-r ${platform.color} text-white font-semibold`}
                            >
                              {platform.name}
                            </motion.div>
                            <div>
                              <p className="text-3xl font-bold text-white">
                                ₹{platform.price.toLocaleString()}
                              </p>
                              {platform.data?.originalPrice && (
                                <p className="text-slate-400 text-sm line-through">
                                  ₹{parseInt(platform.data.originalPrice.replace(/[₹,]/g, '')).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={platform.data?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${platform.color} text-white font-bold hover:opacity-90 transition-opacity`}
                          >
                            <FiShoppingCart className="w-4 h-4" />
                            Buy Now
                            <FiExternalLink className="w-3 h-3" />
                          </motion.a>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetailModal;