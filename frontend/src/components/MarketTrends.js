import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MarketTrends = () => {
  const [trends, setTrends] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Mock data for demonstration
  useEffect(() => {
    const fetchTrends = () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockTrends = [
          { name: 'Organic Food', google_trend: 85, twitter_mentions: 1200, sentiment: 0.8, category: 'Produce' },
          { name: 'Plant-Based Meat', google_trend: 92, twitter_mentions: 2100, sentiment: 0.7, category: 'Meat' },
          { name: 'Greek Yogurt', google_trend: 78, twitter_mentions: 890, sentiment: 0.9, category: 'Dairy' },
          { name: 'Avocado', google_trend: 95, twitter_mentions: 3400, sentiment: 0.6, category: 'Produce' },
          { name: 'Salmon', google_trend: 82, twitter_mentions: 1100, sentiment: 0.8, category: 'Seafood' },
          { name: 'Almond Milk', google_trend: 88, twitter_mentions: 1600, sentiment: 0.7, category: 'Beverages' },
          { name: 'Quinoa', google_trend: 75, twitter_mentions: 650, sentiment: 0.8, category: 'Pantry' },
          { name: 'Chia Seeds', google_trend: 70, twitter_mentions: 450, sentiment: 0.9, category: 'Pantry' }
        ];

        const mockPopularProducts = [
          {
            name: 'Organic Bananas',
            trend_score: 95,
            google_trend: 92,
            twitter_sentiment: 0.8,
            category: 'Produce',
            price_range: '$2.99 - $4.99',
            demand_prediction: 'High',
            reason: 'High social media mentions and positive sentiment'
          },
          {
            name: 'Plant-Based Ground Beef',
            trend_score: 88,
            google_trend: 89,
            twitter_sentiment: 0.7,
            category: 'Meat',
            price_range: '$8.99 - $12.99',
            demand_prediction: 'Medium-High',
            reason: 'Growing consumer interest in plant-based alternatives'
          },
          {
            name: 'Greek Yogurt',
            trend_score: 82,
            google_trend: 78,
            twitter_sentiment: 0.9,
            category: 'Dairy',
            price_range: '$4.99 - $6.99',
            demand_prediction: 'High',
            reason: 'Consistent positive sentiment and steady search volume'
          },
          {
            name: 'Fresh Avocados',
            trend_score: 90,
            google_trend: 95,
            twitter_sentiment: 0.6,
            category: 'Produce',
            price_range: '$1.99 - $3.99',
            demand_prediction: 'Very High',
            reason: 'Viral social media trends and high search volume'
          }
        ];

        setTrends(mockTrends);
        setPopularProducts(mockPopularProducts);
        setLoading(false);
      }, 1500);
    };

    fetchTrends();
  }, [selectedTimeframe]);

  const getTrendColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 0.7) return 'text-green-600';
    if (sentiment >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <motion.div 
        className="max-w-7xl mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading market trends...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Market Trends</h1>
            <p className="text-gray-600">Real-time insights from Google Trends and Twitter</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Google Trends vs Twitter Mentions</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="google_trend" fill="#3b82f6" name="Google Trend" />
                <Bar dataKey="twitter_mentions" fill="#8b5cf6" name="Twitter Mentions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sentiment Analysis</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sentiment" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Products in Market</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product, index) => (
            <motion.div
              key={product.name}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(product.trend_score)}`}>
                  {product.trend_score}
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Google Trend:</span>
                  <span className="font-medium">{product.google_trend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sentiment:</span>
                  <span className={`font-medium ${getSentimentColor(product.twitter_sentiment)}`}>
                    {(product.twitter_sentiment * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Range:</span>
                  <span className="font-medium">{product.price_range}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Demand:</span>
                  <span className="font-medium text-green-600">{product.demand_prediction}</span>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                {product.reason}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Market Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900">Trending Up</h3>
          </div>
          <p className="text-blue-700 text-sm">
            Organic and plant-based products showing strong growth in consumer interest
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-900">Positive Sentiment</h3>
          </div>
          <p className="text-green-700 text-sm">
            High positive sentiment for healthy food categories and sustainable products
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-purple-900">Price Sensitivity</h3>
          </div>
          <p className="text-purple-700 text-sm">
            Consumers showing price sensitivity for premium products, value options trending
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketTrends; 