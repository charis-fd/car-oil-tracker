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

  const calculateConsumption = (oil, distance) => distance ? ((oil / distance) * 100).toFixed(2) : 'N/A';

  const styles = {
    container: 'min-h-screen bg-gray-900 text-white p-8',
    header: 'text-4xl font-bold mb-8',
    grid: 'grid md:grid-cols-3 gap-6 mb-8',
    card: 'bg-gray-800 rounded-lg p-6',
    cardTitle: 'text-gray-400 text-sm mb-2',
    cardValue: 'text-3xl font-bold text-blue-400',
    cardUnit: 'text-gray-500 text-sm',
    chartContainer: 'bg-gray-800 rounded-lg p-6 mb-8',
    chartTitle: 'text-xl font-bold mb-4',
    table: 'w-full',
    th: 'text-left p-4 bg-gray-800 border-b border-gray-700',
    td: 'p-4 border-b border-gray-700'
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Oil Consumption Dashboard</h1>
      
      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Current Odometer</h2>
          <p className={styles.cardValue}>{data[0]?.odometer?.toLocaleString()}</p>
          <p className={styles.cardUnit}>kilometers</p>
        </div>
        
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Latest Oil Added</h2>
          <p className={styles.cardValue}>{data[0]?.oil?.toLocaleString()}</p>
          <p className={styles.cardUnit}>milliliters</p>
        </div>
        
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Consumption Rate</h2>
          <p className={styles.cardValue}>{calculateConsumption(data[0]?.oil, data[0]?.distance)}</p>
          <p className={styles.cardUnit}>ml/100km</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>Oil Usage Trend</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorOil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Area type="monotone" dataKey="oil" stroke="#3B82F6" fill="url(#colorOil)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>Historical Records</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Odometer (km)</th>
              <th className={styles.th}>Distance (km)</th>
              <th className={styles.th}>Oil Added (ml)</th>
              <th className={styles.th}>Consumption (ml/100km)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.id}>
                <td className={styles.td}>{formatDate(entry.date)}</td>
                <td className={styles.td}>{entry.odometer.toLocaleString()}</td>
                <td className={styles.td}>{entry.distance.toLocaleString()}</td>
                <td className={styles.td}>{entry.oil.toLocaleString()}</td>
                <td className={styles.td}>{calculateConsumption(entry.oil, entry.distance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OilDashboard;