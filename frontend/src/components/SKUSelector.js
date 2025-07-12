import React from 'react';
import { motion } from 'framer-motion';

const SKUSelector = ({ skus, selectedSku, onSkuChange }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Produce': 'bg-green-100 text-green-800 border-green-200',
      'Meat': 'bg-red-100 text-red-800 border-red-200',
      'Dairy': 'bg-blue-100 text-blue-800 border-blue-200',
      'Seafood': 'bg-cyan-100 text-cyan-800 border-cyan-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Product Selection</h2>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        {skus.map((sku) => (
          <motion.div
            key={sku.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedSku?.id === sku.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
            onClick={() => onSkuChange(sku)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{sku.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(sku.category)}`}>
                    {sku.category}
                  </span>
                  <span className="text-sm text-gray-600">${sku.base_price}</span>
                </div>
              </div>
              
              {selectedSku?.id === sku.id && (
                <motion.div
                  className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedSku && (
        <motion.div 
          className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Selected: {selectedSku.name}</p>
              <p className="text-xs text-gray-600">Base price: ${selectedSku.base_price}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SKUSelector; 