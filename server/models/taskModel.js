const db = require('../config/database');

const Task = {
  // 1. Isolated read operations matching the owner user
  getAll: (filters, callback) => {
    let sql = 'SELECT * FROM tasks WHERE userId = ?';
    const params = [filters.userId]; // Always seed query parameters with the verified owner ID first

    if (filters) {
      if (filters.status) {
        sql += ' AND status = ?';
        params.push(filters.status);
      }
      if (filters.priority) {
        sql += ' AND priority = ?';
        params.push(filters.priority);
      }
      if (filters.search) {
        sql += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }
    }

    let orderBy = ' ORDER BY createdAt DESC';
    if (filters && filters.sortBy) {
      switch (filters.sortBy) {
        case 'oldest': orderBy = ' ORDER BY createdAt ASC'; break;
        case 'dueDate': orderBy = ' ORDER BY dueDate ASC'; break;
        case 'priority': 
          orderBy = " ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END ASC, createdAt DESC"; 
          break;
        default: orderBy = ' ORDER BY createdAt DESC'; break;
      }
    }
    sql += orderBy;

    db.all(sql, params, callback);
  },

  // 2. Individual task isolation lookup
  getById: (id, userId, callback) => {
    db.get('SELECT * FROM tasks WHERE id = ? AND userId = ?', [id, userId], callback);
  },

  // 3. User-assigned record creation
  create: (taskData, callback) => {
    const { userId, title, description, status, priority, dueDate } = taskData;
    const sql = `INSERT INTO tasks (userId, title, description, status, priority, dueDate) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [userId, title, description, status || 'todo', priority || 'medium', dueDate], function(err) {
      callback(err, this ? this.lastID : null);
    });
  },

  // 4. Secure full task mutation
  update: (id, userId, taskData, functionCallback) => {
    const { title, description, status, priority, dueDate } = taskData;
    const sql = `UPDATE tasks 
                 SET title = ?, description = ?, status = ?, priority = ?, dueDate = ?, updatedAt = CURRENT_TIMESTAMP 
                 WHERE id = ? AND userId = ?`;
    db.run(sql, [title, description, status, priority, dueDate, id, userId], function(err) {
      functionCallback(err, this ? this.changes : 0);
    });
  },

  // 5. Secure Kanban lane status updating
  updateStatus: (id, userId, status, functionCallback) => {
    const sql = `UPDATE tasks SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?`;
    db.run(sql, [status, id, userId], function(err) {
      functionCallback(err, this ? this.changes : 0);
    });
  },

  // 6. Secure deletion boundary checking
  delete: (id, userId, functionCallback) => {
    db.run('DELETE FROM tasks WHERE id = ? AND userId = ?', [id, userId], function(err) {
      functionCallback(err, this ? this.changes : 0);
    });
  }
};

module.exports = Task;