import React, { useState } from 'react';
import TaskCard from '../components/TaskCard';

function Tasks({ tasks, onAddTask, onStatusChange, onDeleteTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Package the task data cleanly
    onAddTask({
      title,
      description,
      priority,
      dueDate,
      status: 'todo'
    });

    // Clear form inputs
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
      
      {/* Left Hand Column: Creation Form */}
      <section style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-glass)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem' }}>Create Cosmic Task</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Task Title *</label>
            <input 
              type="text" 
              required
              placeholder="What needs to be done?" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', background: 'rgba(15, 20, 37, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
            <textarea 
              placeholder="Provide a deep space mission briefing..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', background: 'rgba(15, 20, 37, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Priority</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(15, 20, 37, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF' }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Due Date</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '9px', boxSizing: 'border-box', background: 'rgba(15, 20, 37, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF' }}
              />
            </div>
          </div>

          <button type="submit" style={{ marginTop: '8px', padding: '12px', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: '#FFF', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
            Deploy Task
          </button>
        </form>
      </section>

      {/* Right Hand Column: Dynamic Task List */}
      <section>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Active Operations</span>
          <span style={{ color: 'var(--primary)', fontSize: '1rem' }}>({tasks.length})</span>
        </h3>

        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '2px dashed var(--border-glass)', borderRadius: '12px' }}>
            Orbit is clear. No active tasks found.
          </div>
        ) : (
          <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '8px' }}>
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onStatusChange={onStatusChange}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default Tasks;