const { tasks } = require('../DataStore');

exports.getTasks = async (req, res) => {
  const userTasks = tasks.filter(task => task.userId === req.user.userId);
  res.send(userTasks);
};

exports.addTask = async (req, res) => {
  const { date, title, startTime, endTime } = req.body;
  const newTask = { id: tasks.length + 1, userId: req.user.userId, date, title, startTime, endTime, completed: false };
  tasks.push(newTask);
  res.status(201).send(newTask);
};

exports.modifyTask = async (req, res) => {
  const { taskId, title, startTime, endTime, completed } = req.body;
  const task = tasks.find(task => task.id === taskId && task.userId === req.user.userId);
  if (!task) return res.status(404).send("Task not found.");

  task.title = title;
  task.startTime = startTime;
  task.endTime = endTime;
  task.completed = completed;
  res.send(task);
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.body;
  const index = tasks.findIndex(task => task.id === taskId && task.userId === req.user.userId);
  if (index === -1) return res.status(404).send("Task not found.");

  tasks.splice(index, 1);
  res.send({ success: true });
};
