import React, { useState } from 'react';
import TaskCard from '../components/TaskCard';

function Tasks({ tasks, onAddTask, onStatusChange, onDeleteTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      // Package the task data cleanly
      await onAddTask({
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="responsive-two-col">

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
            <label htmlFor="task-title" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Task Title *</label>
            <input
              id="task-title"
              type="text"
              required
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', background: 'rgba(15, 20, 37, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF' }}
            />
          </div>

          <div>
            <label htmlFor="task-description" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
            <textarea
              id="task-description"
              placeholder="Provide a deep space mission briefing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', background: 'rgba(15, 20, 37, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF', resize: 'vertical' }}
            />
          </div>

          <div className="form-row-two">
            <div>
              <label htmlFor="task-priority" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Priority</label>
              <select
                id="task-priority"
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
              <label htmlFor="task-due-date" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Due Date</label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '9px', boxSizing: 'border-box', background: 'rgba(15, 20, 37, 0.6)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#FFF' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ marginTop: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {submitting && <span className="spinner" aria-hidden="true" />}
            {submitting ? 'Deploying...' : 'Deploy Task'}
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
          <div className="empty-state">
            <div className="empty-icon">🛰️</div>
            <p className="empty-title">Orbit is clear</p>
            <p className="empty-subtitle">No active tasks found. Create one to get started.</p>
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
