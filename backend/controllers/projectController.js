const Project = require('../models/project');
const Donation = require('../models/donation');

// Create a new recurring fundraiser with file upload support
exports.createRecurringFundraiser = async (req, res) => {
  try {
    const {
      creatorId,
      campaignName,
      description,
      monthlyGoal,
      goalAmount,
      projectTimeline,
      status,
      fundsRaised,
      donorCount,
      investmentTerms,
      frequency,
    } = req.body;

    // Handle uploaded files
    const portfolio = req.files.map((file) => file.path); // Save file paths

    // Validate input fields
    if (
      !creatorId ||
      !campaignName ||
      !description ||
      !monthlyGoal ||
      !goalAmount ||
      !projectTimeline ||
      !status ||
      !portfolio ||
      !fundsRaised ||
      !donorCount ||
      !investmentTerms ||
      !frequency
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create and save the project
    const newProject = new Project({
      creatorId,
      campaignName,
      description,
      monthlyGoal,
      goalAmount,
      projectTimeline,
      status,
      portfolio,
      fundsRaised,
      donorCount,
      investmentTerms,
    });

    const savedProject = await newProject.save();

    res.status(201).json({
      message: 'Recurring fundraiser created successfully',
      project: savedProject,
    });
  } catch (error) {
    console.error('Error creating recurring fundraiser:', error);
    res.status(500).json({ message: 'Error creating recurring fundraiser', error: error.message });
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
