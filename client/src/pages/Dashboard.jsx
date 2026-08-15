import React from 'react';
import StatsCard from '../components/StatsCard';

function Dashboard({ tasks }) {
  // Compute analytics dynamically from real live database records
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo' || !t.status).length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;

  // Track today's operations count
  const todayString = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.dueDate === todayString).length;

  // Safely calculate completion metric ratio
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#E8EEFF' }}>
        Mission Dashboard Telemetry
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px' 
      }}>
        <StatsCard 
          title="Total Payload" 
          value={totalTasks} 
          color="#4A6FFF" 
          showProgress={true}
          percentage={completionPercentage}
        />
        <StatsCard 
          title="In Progress" 
          value={inProgressTasks} 
          color="#C026D3" 
        />
        <StatsCard 
          title="Pending Operations" 
          value={todoTasks} 
          color="#FFB84D" 
        />
        <StatsCard 
          title="High Priority Warning" 
          value={highPriorityTasks} 
          color="#FF4A4A" 
        />
        <StatsCard 
          title="Due Today" 
          value={todaysTasks} 
          color="#00F2FE" 
        />
      </div>
    </div>
  );
}

export default Dashboard;