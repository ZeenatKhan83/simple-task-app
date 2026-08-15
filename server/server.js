const express = require('express');
const cors = require('cors');
const db = require('./config/database'); 
const taskRoutes = require('./routes/taskRoutes'); 
const authRoutes = require('./routes/authRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Health & Base Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Momentum API!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// 2. Heatmap API Endpoint
app.get('/api/activity/heatmap', (req, res) => {
  const userId = req.query.userId;
  const query = `
    SELECT 
      completedAt as date, 
      COUNT(*) as count 
    FROM activity_log 
    ${userId ? 'WHERE userId = ?' : ''}
    GROUP BY completedAt
    ORDER BY completedAt ASC
  `;
  const params = userId ? [userId] : [];

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// 3. Mark Task Completed & Log Activity Endpoint
app.put('/api/tasks/:id/complete', (req, res) => {
  const taskId = req.params.id;
  const userId = req.body.userId || 1;
  const today = new Date().toISOString().split('T')[0];

  db.run(`UPDATE tasks SET status = 'completed' WHERE id = ?`, [taskId], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    db.run(
      `INSERT INTO activity_log (userId, taskId, action, completedAt) VALUES (?, ?, 'completed', ?)`,
      [userId, taskId, today],
      (logErr) => {
        if (logErr) console.error('Failed to log activity:', logErr.message);
        res.json({ message: 'Task marked as completed and logged to activity grid!' });
      }
    );
  });
});

// 4. Existing Modular Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subtasks', subtaskRoutes); 

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});