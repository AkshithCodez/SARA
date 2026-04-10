import React, { useState, useEffect } from 'react'
import { fetchPrediction } from './services/api'
import { LandingPage } from './components/blocks/LandingPage'
import { DashboardHeader } from './components/blocks/DashboardHeader'
import LoungeTraffic from './components/LoungeTraffic'
import Staffing from './components/Staffing'
import FoodOptimization from './components/FoodOptimization'
import RiskMonitoring from './components/RiskMonitoring'
import CustomerExperience from './components/CustomerExperience'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import './App.css'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [activeTab, setActiveTab]         = useState('lounge')
  const [data, setData]                   = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchPrediction()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const renderTabContent = () => {
    if (loading) return <LoadingSpinner />
    if (error)   return <ErrorMessage message={error} onRetry={loadData} />
    if (!data)   return null

    switch (activeTab) {
      case 'lounge':   return <LoungeTraffic   data={data} />
      case 'staffing': return <Staffing         data={data} />
      case 'food':     return <FoodOptimization data={data} />
      case 'risk':     return <RiskMonitoring   data={data} />
      case 'customer': return <CustomerExperience data={data} />
      default:         return <LoungeTraffic   data={data} />
    }
  }

  if (!showDashboard) {
    return <LandingPage onEnterDashboard={() => setShowDashboard(true)} />
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Two-row fixed header: logo row + tab row */}
      <DashboardHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBackToLanding={() => setShowDashboard(false)}
      />

      {/*
        pt-[104px] accounts for both header rows:
          Row 1 (logo) ≈ 58px
          Row 2 (tabs) ≈ 46px
        No bottom padding needed — dock is gone from the bottom.
      */}
      <main className="pt-[104px] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {renderTabContent()}
        </div>
      </main>
    </div>
  )
}

export default App
