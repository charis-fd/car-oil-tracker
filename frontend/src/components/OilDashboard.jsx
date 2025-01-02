import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const OilDashboard = () => {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({
    monitoringPeriod: '',
    totalDistance: 0,
    totalOil: 0,
    dailyDistance: 0,
    avgConsumption: 0,
    efficiency: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://yeti-final-app.onrender.com/api/oils?populate=*');
      const result = await response.json();
      const sortedData = result.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setData(sortedData);
      
      if (sortedData.length > 0) {
        const startDate = new Date(sortedData[0].date);
        const endDate = new Date(sortedData[sortedData.length - 1].date);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
        
        const totalDistance = sortedData[sortedData.length - 1].odometer - sortedData[0].odometer;
        const totalOil = sortedData.reduce((sum, record) => sum + record.oil, 0);
        
        setMetrics({
          monitoringPeriod: `${formatDate(sortedData[0].date)} - ${formatDate(sortedData[sortedData.length - 1].date)}`,
          totalDistance,
          totalOil,
          dailyDistance: (totalDistance / daysDiff).toFixed(1),
          avgConsumption: ((totalOil / 1000) / (totalDistance / 1000)).toFixed(2), // L/1000km
          efficiency: (totalDistance / (totalOil / 1000)).toFixed(1)
        });
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const MetricCard = ({ title, value, unit, color }) => (
    <div style={{
      backgroundColor: '#132f4c',
      padding: '1rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #1e4976',
      marginBottom: '1rem'
    }}>
      <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{title}</h2>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color, marginBottom: '0.25rem' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p style={{ color: '#64748b', fontSize: '0.75rem' }}>{unit}</p>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#0a1929',
      minHeight: '100vh',
      padding: '1rem',
      color: '#e2e8f0'
    }}>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#f8fafc'
      }}>Oil Consumption Analytics</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <MetricCard
          title="Monitoring Period"
          value={metrics.monitoringPeriod}
          unit="date range"
          color="#60a5fa"
        />
        <MetricCard
          title="Distance Driven"
          value={metrics.totalDistance}
          unit="kilometers"
          color="#34d399"
        />
        <MetricCard
          title="Total Oil Added"
          value={metrics.totalOil}
          unit="milliliters"
          color="#a78bfa"
        />
        <MetricCard
          title="Daily Distance"
          value={metrics.dailyDistance}
          unit="km/day"
          color="#f472b6"
        />
        <MetricCard
          title="Oil Consumption"
          value={metrics.avgConsumption}
          unit="L/1000km"
          color="#fb923c"
        />
        <MetricCard
          title="Efficiency"
          value={metrics.efficiency}
          unit="km/L"
          color="#22d3ee"
        />
      </div>

      <div style={{
        backgroundColor: '#132f4c',
        padding: '1rem',
        borderRadius: '1rem',
        marginBottom: '1.5rem',
        border: '1px solid #1e4976'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f8fafc' }}>
          Oil added History
        </h2>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e4976" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: '0.75rem' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: '0.75rem' }}
              />
              <Tooltip 
                formatter={(value, name) => [value.toLocaleString(), name]}
                labelFormatter={formatDate}
                contentStyle={{
                  backgroundColor: 'rgba(19, 47, 76, 0.95)',
                  border: '1px solid #1e4976',
                  borderRadius: '0.5rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="oil" 
                name="Oil Added (ml)"
                stroke="#60a5fa" 
                strokeWidth={2}
                dot={{ fill: '#60a5fa', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{
        backgroundColor: '#132f4c',
        padding: '1rem',
        borderRadius: '1rem',
        border: '1px solid #1e4976',
        overflowX: 'auto'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f8fafc' }}>
          Detailed Records
        </h2>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', fontSize: '0.875rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8', whiteSpace: 'nowrap' }}>Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8', whiteSpace: 'nowrap' }}>Odometer (km)</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8', whiteSpace: 'nowrap' }}>Distance (km)</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8', whiteSpace: 'nowrap' }}>Oil Added (ml)</th>
            </tr>
          </thead>
          <tbody>
            {data.slice().reverse().map((entry) => (
              <tr key={entry.id}>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                  {formatDate(entry.date)}
                </td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                  {entry.odometer.toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                  {entry.distance.toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                  {entry.oil.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OilDashboard;