const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  tasks: [{
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    timeStart: { type: String },
    timeEnd: { type: String }
  }]
});

module.exports = mongoose.model('Task', TaskSchema);
