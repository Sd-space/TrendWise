import React from 'react';
import { motion } from 'framer-motion';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';

const TrendChart = ({ trends, loading }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sentimentData = payload.find(p => p.dataKey === 'sentiment');
      const searchData = payload.find(p => p.dataKey === 'search_volume');
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{formatDate(label)}</p>
          <div className="space-y-2 mt-2">
            {sentimentData && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Sentiment:</span>
                <span className="text-sm font-semibold text-green-600">
                  {(sentimentData.value * 100).toFixed(1)}%
                </span>
              </div>
            )}
            {searchData && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Search Volume:</span>
                <span className="text-sm font-semibold text-purple-600">
                  {searchData.value.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Market Trends</h2>
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading trends...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Market Trends</h2>
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <p className="text-gray-500">No trend data available</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Transform data for better visualization
  const chartData = trends.map(item => ({
    ...item,
    sentiment_percent: item.sentiment * 100,
    search_normalized: item.search_volume
  }));

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Market Trends</h2>
          <p className="text-sm text-gray-600">Sentiment & Search Volume (30 days)</p>
        </div>
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 10 }}
              stroke="#6b7280"
              interval="preserveStartEnd"
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 10 }}
              stroke="#6b7280"
              label={{ value: 'Sentiment (%)', angle: -90, position: 'insideLeft', fontSize: 10 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10 }}
              stroke="#6b7280"
              label={{ value: 'Search Volume', angle: 90, position: 'insideRight', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Sentiment Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sentiment_percent"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 1, r: 2 }}
              activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2 }}
            />
            
            {/* Search Volume Bars */}
            <Bar
              yAxisId="right"
              dataKey="search_normalized"
              fill="#8b5cf6"
              fillOpacity={0.6}
              radius={[2, 2, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Sentiment</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-gray-600">Search Volume</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendChart; 