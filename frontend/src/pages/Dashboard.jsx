import React, { useState, useEffect } from 'react';
import { fetchPrediction } from '../services/api';
import Header from '../components/Header';
import OccupancySection from '../components/OccupancySection';
import StaffingSection from '../components/StaffingSection';
import FoodSection from '../components/FoodSection';
import CustomerSection from '../components/CustomerSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './Dashboard.css';

const Dashboard = () => {
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

  if (loading) {
    return (
      <div className="dashboard">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <Header />
        <ErrorMessage message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <OccupancySection data={data} />
        <StaffingSection data={data} />
        <FoodSection data={data} />
        <CustomerSection />
      </div>
    </div>
  );
};

export default Dashboard;
