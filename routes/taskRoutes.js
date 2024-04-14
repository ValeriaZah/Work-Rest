const express = require('express');
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:date', protect, getTasks);
router.post('/', protect, addTask);
router.patch('/:taskId', protect, updateTask);
router.delete('/:taskId', protect, deleteTask);

module.exports = router;
