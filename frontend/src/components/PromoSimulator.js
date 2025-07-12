import React from 'react';
import { motion } from 'framer-motion';

const PromoSimulator = ({ selectedSku, price, promoActive, onPriceChange, onPromoToggle, loading }) => {
  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onPriceChange(newPrice);
    }
  };

  const getPriceChangeColor = () => {
    if (!selectedSku) return 'text-gray-500';
    const change = ((price - selectedSku.base_price) / selectedSku.base_price) * 100;
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-500';
  };

  const getPriceChangeText = () => {
    if (!selectedSku) return '';
    const change = ((price - selectedSku.base_price) / selectedSku.base_price) * 100;
    if (change === 0) return 'No change';
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Promo Simulator</h2>
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
      </div>

      {selectedSku ? (
        <div className="space-y-4">
          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={handlePriceChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter price"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-500 text-sm">USD</span>
              </div>
            </div>
            
            {/* Price Change Indicator */}
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Base: ${selectedSku.base_price}</span>
              <span className={`text-sm font-medium ${getPriceChangeColor()}`}>
                {getPriceChangeText()}
              </span>
            </div>
          </div>

          {/* Promo Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promotional Status
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onPromoToggle(!promoActive)}
                disabled={loading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  promoActive ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    promoActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-900">
                {promoActive ? 'Active' : 'Inactive'}
              </span>
              {promoActive && (
                <motion.span 
                  className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  +50% Demand
                </motion.span>
              )}
            </div>
          </div>

          {/* Impact Summary */}
          <motion.div 
            className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-2">Expected Impact</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price Effect:</span>
                <span className={getPriceChangeColor()}>
                  {getPriceChangeText()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Promo Effect:</span>
                <span className={promoActive ? 'text-green-600 font-medium' : 'text-gray-500'}>
                  {promoActive ? '+50% Demand' : 'No Promo'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Combined Effect:</span>
                <span className="text-blue-600 font-medium">
                  {promoActive ? 'High Demand Expected' : 'Standard Demand'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div 
              className="flex items-center justify-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Updating forecast...</span>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500">Select a product to configure pricing and promotions</p>
        </div>
      )}
    </motion.div>
  );
};

export default PromoSimulator; 