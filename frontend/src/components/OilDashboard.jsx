import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Droplet, Navigation, AlertCircle } from 'lucide-react';

const OilDashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://yeti-final-app.onrender.com/api/oils?populate=*');
      const result = await response.json();
      const sortedData = result.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setData(sortedData);
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short'
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-lg shadow-xl">
          <p className="text-slate-300 font-medium">{formatDate(label)}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="text-slate-300 font-medium">
              {`${p.name}: ${p.value.toLocaleString()} ${p.name.includes('Distance') ? 'km' : 'ml'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const calculateConsumption = (oil, distance) => distance ? ((oil / distance) * 100).toFixed(2) : 'N/A';

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-20 min-h-screen bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col items-center py-8 gap-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div className="w-12 h-12 hover:bg-slate-800/50 rounded-xl flex items-center justify-center cursor-pointer">
            <TrendingUp className="w-6 h-6 text-slate-400" />
          </div>
          <div className="w-12 h-12 hover:bg-slate-800/50 rounded-xl flex items-center justify-center cursor-pointer">
            <Navigation className="w-6 h-6 text-slate-400" />
          </div>
          <div className="w-12 h-12 hover:bg-slate-800/50 rounded-xl flex items-center justify-center cursor-pointer">
            <AlertCircle className="w-6 h-6 text-slate-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Oil Consumption Dashboard
            </h1>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Current Odometer</p>
                  <h3 className="text-3xl font-bold text-blue-400">{data[0]?.odometer?.toLocaleString() || 'N/A'}</h3>
                  <p className="text-slate-500 text-sm mt-1">kilometers</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-xl">
                  <Navigation className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Latest Oil Added</p>
                  <h3 className="text-3xl font-bold text-emerald-400">{data[0]?.oil?.toLocaleString() || 'N/A'}</h3>
                  <p className="text-slate-500 text-sm mt-1">milliliters</p>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl">
                  <Droplet className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Consumption Rate</p>
                  <h3 className="text-3xl font-bold text-purple-400">
                    {calculateConsumption(data[0]?.oil, data[0]?.distance)}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">ml/100km</p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-300 mb-6">Oil Usage Trend</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorOil" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" tickFormatter={formatDate} stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="oil" 
                      name="Oil Added"
                      stroke="#8b5cf6" 
                      fill="url(#colorOil)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-300 mb-6">Distance & Oil Comparison</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" tickFormatter={formatDate} stroke="#64748b" />
                    <YAxis yAxisId="left" stroke="#64748b" />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar yAxisId="left" dataKey="distance" name="Distance" fill="rgba(74, 222, 128, 0.5)" />
                    <Bar yAxisId="right" dataKey="oil" name="Oil Added" fill="rgba(96, 165, 250, 0.5)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-300">Historical Records</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 text-sm">
                  Export
                </button>
                <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 text-sm">
                  Add New
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Odometer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Distance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Oil Added</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Consumption</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {data.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-800/30 transition duration-150">
                      <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                        {new Date(entry.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {entry.odometer.toLocaleString()} km
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {entry.distance.toLocaleString()} km
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {entry.oil.toLocaleString()} ml
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {calculateConsumption(entry.oil, entry.distance)} ml/100km
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OilDashboard;