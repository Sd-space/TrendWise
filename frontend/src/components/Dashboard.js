import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import SKUSelector from './SKUSelector';
import PromoSimulator from './PromoSimulator';
import ForecastChart from './ForecastChart';
import TrendChart from './TrendChart';
import KPICards from './KPICards';
import ForecastSlider from './ForecastSlider';

const API_BASE_URL = 'http://localhost:5000';

const Dashboard = () => {
  const [skus, setSkus] = useState([]);
  const [trends, setTrends] = useState([]);
  const [selectedSku, setSelectedSku] = useState(null);
  const [price, setPrice] = useState(0);
  const [promoActive, setPromoActive] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load SKUs on component mount
  useEffect(() => {
    loadSKUs();
    loadTrends();
  }, []);

  // Load forecast when SKU, price, or promo changes
  useEffect(() => {
    if (selectedSku) {
      loadForecast();
    }
  }, [selectedSku, price, promoActive]);

  const loadSKUs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/skus`);
      setSkus(response.data.skus);
      if (response.data.skus.length > 0) {
        setSelectedSku(response.data.skus[0]);
        setPrice(response.data.skus[0].base_price);
      }
    } catch (err) {
      setError('Failed to load SKUs');
      console.error('Error loading SKUs:', err);
    }
  };

  const loadTrends = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trends`);
      setTrends(response.data.trends);
    } catch (err) {
      console.error('Error loading trends:', err);
    }
  };

  const loadForecast = async () => {
    if (!selectedSku) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        sku_id: selectedSku.id,
        price: price,
        promo_active: promoActive
      });

      setForecast(response.data.forecast);
      setKpis(response.data.kpis);
    } catch (err) {
      setError('Failed to load forecast');
      console.error('Error loading forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkuChange = (sku) => {
    setSelectedSku(sku);
    setPrice(sku.base_price);
  };

  const handlePriceChange = (newPrice) => {
    setPrice(newPrice);
  };

  const handlePromoToggle = (isActive) => {
    setPromoActive(isActive);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supply Chain Dashboard</h1>
        <p className="text-gray-600">AI-powered demand forecasting and promotional impact analysis</p>
      </motion.div>

      {error && (
        <motion.div 
          className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          variants={itemVariants}
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Controls */}
        <motion.div className="lg:col-span-3 space-y-6" variants={itemVariants}>
          <SKUSelector 
            skus={skus}
            selectedSku={selectedSku}
            onSkuChange={handleSkuChange}
          />
          
          <PromoSimulator
            selectedSku={selectedSku}
            price={price}
            promoActive={promoActive}
            onPriceChange={handlePriceChange}
            onPromoToggle={handlePromoToggle}
            loading={loading}
          />
        </motion.div>

        {/* Right Column - Charts and KPIs */}
        <motion.div className="lg:col-span-9 space-y-6" variants={itemVariants}>
          <KPICards kpis={kpis} loading={loading} />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ForecastChart 
              forecast={forecast}
              selectedSku={selectedSku}
              loading={loading}
            />
            
            <TrendChart 
              trends={trends}
              loading={loading}
            />
          </div>

          <ForecastSlider 
            forecast={forecast}
            selectedSku={selectedSku}
            loading={loading}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard; 