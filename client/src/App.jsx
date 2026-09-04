import { useState, useEffect } from 'react';
import { taskService } from './services/taskService';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import KanbanBoard from './components/KanbanBoard';
import AuthView from './components/AuthView';
import LandingPage from './components/LandingPage';
import FocusTimer from './components/FocusTimer';
import ProductivityHeatmap from './components/ProductivityHeatmap';
import CalendarView from './components/CalendarView';
import TimelineView from './components/TimelineView';

function App() {
  // --- SESSION STATE ---
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(
    localStorage.getItem('username') ? { username: localStorage.getItem('username') } : null
  );

  // --- PRE-AUTH VIEW: 'landing' or 'auth' ---
  const [preAuthView, setPreAuthView] = useState('landing');

  // --- APP STATE ---
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('list');

  // --- FILTER & SEARCH STATE ---
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // --- MOUSE TRACKING FOR ANIMATED GRID ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- AUTH HANDLERS ---
  const handleAuthSuccess = (newToken, userProfile) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', userProfile.username);
    setToken(newToken);
    setUser(userProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
    setUser(null);
    setTasks([]);
  };

  // --- TASK API OPERATIONS ---
  const fetchTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const filters = { search, status: statusFilter, priority: priorityFilter, sortBy };
      const data = await taskService.getTasks(filters);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      if (err.message.includes('Session expired') || err.message.includes('token') || err.message.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token, search, statusFilter, priorityFilter, sortBy]);

  const handleAddTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await taskService.updateTaskStatus(id, newStatus);
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to remove this task?')) return;
    try {
      await taskService.deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- RENDER LOGIN VIEW IF UNAUTHENTICATED ---
  if (!token) {
    if (preAuthView === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setPreAuthView('auth')}
          onSignIn={() => setPreAuthView('auth')}
        />
      );
    }

    return (
      <div className="app-shell">
       {/* FLOATING WORKSPACE BACKGROUND OBJECTS */}
        <div className="bg-workspace-container">
          <div className="floating-item">📝</div>
          <div className="floating-item">✏️</div>
          <div className="floating-item">📌</div>
          <div className="floating-item">📋</div>
          <div className="floating-item">🎯</div>
        </div>
        <button
          onClick={() => setPreAuthView('landing')}
          style={{
            display: 'block', margin: '20px auto 0 auto', background: 'none', border: 'none',
            cursor: 'pointer', textAlign: 'center', fontSize: '2.5rem', color: 'var(--text-primary)',
            fontWeight: '800', padding: 0
          }}
        >
          Momentum
        </button>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '40px' }}>
          Next-Gen Productivity Workspace
        </p>
        <AuthView onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  // --- RENDER MAIN WORKSPACE IF AUTHENTICATED ---
  return (
    <div className="app-shell" style={{ minHeight: '100vh' }}>
      {/* BACKGROUND GRID LAYER */}
      <div className="animated-grid-bg" />

 {/* HEADER SECTION */}
<header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
  <div>
    <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0, fontWeight: '800', letterSpacing: '-0.5px' }}>
      Momentum
    </h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Workspace</span>
      <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        👤 {user?.username}
      </span>
      <button 
        onClick={handleLogout} 
        style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.8rem', cursor: 'pointer', padding: 0, fontWeight: '600' }}
      >
        Sign out
      </button>
    </div>
  </div>

  {/* MODERN VIEW SWITCHER TABS */}
  <div style={{ display: 'flex', gap: '4px', background: 'var(--surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--borders)' }}>
    {[
      { id: 'list', label: '📋 List' },
      { id: 'kanban', label: '📊 Kanban' },
      { id: 'calendar', label: '📅 Calendar' },
      { id: 'timeline', label: '⏳ Timeline' },
    ].map((tab) => (
      <button
        key={tab.id}
        onClick={() => setCurrentView(tab.id)}
        style={{
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          background: currentView === tab.id ? 'var(--primary)' : 'transparent',
          color: currentView === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
          fontWeight: '600',
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: currentView === tab.id ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none'
        }}
      >
        {tab.label}
      </button>
    ))}
  </div>
</header>

      {/* DASHBOARD CONTENT */}
      {loading && tasks.length === 0 ? (
        <div className="loading-state">
          <span className="spinner" aria-hidden="true" />
          <span>Loading workspace...</span>
        </div>
      ) : (
        <>
          <Dashboard tasks={tasks} />

          <FocusTimer tasks={tasks} />
          <ProductivityHeatmap />

          {/* SEARCH & FILTER TOOLBAR */}
          <div className="card-surface filter-toolbar" style={{ padding: '16px 20px', marginTop: '24px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search tasks..." 
              aria-label="Search tasks"
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="input-field" 
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field" aria-label="Filter by status">
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="input-field" aria-label="Filter by priority">
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field" aria-label="Sort tasks">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">High Priority First</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>

          {/* ACTIVE VIEW (LIST, KANBAN, CALENDAR, OR TIMELINE) */}
          <div style={{ paddingTop: '28px' }}>
            {currentView === 'list' && (
              <Tasks tasks={tasks} onAddTask={handleAddTask} onStatusChange={handleStatusChange} onDeleteTask={handleDeleteTask} />
            )}
            {currentView === 'kanban' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '6px', fontWeight: '700' }}>Task Progression Board</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 0, marginBottom: '20px' }}>
                  Drag cards across lanes to update real-time status.
                </p>
                <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} onDeleteTask={handleDeleteTask} />
              </div>
            )}
            {currentView === 'calendar' && (
              <CalendarView tasks={tasks} onStatusChange={handleStatusChange} onDeleteTask={handleDeleteTask} />
            )}
            {currentView === 'timeline' && (
              <TimelineView tasks={tasks} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;