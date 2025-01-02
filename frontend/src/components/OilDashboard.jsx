import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const OilDashboard = () => {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({
    monitoringPeriod: 0,
    totalDistance: 0,
    totalOil: 0,
    dailyDistance: 0,
    efficiency: 0,
    consumption: 0,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://yeti-final-app.onrender.com/api/oils?populate=*');
      const result = await response.json();
      const sortedData = result.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setData(sortedData);
      
      // Calculate metrics
      const firstDate = new Date(sortedData[0].date);
      const lastDate = new Date(sortedData[sortedData.length - 1].date);
      const daysDiff = Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24));
      
      const totalDistance = sortedData.reduce((sum, record) => sum + record.distance, 0);
      const totalOilML = sortedData.reduce((sum, record) => sum + record.oil, 0);
      const totalOilL = totalOilML / 1000;
      
      setMetrics({
        monitoringPeriod: daysDiff,
        totalDistance,
        totalOil: totalOilL,
        dailyDistance: totalDistance / daysDiff,
        efficiency: totalDistance / totalOilL,
        consumption: (totalOilL * 1000) / totalDistance,
      });
    };
    fetchData();
  }, []);

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
        {typeof value === 'number' ? value.toLocaleString(undefined, {maximumFractionDigits: 2}) : value}
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
      }}>Oil Consumption Report</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <MetricCard
          title="Monitoring Period"
          value={metrics.monitoringPeriod}
          unit="days"
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
          unit="liters"
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
          value={metrics.consumption}
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
                tickFormatter={date => new Date(date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short'
                })}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: '0.75rem' }}
              />
              <YAxis 
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: '0.75rem' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{
                        backgroundColor: 'rgba(26, 32, 44, 0.95)',
                        padding: '1rem',
                        border: '1px solid #2d3748',
                        borderRadius: '0.375rem'
                      }}>
                        <p style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>
                          {new Date(label).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short'
                          })}
                        </p>
                        {payload.map((p, idx) => (
                          <p key={idx} style={{ color: '#e2e8f0' }}>
                            {`${p.name}: ${p.value} ml`}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
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
  );
};

export default OilDashboard;