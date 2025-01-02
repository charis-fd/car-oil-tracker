import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const OilDashboard = () => {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalDistance: 0,
    totalOil: 0,
    avgEfficiency: 0,
    trend: []
  });
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://yeti-final-app.onrender.com/api/oils?populate=*');
      const result = await response.json();
      const sortedData = result.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setData(sortedData);
      
      // Calculate metrics
      const totalDistance = sortedData.reduce((sum, record) => sum + record.distance, 0);
      const totalOil = sortedData.reduce((sum, record) => sum + record.oil, 0);
      const avgEfficiency = (totalDistance / (totalOil / 1000)).toFixed(2); // km/L

      // Calculate running efficiency
      const trend = sortedData.map((record, index) => {
        const distanceToDate = sortedData.slice(0, index + 1)
          .reduce((sum, r) => sum + r.distance, 0);
        const oilToDate = sortedData.slice(0, index + 1)
          .reduce((sum, r) => sum + r.oil, 0);
        return {
          ...record,
          efficiency: (distanceToDate / (oilToDate / 1000)).toFixed(2)
        };
      });

      setMetrics({
        totalDistance,
        totalOil,
        avgEfficiency,
        trend
      });
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short'
  });

  const calculateConsumption = (oil, distance) => {
    if (!distance) return 'N/A';
    return ((oil / distance) / 10).toFixed(2); // L/1000km
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(26, 32, 44, 0.95)',
          padding: '1rem',
          border: '1px solid #2d3748',
          borderRadius: '0.375rem'
        }}>
          <p style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>{formatDate(label)}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: '#e2e8f0' }}>
              {`${p.name}: ${p.value} ${p.dataKey === 'efficiency' ? 'km/L' : 
                p.dataKey === 'distance' ? 'km' : 'ml'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const MetricCard = ({ title, value, unit, color, subtext }) => (
    <div style={{
      backgroundColor: '#132f4c',
      padding: '1rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #1e4976',
      marginBottom: '1rem'
    }}>
      <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{title}</h2>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color, marginBottom: '0.25rem' }}>
        {value}
      </p>
      <p style={{ color: '#64748b', fontSize: '0.75rem' }}>{unit}</p>
      {subtext && <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>{subtext}</p>}
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
      }}>Oil Consumption Dashboard</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <MetricCard
          title="Current Odometer"
          value={data[data.length-1]?.odometer?.toLocaleString()}
          unit="kilometers"
          color="#60a5fa"
        />
        <MetricCard
          title="Latest Oil Added"
          value={data[data.length-1]?.oil?.toLocaleString()}
          unit="milliliters"
          color="#34d399"
        />
        <MetricCard
          title="Current Consumption"
          value={calculateConsumption(data[data.length-1]?.oil, data[data.length-1]?.distance)}
          unit="L/1000km"
          color="#a78bfa"
        />
        <MetricCard
          title="Overall Efficiency"
          value={metrics.avgEfficiency}
          unit="kilometers per liter"
          color="#f472b6"
          subtext={`Total Distance: ${metrics.totalDistance.toLocaleString()}km`}
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
          Efficiency Trend
        </h2>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer>
            <LineChart data={metrics.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                name="Efficiency"
                stroke="#f472b6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{
        backgroundColor: '#132f4c',
        padding: '1rem',
        borderRadius: '1rem',
        marginBottom: '1.5rem',
        border: '1px solid #1e4976'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f8fafc' }}>
          Oil Usage Trend
        </h2>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="oil" 
                name="Oil Added"
                stroke="#60a5fa" 
                fill="url(#colorOil)" 
              />
            </AreaChart>
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f8fafc' }}>
            Historical Records
          </h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', fontSize: '0.875rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8', whiteSpace: 'nowrap' }}>Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8', whiteSpace: 'nowrap' }}>Odometer</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8', whiteSpace: 'nowrap' }}>Distance</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8', whiteSpace: 'nowrap' }}>Oil Added</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8', whiteSpace: 'nowrap' }}>L/1000km</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8', whiteSpace: 'nowrap' }}>km/L</th>
            </tr>
          </thead>
          <tbody>
            {data.slice().reverse().map((entry) => (
              <tr key={entry.id}>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0', whiteSpace: 'nowrap' }}>{formatDate(entry.date)}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0', whiteSpace: 'nowrap' }}>{entry.odometer.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0', whiteSpace: 'nowrap' }}>{entry.distance.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0', whiteSpace: 'nowrap' }}>{entry.oil.toLocaleString()}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                  {calculateConsumption(entry.oil, entry.distance)}
                </td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                  {((entry.distance / (entry.oil / 1000))).toFixed(2)}
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