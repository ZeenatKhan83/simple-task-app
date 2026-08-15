const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Secure the entire router path block—any route defined below requires a valid JWT session
router.use(authMiddleware);

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);
router.get('/analytics/heatmap', authMiddleware, taskController.getHeatmapData);

module.exports = router;