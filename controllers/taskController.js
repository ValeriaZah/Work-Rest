const asyncHandler = require('express-async-handler');
const Task = require('../models/task.js');

exports.getTasks = asyncHandler(async (req, res) => {
    const { date } = req.params;
    const tasks = await Task.findOne({ userId: req.user.id, date });

    if (!tasks) {
        res.status(404);
        throw new Error('No tasks found on this date');
    }

    res.json(tasks);
});

exports.addTask = asyncHandler(async (req, res) => {
    const { date, description, timeStart, timeEnd } = req.body;
    
    if (!date || !description || !timeStart || !timeEnd) {
        res.status(400);
        throw new Error('All fields are required');
    }

    const task = new Task({
        userId: req.user.id,
        date,
        tasks: [{ description, timeStart, timeEnd, completed: false }]
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
});

exports.updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { description, timeStart, timeEnd, completed } = req.body;

    const task = await Task.findOne({ "tasks._id": taskId });

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const subTask = task.tasks.id(taskId);
    if (description) subTask.description = description;
    if (timeStart) subTask.timeStart = timeStart;
    if (timeEnd) subTask.timeEnd = timeEnd;
    if (completed !== undefined) subTask.completed = completed;

    await task.save();
    res.json(subTask);
});

exports.deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findOneAndUpdate(
        { "tasks._id": taskId },
        { $pull: { tasks: { _id: taskId } } },
        { new: true }
    );

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    res.status(204).json({ message: 'Task removed' });
});
