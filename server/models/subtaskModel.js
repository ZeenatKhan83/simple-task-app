const db = require('../config/database');

const Subtask = {
  // Fetch all subtasks belonging to a specific parent task
  getByTaskId: (taskId, callback) => {
    const sql = 'SELECT * FROM subtasks WHERE taskId = ? ORDER BY createdAt ASC';
    db.all(sql, [taskId], callback);
  },

  // Create a new subtask checklist item
  create: (taskId, title, callback) => {
    const sql = 'INSERT INTO subtasks (taskId, title) VALUES (?, ?)';
    db.run(sql, [taskId, title], function(err) {
      callback(err, this ? this.lastID : null);
    });
  },

  // Toggle checklist status between 1 (Completed) and 0 (Pending)
  updateStatus: (id, isCompleted, callback) => {
    const sql = 'UPDATE subtasks SET isCompleted = ? WHERE id = ?';
    db.run(sql, [isCompleted, id], function(err) {
      callback(err, this ? this.changes : 0);
    });
  },

  // Remove a single subtask item
  delete: (id, callback) => {
    const sql = 'DELETE FROM subtasks WHERE id = ?';
    db.run(sql, [id], function(err) {
      callback(err, this ? this.changes : 0);
    });
  }
};

module.exports = Subtask;