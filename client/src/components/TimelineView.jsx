import React from 'react';

function TimelineView({ tasks = [] }) {
  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <div className="card-surface" style={{ padding: '24px' }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
        ⏳ Task Timeline Roadmap
      </h2>

      <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--borders)' }}>
        {sortedTasks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No scheduled tasks in orbit.</p>
        ) : (
          sortedTasks.map((task) => (
            <div 
              key={task.id} 
              style={{ 
                position: 'relative', 
                marginBottom: '24px',
                padding: '16px',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--borders)'
              }}
            >
              {/* Timeline Bullet Node */}
              <div style={{
                position: 'absolute',
                left: '-32px',
                top: '20px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: task.status === 'completed' ? 'var(--success)' : 'var(--primary)',
                border: '3px solid var(--bg-main)'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{task.title}</h4>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '2px 8px', 
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-secondary)'
                }}>
                  📅 {task.dueDate ? task.dueDate.split('T')[0] : 'No Target Date'}
                </span>
              </div>

              {task.description && (
                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {task.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  textTransform: 'uppercase', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontWeight: '700',
                  background: task.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                  color: task.priority === 'high' ? 'var(--danger)' : 'var(--primary)'
                }}>
                  {task.priority} Priority
                </span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  textTransform: 'uppercase', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  background: task.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: task.status === 'completed' ? 'var(--success)' : 'var(--warning)'
                }}>
                  {task.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TimelineView;