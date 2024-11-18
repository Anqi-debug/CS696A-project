const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Milestones Schema
const milestoneSchema = new mongoose.Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }, // References the Projects collection
  milestoneGoal: { type: Number, required: true }, // Funding goal for this milestone
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  completionDate: { type: Date, default: null } // Timestamp for when the milestone is completed
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the Milestone model
const Milestone = mongoose.model('Milestone', milestoneSchema);
module.exports = Milestone;
