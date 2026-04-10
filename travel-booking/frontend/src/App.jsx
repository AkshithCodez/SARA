import React, { useState, useEffect } from 'react'
import { fetchPrediction } from './services/api'
import { HeroSection } from './components/blocks/hero-section-2'
import LoungeTraffic from './components/LoungeTraffic'
import Staffing from './components/Staffing'
import FoodOptimization from './components/FoodOptimization'
import RiskMonitoring from './components/RiskMonitoring'
import CustomerExperience from './components/CustomerExperience'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('lounge');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPrediction();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderTabContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={loadData} />;
    if (!data) return null;

    switch (activeTab) {
      case 'lounge':
        return <LoungeTraffic data={data} />;
      case 'staffing':
        return <Staffing data={data} />;
      case 'food':
        return <FoodOptimization data={data} />;
      case 'risk':
        return <RiskMonitoring data={data} />;
      case 'customer':
        return <CustomerExperience data={data} />;
      default:
        return <LoungeTraffic data={data} />;
    }
  };

  return (
    <div className="App min-h-screen bg-background text-foreground">
      {/* New hero header with SARA tabs replaces the old Header component */}
      <HeroSection activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dashboard tab content — padded below the fixed nav */}
      <main className="main-content pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
        {renderTabContent()}
      </main>
    </div>
  )
}

export default App
