// controllers/milestoneController.js
const Milestone = require('../models/milestone');
const Project = require('../models/project');

// Create a new milestone
exports.createMilestone = async (req, res) => {
  const { projectId, milestoneGoal, dueDate } = req.body;

  try {
    // Check if the associated project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Create a new milestone
    const newMilestone = new Milestone({ projectId, milestoneGoal, dueDate });
    await newMilestone.save();

    res.status(201).json({ message: 'Milestone created successfully', newMilestone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all milestones for a specific project
exports.getMilestonesByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const milestones = await Milestone.find({ projectId });
    res.status(200).json(milestones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a specific milestone
exports.updateMilestone = async (req, res) => {
  const { milestoneId } = req.params;
  const { milestoneGoal, dueDate, status, completionDate } = req.body;

  try {
    const updatedMilestone = await Milestone.findByIdAndUpdate(
      milestoneId,
      { milestoneGoal, dueDate, status, completionDate },
      { new: true }
    );

    if (!updatedMilestone) return res.status(404).json({ error: 'Milestone not found' });

    res.status(200).json({ message: 'Milestone updated successfully', updatedMilestone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark a milestone as completed
exports.completeMilestone = async (req, res) => {
  const { milestoneId } = req.params;

  try {
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    milestone.status = 'Completed';
    milestone.completionDate = new Date();
    await milestone.save();

    res.status(200).json({ message: 'Milestone marked as completed', milestone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a milestone
exports.deleteMilestone = async (req, res) => {
  const { milestoneId } = req.params;

  try {
    const deletedMilestone = await Milestone.findByIdAndDelete(milestoneId);
    if (!deletedMilestone) return res.status(404).json({ error: 'Milestone not found' });

    res.status(200).json({ message: 'Milestone deleted successfully', deletedMilestone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
