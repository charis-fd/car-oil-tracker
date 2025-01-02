import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OilDashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://yeti-final-app.onrender.com/api/oils?populate=*');
      const result = await response.json();
      const sortedData = result.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setData(sortedData);
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short'
  });

  const calculateConsumption = (oil, distance) => distance ? ((oil / distance) * 100).toFixed(2) : 'N/A';

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
              {`${p.name}: ${p.value.toLocaleString()} ${p.dataKey === 'distance' ? 'km' : 'ml'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      backgroundColor: '#0a1929',
      minHeight: '100vh',
      padding: '2rem',
      color: '#e2e8f0'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        color: '#f8fafc'
      }}>Oil Consumption Dashboard</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#132f4c',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #1e4976'
        }}>
          <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Current Odometer</h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#60a5fa', marginBottom: '0.25rem' }}>
            {data[data.length-1]?.odometer?.toLocaleString()}
          </p>
          <p style={{ color: '#64748b' }}>kilometers</p>
        </div>

        <div style={{
          backgroundColor: '#132f4c',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #1e4976'
        }}>
          <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Latest Oil Added</h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#34d399', marginBottom: '0.25rem' }}>
            {data[data.length-1]?.oil?.toLocaleString()}
          </p>
          <p style={{ color: '#64748b' }}>milliliters</p>
        </div>

        <div style={{
          backgroundColor: '#132f4c',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #1e4976'
        }}>
          <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Consumption Rate</h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a78bfa', marginBottom: '0.25rem' }}>
            {calculateConsumption(data[data.length-1]?.oil, data[data.length-1]?.distance)}
          </p>
          <p style={{ color: '#64748b' }}>ml/100km</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#132f4c',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #1e4976'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f8fafc' }}>
            Oil Usage Trend
          </h2>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer>
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
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
      </div>

      <div style={{
        backgroundColor: '#132f4c',
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #1e4976'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc' }}>
            Historical Records
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{
              backgroundColor: '#1e4976',
              color: '#e2e8f0',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}>
              Export Data
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8' }}>Odometer (km)</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8' }}>Distance (km)</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8' }}>Oil Added (ml)</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #1e4976', color: '#94a3b8' }}>Consumption (ml/100km)</th>
              </tr>
            </thead>
            <tbody>
              {data.slice().reverse().map((entry) => (
                <tr key={entry.id} style={{
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s'
                }}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0' }}>{formatDate(entry.date)}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0' }}>{entry.odometer.toLocaleString()}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0' }}>{entry.distance.toLocaleString()}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0' }}>{entry.oil.toLocaleString()}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #1e4976', color: '#e2e8f0' }}>
                    {calculateConsumption(entry.oil, entry.distance)}
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