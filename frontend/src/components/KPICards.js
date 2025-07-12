import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, unit, icon, color, loading, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value !== null && !loading) {
      const startValue = 0;
      const endValue = value;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = startValue + (endValue - startValue) * progress;
        setDisplayValue(Math.round(currentValue * 10) / 10);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [value, loading]);

  const getIconColor = () => {
    const colors = {
      'blue': 'bg-blue-100 text-blue-600',
      'green': 'bg-green-100 text-green-600',
      'orange': 'bg-orange-100 text-orange-600',
      'purple': 'bg-purple-100 text-purple-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {loading ? (
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                displayValue
              )}
            </span>
            {unit && (
              <span className="text-sm text-gray-500">{unit}</span>
            )}
          </div>
        </div>
        
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColor()}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const KPICards = ({ kpis, loading }) => {
  const kpiData = [
    {
      title: 'MAPE',
      value: kpis?.mape || 0,
      unit: '%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      title: 'Fill Rate',
      value: kpis?.fill_rate || 0,
      unit: '%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.143L13 21l-2.286-6.857L5 12l5.714-3.143L13 3z" />
        </svg>
      ),
      color: 'green'
    },
    {
      title: 'Promo Uplift',
      value: kpis?.uplift || 0,
      unit: '%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'orange'
    },
    {
      title: 'Avg Demand',
      value: kpis?.avg_demand || 0,
      unit: 'units',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <KPICard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          unit={kpi.unit}
          icon={kpi.icon}
          color={kpi.color}
          loading={loading}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default KPICards; 