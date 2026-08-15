const express = require('express');
const router = express.Router();
const subtaskController = require('../controllers/subtaskController');
const authMiddleware = require('../middleware/authMiddleware');

// Mount security barrier to ensure every checklist request carries a valid session token
router.use(authMiddleware);

router.get('/task/:taskId', subtaskController.getSubtasks);
router.post('/task/:taskId', subtaskController.createSubtask);
router.patch('/:id/status', subtaskController.updateSubtaskStatus);
router.delete('/:id', subtaskController.deleteSubtask);

module.exports = router;