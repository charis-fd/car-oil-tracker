import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OilDashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://yeti-final-app.onrender.com/api/oils?populate=*');
        const result = await response.json();
        const sortedData = result.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setData(sortedData);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchData();
  }, []);

  const calculateConsumption = (oil, distance) => {
    return distance ? ((oil / distance) * 100).toFixed(2) : 'N/A';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Car Oil Consumption Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition hover:scale-105">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Latest Reading</h2>
            <p className="text-3xl font-bold text-blue-600">{data[0]?.odometer || 'N/A'} km</p>
            <p className="text-sm text-gray-500">Current Odometer</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition hover:scale-105">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Last Oil Added</h2>
            <p className="text-3xl font-bold text-green-600">{data[0]?.oil || 'N/A'} ml</p>
            <p className="text-sm text-gray-500">Volume Added</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition hover:scale-105">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Consumption Rate</h2>
            <p className="text-3xl font-bold text-purple-600">
              {calculateConsumption(data[0]?.oil, data[0]?.distance)} ml/100km
            </p>
            <p className="text-sm text-gray-500">Latest Measurement</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Oil Consumption Trend</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#666"
                />
                <YAxis stroke="#666" />
                <Tooltip 
                  labelFormatter={formatDate}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '6px',
                    padding: '10px',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="oil" 
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2 }}
                  name="Oil Added (ml)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Detailed Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odometer (km)</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance (km)</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oil Added (ml)</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumption (ml/100km)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(entry.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.odometer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.distance}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.oil}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateConsumption(entry.oil, entry.distance)}</td>
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