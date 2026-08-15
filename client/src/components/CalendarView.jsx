import React, { useState } from 'react';

function CalendarView({ tasks = [], onStatusChange, onDeleteTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigation helpers
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Calendar math
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Map tasks to their due date (YYYY-MM-DD)
  const tasksByDate = {};
  tasks.forEach((task) => {
    if (task.dueDate) {
      const dateKey = task.dueDate.split('T')[0];
      if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
      tasksByDate[dateKey].push(task);
    }
  });

  const calendarCells = [];
  // Empty slots before month start
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} style={{ background: 'var(--surface)', borderRadius: '8px', minHeight: '100px', opacity: 0.3 }} />);
  }

  // Days of month
  for (let day = 1; day <= totalDays; day++) {
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = (month + 1).toString().padStart(2, '0');
    const dateKey = `${year}-${formattedMonth}-${formattedDay}`;
    const dayTasks = tasksByDate[dateKey] || [];

    const isToday = 
      day === new Date().getDate() && 
      month === new Date().getMonth() && 
      year === new Date().getFullYear();

    calendarCells.push(
      <div 
        key={day} 
        style={{ 
          background: 'var(--surface)', 
          border: isToday ? '1px solid var(--primary)' : '1px solid var(--borders)', 
          borderRadius: '8px', 
          padding: '8px', 
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: '700', 
            color: isToday ? 'var(--primary)' : 'var(--text-primary)',
            background: isToday ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {day}
          </span>
          {dayTasks.length > 0 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', maxHeight: '80px' }}>
          {dayTasks.map((t) => (
            <div 
              key={t.id} 
              style={{ 
                fontSize: '0.75rem', 
                padding: '4px 6px', 
                borderRadius: '4px', 
                background: t.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'var(--card)',
                borderLeft: `3px solid ${t.priority === 'high' ? 'var(--danger)' : t.priority === 'medium' ? 'var(--warning)' : 'var(--primary)'}`,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={t.title}
            >
              {t.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-surface" style={{ padding: '24px' }}>
      {/* Calendar Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
          📅 {monthNames[month]} {year}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={prevMonth} className="input-field" style={{ padding: '6px 12px', cursor: 'pointer' }}>◀ Prev</button>
          <button onClick={() => setCurrentDate(new Date())} className="input-field" style={{ padding: '6px 12px', cursor: 'pointer' }}>Today</button>
          <button onClick={nextMonth} className="input-field" style={{ padding: '6px 12px', cursor: 'pointer' }}>Next ▶</button>
        </div>
      </div>

      {/* Weekday Names */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '8px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid of Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {calendarCells}
      </div>
    </div>
  );
}

export default CalendarView;