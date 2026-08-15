import React from 'react';

function StatsCard({ title, value, color = 'var(--primary)', showProgress = false, percentage = 0 }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-glass)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top glowing subtle line indicator */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`
      }} />

      <span style={{ 
        color: 'var(--text-muted)', 
        fontSize: '0.85rem', 
        textTransform: 'uppercase', 
        letterSpacing: '1px',
        fontWeight: '600'
      }}>
        {title}
      </span>
      
      <span style={{ 
        color: '#FFFFFF', 
        fontSize: '2.2rem', 
        fontWeight: 'bold',
        lineHeight: '1'
      }}>
        {value}
      </span>

      {/* Optional Progress Bar with a clean cosmic gradient layout */}
      {showProgress && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '4px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              width: `${percentage}%`, 
              height: '100%', 
              background: `linear-gradient(45deg, ${color}, #C026D3)`,
              borderRadius: '4px',
              transition: 'width 0.5s ease-out'
            }} />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
            {percentage}% Operations Cleared
          </span>
        </div>
      )}
    </div>
  );
}

export default StatsCard;