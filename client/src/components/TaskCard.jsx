import React from 'react';

function TaskCard({ task, onStatusChange, onDelete }) {
  // Simple helper to pick priority glow colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF4A4A';
      case 'medium': return '#FFB84D';
      default: return '#4A6FFF';
    }
  };

  return (
    <div style={{
      background: 'rgba(45, 53, 97, 0.2)',
      backdropFilter: 'blur(8px)',
      border: '1px solid var(--border-glass)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      transition: 'transform 0.2s ease'
    }}>
      {/* Top row: Title and Checkbox */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input 
            type="checkbox" 
            checked={task.status === 'completed'}
            onChange={(e) => onStatusChange(task.id, e.target.checked ? 'completed' : 'todo')}
            style={{ 
              width: '18px', 
              height: '18px', 
              cursor: 'pointer',
              accentColor: 'var(--primary)' 
            }}
          />
          <h4 style={{ 
            margin: 0, 
            fontSize: '1.1rem',
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            color: task.status === 'completed' ? 'var(--text-muted)' : '#FFFFFF'
          }}>
            {task.title}
          </h4>
        </div>

        <button 
          onClick={() => onDelete(task.id)}
          style={{
            background: 'none',
            border: 'none',
            color: '#FF4A4A',
            cursor: 'pointer',
            fontSize: '0.9rem',
            padding: '4px'
          }}
          title="Delete Task"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{ 
          margin: 0, 
          color: 'var(--text-muted)', 
          fontSize: '0.95rem',
          lineHeight: '1.4' 
        }}>
          {task.description}
        </p>
      )}

      {/* Meta row: Priority & Due Date */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        fontSize: '0.8rem',
        borderTop: '1px solid rgba(123, 142, 200, 0.1)',
        paddingTop: '12px',
        marginTop: '4px'
      }}>
        <span style={{ 
          color: getPriorityColor(task.priority),
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          ● {task.priority}
        </span>

        {task.dueDate && (
          <span style={{ color: 'var(--text-muted)' }}>
            📅 {task.dueDate}
          </span>
        )}
      </div>
    </div>
  );
}

export default TaskCard;