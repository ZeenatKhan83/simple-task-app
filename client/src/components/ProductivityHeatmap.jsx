import React, { useEffect, useState } from 'react';

function ProductivityHeatmap({ userId }) {
  const [activityData, setActivityData] = useState({});

  useEffect(() => {
    // Fetch completion stats from backend
    const fetchHeatmap = async () => {
      try {
        const url = userId 
          ? `http://localhost:5000/api/activity/heatmap?userId=${userId}`
          : 'http://localhost:5000/api/activity/heatmap';

        const res = await fetch(url);
        const data = await res.json();
        
        // Convert array [{date: '2026-07-23', count: 3}] to object {'2026-07-23': 3}
        const map = {};
        data.forEach(item => {
          map[item.date] = item.count;
        });
        setActivityData(map);
      } catch (err) {
        console.error('Error fetching heatmap:', err);
      }
    };

    fetchHeatmap();
  }, [userId]);

  // Generate the last 84 days (12 weeks x 7 days)
  const generateDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const count = activityData[dateStr] || 0;
      days.push({ date: dateStr, count });
    }
    return days;
  };

  // Assign background color from your 7-color palette based on activity count
  const getCellColor = (count) => {
    if (count === 0) return '#FFFFFF'; // Empty / No activity
    if (count === 1) return '#CAD0AD'; // Low Activity (Soft Sage)
    if (count <= 3) return '#67C267';  // Medium Activity (Vibrant Green)
    return '#2D5944';                  // High Activity (Forest Green)
  };

  const days = generateDays();

  return (
    <div className="card-surface" style={{ padding: '20px', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--c7)' }}>
          🔥 Productivity Heatmap
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--c1)' }}>Recent Activity Grid</span>
      </div>

      {/* Grid Layout: 12 columns (weeks) x 7 rows (days) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(7, 1fr)',
        gridAutoFlow: 'column',
        gap: '4px',
        maxWidth: '100%',
        overflowX: 'auto'
      }}>
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.count} tasks completed`}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '3px',
              border: '1px solid var(--c1)',
              backgroundColor: getCellColor(day.count),
              transition: 'transform 0.15s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--c1)' }}>
        <span>Less</span>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#FFFFFF', border: '1px solid var(--c1)', borderRadius: '2px' }}></div>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#CAD0AD', borderRadius: '2px' }}></div>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#67C267', borderRadius: '2px' }}></div>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#2D5944', borderRadius: '2px' }}></div>
        <span>More</span>
      </div>
    </div>
  );
}

export default ProductivityHeatmap;