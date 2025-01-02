import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const OilDashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching from:', `${import.meta.env.VITE_API_URL}/api/oils?populate*`);
        const response = await axios.get('https://yeti-final-app.onrender.com/api/oils?populate=*');
        console.log('API Response:', response.data);
        setData(response.data.data || []);
      } catch (error) {
        console.error('Error details:', error.response || error);
      }
    };
    
    fetchData();
  }, []);

  console.log('Current data state:', data);;

  const calculateConsumption = (oil, distance) => {
    return ((oil / distance) * 100).toFixed(2);
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Car Oil Consumption Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Latest Reading</h2>
          <p className="text-2xl font-bold">{data[0]?.attributes?.odometer} km</p>
          <p className="text-sm text-gray-500">Odometer</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Last Oil Added</h2>
          <p className="text-2xl font-bold">{data[0]?.attributes?.oil} ml</p>
          <p className="text-sm text-gray-500">Amount</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Consumption Rate</h2>
          <p className="text-2xl font-bold">
            {calculateConsumption(data[0]?.attributes?.oil, data[0]?.attributes?.distance)} ml/100km
          </p>
          <p className="text-sm text-gray-500">Latest</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Oil Consumption Trend</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.map(item => item.attributes)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="oil" 
                stroke="#8884d8" 
                name="Oil Added (ml)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Detailed Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left font-semibold">Date</th>
                <th className="py-3 px-4 text-left font-semibold">Odometer (km)</th>
                <th className="py-3 px-4 text-left font-semibold">Distance (km)</th>
                <th className="py-3 px-4 text-left font-semibold">Oil Added (ml)</th>
                <th className="py-3 px-4 text-left font-semibold">Consumption (ml/100km)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{entry.attributes.date}</td>
                  <td className="py-3 px-4">{entry.attributes.odometer}</td>
                  <td className="py-3 px-4">{entry.attributes.distance}</td>
                  <td className="py-3 px-4">{entry.attributes.oil}</td>
                  <td className="py-3 px-4">
                    {calculateConsumption(entry.attributes.oil, entry.attributes.distance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OilDashboard;