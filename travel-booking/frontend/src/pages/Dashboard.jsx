import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLounges, fetchForecast } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function getStatusBadge(forecast) {
  const avg = forecast.reduce((a, b) => a + b, 0) / forecast.length;
  if (avg < 80) return { label: 'Low', color: 'bg-green-500', text: 'text-green-400' };
  if (avg < 120) return { label: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-400' };
  return { label: 'High', color: 'bg-red-500', text: 'text-red-400' };
}

function getStatusLabel(forecast) {
  const avg = forecast.reduce((a, b) => a + b, 0) / forecast.length;
  if (avg < 80) return 'Low';
  if (avg < 120) return 'Medium';
  return 'High';
}

export default function Dashboard() {
  const [lounges, setLounges] = useState([]);
  const [selectedLounge, setSelectedLounge] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadLounges();
  }, [navigate]);

  const loadLounges = async () => {
    try {
      const data = await fetchLounges();
      setLounges(data);
      if (data.length > 0) {
        setSelectedLounge(data[0]);
      }
    } catch (err) {
      setError('Failed to load lounges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLounge) {
      loadForecast(selectedLounge.id);
    }
  }, [selectedLounge]);

  const loadForecast = async (loungeId) => {
    try {
      const data = await fetchForecast(loungeId);
      setForecast(data);
    } catch (err) {
      setError('Failed to load forecast');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading...</div>
      </div>
    );
  }

  const chartData = forecast?.forecast?.map((value, index) => ({
    hour: `Hour ${index + 1}`,
    occupancy: Math.round(value),
  })) || [];

  const status = forecast?.forecast ? getStatusBadge(forecast.forecast) : null;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top Bar */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SARA Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Lounge Selector */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">Select Lounge</label>
          <select
            value={selectedLounge?.id || ''}
            onChange={(e) => {
              const lounge = lounges.find(l => l.id === e.target.value);
              setSelectedLounge(lounge);
            }}
            className="w-full max-w-md px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
          >
            {lounges.map((lounge) => (
              <option key={lounge.id} value={lounge.id}>
                {lounge.name} - {lounge.location}
              </option>
            ))}
          </select>
        </div>

        {selectedLounge && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lounge Info Card */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Lounge Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-xl font-medium text-white">{selectedLounge.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">{selectedLounge.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Capacity</p>
                  <p className="text-white">{selectedLounge.capacity} passengers</p>
                </div>
                {status && (
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400 mb-2">Occupancy Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color} text-white`}>
                      {status.label}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Forecast Chart */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">6-Hour Forecast</h3>
              {forecast ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: '#F9FAFB' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="occupancy"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#60A5FA' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Loading forecast...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Forecast Values Below */}
        {forecast?.forecast && (
          <div className="mt-8 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Hourly Predictions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {forecast.forecast.map((value, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center"
                >
                  <p className="text-sm text-gray-400">Hour {index + 1}</p>
                  <p className="text-2xl font-bold text-white">{Math.round(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}