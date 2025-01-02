import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-lg">
          <p className="text-gray-300">{`Date: ${formatDate(label)}`}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="text-gray-300">
              {`${p.name}: ${p.value} ${p.name.includes('Distance') ? 'km' : 'ml'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const calculateConsumption = (oil, distance) => distance ? ((oil / distance) * 100).toFixed(2) : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center py-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Car Oil Consumption Dashboard
          </h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-gray-400 font-medium">Current Odometer</h2>
              <p className="text-4xl font-bold text-blue-400">{data[0]?.odometer?.toLocaleString() || 'N/A'}</p>
              <p className="text-xl text-gray-500">kilometers</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-gray-400 font-medium">Latest Oil Added</h2>
              <p className="text-4xl font-bold text-emerald-400">{data[0]?.oil?.toLocaleString() || 'N/A'}</p>
              <p className="text-xl text-gray-500">milliliters</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-gray-400 font-medium">Consumption Rate</h2>
              <p className="text-4xl font-bold text-purple-400">
                {calculateConsumption(data[0]?.oil, data[0]?.distance)}
              </p>
              <p className="text-xl text-gray-500">ml/100km</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-300 mb-6">Oil Usage Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorOil" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
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

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-300 mb-6">Distance & Oil Comparison</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="distance" name="Distance" fill="#4ade80" />
                  <Bar yAxisId="right" dataKey="oil" name="Oil Added" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-300 mb-6">Historical Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Odometer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Oil Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Consumption</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {data.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/5 transition duration-150">
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(entry.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {entry.odometer.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {entry.distance.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {entry.oil.toLocaleString()} ml
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
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
  );
};

export default OilDashboard;