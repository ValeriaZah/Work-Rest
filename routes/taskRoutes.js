const express = require('express');
const router = express.Router();
const { getTasks, addTask, modifyTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTasks);
router.post('/', protect, addTask);
router.put('/', protect, modifyTask);
router.delete('/', protect, deleteTask);

module.exports = router;