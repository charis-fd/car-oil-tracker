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

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      padding: '2rem',
      color: 'white'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        marginBottom: '2rem',
        color: '#f1f5f9'
      }}>Oil Consumption Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Current Odometer</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>
            {data[0]?.odometer?.toLocaleString()}
          </p>
          <p style={{ color: '#64748b' }}>kilometers</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Latest Oil Added</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399' }}>
            {data[0]?.oil?.toLocaleString()}
          </p>
          <p style={{ color: '#64748b' }}>milliliters</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Consumption Rate</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a78bfa' }}>
            {calculateConsumption(data[0]?.oil, data[0]?.distance)}
          </p>
          <p style={{ color: '#64748b' }}>ml/100km</p>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#1e293b', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f1f5f9' }}>
          Oil Usage Trend
        </h2>
        <div style={{ height: '400px' }}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorOil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="date" tickFormatter={formatDate} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '0.375rem'
                }}
              />
              <Area type="monotone" dataKey="oil" stroke="#60a5fa" fill="url(#colorOil)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#1e293b', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f1f5f9' }}>
          Historical Records
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #334155',
                  color: '#94a3b8'
                }}>Date</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #334155',
                  color: '#94a3b8'
                }}>Odometer (km)</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #334155',
                  color: '#94a3b8'
                }}>Distance (km)</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #334155',
                  color: '#94a3b8'
                }}>Oil Added (ml)</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #334155',
                  color: '#94a3b8'
                }}>Consumption (ml/100km)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr key={entry.id} style={{ 
                  borderBottom: '1px solid #334155',
                  transition: 'background-color 0.2s'
                }}>
                  <td style={{ padding: '0.75rem', color: '#e2e8f0' }}>{formatDate(entry.date)}</td>
                  <td style={{ padding: '0.75rem', color: '#e2e8f0' }}>{entry.odometer.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', color: '#e2e8f0' }}>{entry.distance.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', color: '#e2e8f0' }}>{entry.oil.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', color: '#e2e8f0' }}>
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