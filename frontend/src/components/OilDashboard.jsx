import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

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
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const calculateConsumption = (oil, distance) => distance ? ((oil / distance) * 100).toFixed(2) : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Car Oil Consumption Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-300">Latest Reading</h2>
            <p className="text-3xl font-bold text-blue-400">{data[0]?.odometer || 'N/A'} km</p>
            <p className="text-sm text-gray-400">Current Odometer</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-300">Last Oil Added</h2>
            <p className="text-3xl font-bold text-emerald-400">{data[0]?.oil || 'N/A'} ml</p>
            <p className="text-sm text-gray-400">Volume Added</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-300">Consumption Rate</h2>
            <p className="text-3xl font-bold text-purple-400">
              {calculateConsumption(data[0]?.oil, data[0]?.distance)} ml/100km
            </p>
            <p className="text-sm text-gray-400">Latest Measurement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-gray-300 mb-4">Oil Usage Over Time</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorOil" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" tickFormatter={formatDate} stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    labelFormatter={formatDate}
                    contentStyle={{
                      backgroundColor: 'rgba(26, 32, 44, 0.9)',
                      border: '1px solid #4a5568',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="oil" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorOil)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-gray-300 mb-4">Distance vs Oil Consumption</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" tickFormatter={formatDate} stroke="#999" />
                  <YAxis yAxisId="left" stroke="#999" />
                  <YAxis yAxisId="right" orientation="right" stroke="#999" />
                  <Tooltip
                    labelFormatter={formatDate}
                    contentStyle={{
                      backgroundColor: 'rgba(26, 32, 44, 0.9)',
                      border: '1px solid #4a5568',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                  />
                  <Bar yAxisId="left" dataKey="distance" fill="#4CAF50" name="Distance (km)" />
                  <Bar yAxisId="right" dataKey="oil" fill="#2196F3" name="Oil (ml)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg overflow-hidden">
          <h2 className="text-xl font-bold text-gray-300 mb-4">Detailed Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Odometer (km)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Distance (km)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Oil Added (ml)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Consumption (ml/100km)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {data.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(entry.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.odometer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.distance}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.oil}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{calculateConsumption(entry.oil, entry.distance)}</td>
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