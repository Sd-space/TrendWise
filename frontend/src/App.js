import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddProduct';
import MarketTrends from './components/MarketTrends';

function App() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setActiveSection('dashboard');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <AddProduct />;
      case 'trends':
        return <MarketTrends />;
      case 'forecast':
        return <Dashboard />; // Same as dashboard for now
      default:
        return <Dashboard />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        user={user}
        onLogout={handleLogout}
      />
      
      <motion.div 
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderSection()}
      </motion.div>
    </div>
  );
}

export default App; 