import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ForecastSlider = ({ forecast, selectedSku, loading }) => {
  const [currentDay, setCurrentDay] = useState(0);

  if (loading) {
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Day-by-Day Forecast</h2>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading forecast details...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!forecast || !selectedSku) {
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Day-by-Day Forecast</h2>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500">Select a product to view day-by-day forecast</p>
        </div>
      </motion.div>
    );
  }

  const currentForecast = forecast[currentDay];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDemandLevel = (demand) => {
    const avgDemand = forecast.reduce((sum, f) => sum + f.demand, 0) / forecast.length;
    const ratio = demand / avgDemand;
    
    if (ratio > 1.2) return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
    if (ratio < 0.8) return { level: 'Low', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const demandLevel = getDemandLevel(currentForecast.demand);

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Day-by-Day Forecast</h2>
          <p className="text-sm text-gray-600">{selectedSku.name}</p>
        </div>
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Day Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
          disabled={currentDay === 0}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex space-x-2">
          {forecast.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentDay(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentDay ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => setCurrentDay(Math.min(forecast.length - 1, currentDay + 1))}
          disabled={currentDay === forecast.length - 1}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Current Day Details */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200"
        key={currentDay}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {formatDate(currentForecast.date)}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Day {currentDay + 1} of 7-day forecast
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Demand Level:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${demandLevel.bg} ${demandLevel.color}`}>
                  {demandLevel.level}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Day of Week:</span>
                <span className="font-medium text-gray-900">{currentForecast.day_of_week}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {currentForecast.demand}
              </div>
              <div className="text-sm text-gray-600 mb-4">units expected</div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Confidence Range:</span>
                  <span className="font-medium text-gray-900">
                    {currentForecast.confidence_lower} - {currentForecast.confidence_upper}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (currentForecast.demand / Math.max(...forecast.map(f => f.demand))) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            {Math.min(...forecast.map(f => f.demand))}
          </div>
          <div className="text-xs text-gray-600">Min Demand</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            {Math.round(forecast.reduce((sum, f) => sum + f.demand, 0) / forecast.length)}
          </div>
          <div className="text-xs text-gray-600">Avg Demand</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            {Math.max(...forecast.map(f => f.demand))}
          </div>
          <div className="text-xs text-gray-600">Max Demand</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ForecastSlider; 