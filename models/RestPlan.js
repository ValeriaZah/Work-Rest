const mongoose = require('mongoose');

const RestPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  exercises: [{ type: String, required: true }]
});

module.exports = mongoose.model('RestPlan', RestPlanSchema);
