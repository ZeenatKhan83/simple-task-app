const Task = require('../models/taskModel');

// Handler for GET /api/tasks
exports.getAllTasks = (req, res) => {
  const { status, priority, search, sortBy } = req.query;
  const userId = req.user.userId; // Extracted dynamically from our validated token passport

  Task.getAll({ status, priority, search, sortBy, userId }, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Handler for GET /api/tasks/:id
exports.getTaskById = (req, res) => {
  const userId = req.user.userId;
  
  Task.getById(req.params.id, userId, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Task not found or unauthorized access.' });
    res.json(row);
  });
};

// Handler for POST /api/tasks
exports.createTask = (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'A task title is required.' });
  }

  // Pack the user's ID into the incoming record body
  const taskData = { ...req.body, userId: req.user.userId };

  Task.create(taskData, (err, newId) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Task logged successfully!', taskId: newId });
  });
};

// Handler for PUT /api/tasks/:id
exports.updateTask = (req, res) => {
  const userId = req.user.userId;

  Task.update(req.params.id, userId, req.body, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ message: 'Task modification rejected or unauthorized.' });
    res.json({ message: 'Task updated successfully!' });
  });
};

// Handler for PATCH /api/tasks/:id/status
exports.updateTaskStatus = (req, res) => {
  const { status } = req.body;
  const userId = req.user.userId;

  if (!status) {
    return res.status(400).json({ message: 'Status property required.' });
  }

  Task.updateStatus(req.params.id, userId, status, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ message: 'Status change rejected or unauthorized.' });
    res.json({ message: 'Task status updated successfully!' });
  });
};

// Handler for DELETE /api/tasks/:id
exports.deleteTask = (req, res) => {
  const userId = req.user.userId;

  Task.delete(req.params.id, userId, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ message: 'Task deletion rejected or unauthorized.' });
    res.json({ message: 'Task cleared from workspace.' });
  });
};
// Get activity stats for the heatmap (past 365 days or current year)
exports.getHeatmapData = (req, res) => {
  const userId = req.user.userId;
  const sql = `
    SELECT DATE(completedAt) as date, COUNT(*) as count 
    FROM activity_log 
    WHERE userId = ? 
    GROUP BY DATE(completedAt)
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Log activity whenever task status changes to 'completed'
exports.logTaskCompletion = (userId, taskId) => {
  const sql = `INSERT INTO activity_log (userId, taskId) VALUES (?, ?)`;
  db.run(sql, [userId, taskId], (err) => {
    if (err) console.error('Error logging activity:', err.message);
  });
};