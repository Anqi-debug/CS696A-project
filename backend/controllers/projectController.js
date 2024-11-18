const Project = require('../models/project');
const User = require('../models/user');

// Create a new project
exports.createProject = async (req, res) => {
  const { creatorId, campaignName, description, monthlyGoal, goalAmount, projectTimeline, portfolio, milestones, investmentTerms } = req.body;

  try {
    // Ensure the creator exists and is a 'creator' role
    const creator = await User.findById(creatorId);
    if (!creator || creator.role !== 'creator') {
      return res.status(403).json({ error: 'Only creators can create projects' });
    }

    const newProject = new Project({
      creatorId,
      campaignName,
      description,
      monthlyGoal,
      goalAmount,
      projectTimeline,
      portfolio,
      milestones,
      investmentTerms,
    });

    await newProject.save();

    // Link the project to the user's createdProjects
    creator.createdProjects.push(newProject._id);
    await creator.save();

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('creatorId', 'name email');
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific project by ID
exports.getProjectById = async (req, res) => {
  const { projectId } = req.params;
  
  try {
    const project = await Project.findById(projectId).populate('creatorId', 'name email');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  const { projectId } = req.params;
  const updates = req.body;

  try {
    const project = await Project.findByIdAndUpdate(projectId, updates, { new: true });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
