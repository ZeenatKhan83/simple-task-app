const Subtask = require('../models/subtaskModel');
const Task = require('../models/taskModel');

// Get all subtasks for a verified task
exports.getSubtasks = (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.userId;

  // Security check: Make sure the task belongs to the user requesting it
  Task.getById(taskId, userId, (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!task) return res.status(404).json({ message: 'Task workspace area not found or access denied.' });

    Subtask.getByTaskId(taskId, (subtaskErr, rows) => {
      if (subtaskErr) return res.status(500).json({ error: subtaskErr.message });
      res.json(rows);
    });
  });
};

// Add a subtask to a verified task
exports.createSubtask = (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;
  const userId = req.user.userId;

  if (!title) {
    return res.status(400).json({ message: 'A subtask title definition is required.' });
  }

  // Security check: Ensure user owns the parent task container
  Task.getById(taskId, userId, (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!task) return res.status(404).json({ message: 'Task workspace area not found or access denied.' });

    Subtask.create(taskId, title, (createErr, newId) => {
      if (createErr) return res.status(500).json({ error: createErr.message });
      res.status(201).json({ message: 'Subtask logged successfully.', subtaskId: newId });
    });
  });
};

// Toggle subtask status completion state
exports.updateSubtaskStatus = (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body; // Expecting true or false from the frontend

  const statusValue = isCompleted ? 1 : 0;

  Subtask.updateStatus(id, statusValue, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ message: 'Subtask node not found.' });
    res.json({ message: 'Subtask status synchronized successfully.' });
  });
};

// Delete a subtask row item
exports.deleteSubtask = (req, res) => {
  const { id } = req.params;

  Subtask.delete(id, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ message: 'Subtask node not found.' });
    res.json({ message: 'Subtask cleared from database.' });
  });
};