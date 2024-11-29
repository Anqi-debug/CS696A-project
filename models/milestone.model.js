const mongoose = require('mongoose');

// Define the Milestone schema
const milestoneSchema = new mongoose.Schema(
    {
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },  // Reference to the Project
        milestoneGoal: { type: Number, required: true },  // Goal to be achieved for this milestone
        isComplete: { type: Boolean, default: false },  // Whether the milestone is complete
        completionDate: { type: Date, default: null },  // Date when the milestone was completed
    },
    { timestamps: true }  // Adds createdAt and updatedAt fields automatically
);

// Create and export the Milestone model
module.exports = mongoose.model('Milestone', milestoneSchema);
