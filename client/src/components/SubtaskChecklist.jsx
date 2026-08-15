import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';

function SubtaskChecklist({ taskId }) {
  const [subtasks, setSubtasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const loadSubtasks = async () => {
    try {
      const data = await taskService.getSubtasks(taskId);
      setSubtasks(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    loadSubtasks();
  }, [taskId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await taskService.createSubtask(taskId, newTitle.trim());
      setNewTitle('');
      loadSubtasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggle = async (subtaskId, currentStatus) => {
    try {
      // Toggle logic: if it is 1 (completed), send false to reset it to 0, and vice versa
      await taskService.updateSubtaskProgress(subtaskId, !currentStatus);
      loadSubtasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (e, subtaskId) => {
    e.stopPropagation(); // Prevents card selection misfires
    try {
      await taskService.deleteSubtask(subtaskId);
      loadSubtasks();
    } catch (err) {
      alert(err.message);
    }
  };

  // Telemetry Calculations
  const totalCount = subtasks.length;
  const completedCount = subtasks.filter(st => st.isCompleted === 1).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
      
      {/* Mini Progress Status Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
      >
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold' }}>
          {isExpanded ? '▼ SUB-MISSIONS' : '▶ SUB-MISSIONS'} ({completedCount}/{totalCount})
        </span>
        {totalCount > 0 && (
          <span style={{ color: progressPercent === 100 ? '#4AFFA5' : '#8AA4FF', fontSize: '0.75rem', fontWeight: 'bold' }}>
            {progressPercent}%
          </span>
        )}
      </div>

      {/* Visual Tracking Progress Gauge */}
      {totalCount > 0 && (
        <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${progressPercent}%`, 
            height: '100%', 
            background: progressPercent === 100 ? 'linear-gradient(90deg, #4A6FFF, #4AFFA5)' : 'var(--primary)',
            transition: 'width 0.3s ease-out' 
          }} />
        </div>
      )}

      {/* Checklist Expanded Sub-Panel Drawer */}
      {isExpanded && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* Subtask Mapping Layout */}
          {subtasks.map(st => (
            <div key={st.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.15)',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.02)'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: st.isCompleted ? 'var(--text-muted)' : '#FFF', textDecoration: st.isCompleted ? 'line-through' : 'none' }}>
                <input 
                  type="checkbox" 
                  checked={st.isCompleted === 1}
                  onChange={() => handleToggle(st.id, st.isCompleted === 1)}
                  style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                {st.title}
              </label>
              <button 
                onClick={(e) => handleDelete(e, st.id)}
                style={{ background: 'none', border: 'none', color: 'rgba(255, 74, 74, 0.6)', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                ✕
              </button>
            </div>
          ))}

          {/* Inline Subtask Entry Input */}
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <input 
              type="text"
              placeholder="+ Add micro-step definition..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                flex: 1,
                padding: '6px 10px',
                fontSize: '0.75rem',
                background: 'rgba(15, 20, 37, 0.4)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                color: '#FFF'
              }}
            />
            <button type="submit" style={{
              padding: '4px 10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              color: '#FFF',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Log
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SubtaskChecklist;