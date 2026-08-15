import React from 'react';
import SubtaskChecklist from './SubtaskChecklist';

function KanbanBoard({ tasks, onStatusChange, onDeleteTask }) {
  const columns = [
    { id: 'todo', title: '🌌 To Do', color: '#6366f1' },
    { id: 'in-progress', title: '🚀 In Progress', color: '#f59e0b' },
    { id: 'completed', title: '✅ Completed', color: '#10b981' }
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onStatusChange(taskId, targetStatus);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '24px',
      marginTop: '20px',
      alignItems: 'start'
    }}>
      {columns.map(column => {
        const columnTasks = tasks.filter(t => t.status === column.id);

        return (
          <div 
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            style={{
              background: 'rgba(15, 18, 36, 0.4)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-glass)',
              borderRadius: '16px',
              padding: '20px',
              minHeight: '500px',
              transition: 'background 0.2s ease'
            }}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: column.color }} />
                {column.title}
              </h3>
              <span style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {columnTasks.length}
              </span>
            </div>

            {/* Task Cards Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {columnTasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="kanban-card"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'grab',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '1rem', 
                      color: '#FFFFFF',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      opacity: task.status === 'completed' ? 0.6 : 1
                    }}>
                      {task.title}
                    </h4>
                    <button 
                      onClick={() => onDeleteTask(task.id)}
                      style={{ background: 'none', border: 'none', color: '#FF4A4A', cursor: 'pointer', fontSize: '0.8rem', padding: '2px' }}
                      title="Delete Task"
                    >
                      ✕
                    </button>
                  </div>

                  {task.description && (
                    <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {task.description}
                    </p>
                  )}

                  {/* Reactive Subtask Component */}
                  <SubtaskChecklist taskId={task.id} />

                  {/* Card Actions Footer */}
                  <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* NEW: Quick Action Status Selector */}
                    <select 
                      value={task.status} 
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem' }}>
                      <span style={{ 
                        color: task.priority === 'high' ? '#FF4A4A' : task.priority === 'medium' ? '#FFB84D' : '#6366f1', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase' 
                      }}>
                        {task.priority}
                      </span>
                      {task.dueDate && <span style={{ color: 'var(--text-muted)' }}>📅 {task.dueDate}</span>}
                    </div>
                  </div>
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.15)', fontSize: '0.85rem', padding: '30px 0', border: '1px dashed rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                  Empty Orbit
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KanbanBoard;