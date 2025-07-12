import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    base_price: '',
    description: '',
    supplier: '',
    lead_time_days: '',
    min_order_quantity: '',
    sku_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Produce', 'Meat', 'Dairy', 'Seafood', 'Bakery', 'Frozen', 'Pantry', 'Beverages', 'Snacks', 'Household'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateSKUId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `SKU${timestamp}${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate required fields
    if (!formData.name || !formData.category || !formData.base_price) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        ...formData,
        sku_id: formData.sku_id || generateSKUId(),
        base_price: parseFloat(formData.base_price),
        lead_time_days: parseInt(formData.lead_time_days) || 3,
        min_order_quantity: parseInt(formData.min_order_quantity) || 50
      };

      const response = await axios.post('http://localhost:5000/add-product', productData);
      
      setSuccess(true);
      setLoading(false);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          category: '',
          base_price: '',
          description: '',
          supplier: '',
          lead_time_days: '',
          min_order_quantity: '',
          sku_id: ''
        });
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
            <p className="text-gray-600">Add a new SKU to the forecasting system</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>

        {success && (
          <motion.div 
            className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✅ Product added successfully! The new SKU is now available for forecasting.
          </motion.div>
        )}

        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ❌ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Organic Bananas"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Base Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price (USD) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-500 text-sm">USD</span>
                </div>
              </div>
            </div>

            {/* SKU ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU ID (Optional)
              </label>
              <input
                type="text"
                name="sku_id"
                value={formData.sku_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Auto-generated if empty"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Fresh Farms Inc."
              />
            </div>

            {/* Lead Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lead Time (Days)
              </label>
              <input
                type="number"
                name="lead_time_days"
                value={formData.lead_time_days}
                onChange={handleChange}
                min="1"
                max="30"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="3"
              />
            </div>

            {/* Min Order Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Quantity
              </label>
              <input
                type="number"
                name="min_order_quantity"
                value={formData.min_order_quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Describe the product, its features, and any special requirements..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  category: '',
                  base_price: '',
                  description: '',
                  supplier: '',
                  lead_time_days: '',
                  min_order_quantity: '',
                  sku_id: ''
                });
                setError('');
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Product...</span>
                </div>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Product Information</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Products added here will be available for demand forecasting</p>
            <p>• SKU IDs are auto-generated if not provided</p>
            <p>• Base price is used as the reference for promotional calculations</p>
            <p>• Lead time affects inventory planning and reorder points</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddProduct; 