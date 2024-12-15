const Project = require('../models/project');
const User = require('../models/user');
const mongoose = require('mongoose');

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
      frequency,
    } = req.body;

    // Validate creatorId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      return res.status(400).json({ message: 'Invalid creatorId format.' });
    }

    // Fetch creatorName from the User model
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found.' });
    }

    const creatorName = creator.username;

    // Handle uploaded files
    const portfolio = Array.isArray(req.files) ? req.files.map((file) => file.path) : [];
    if (portfolio.length > 5) {
      return res.status(400).json({ message: 'Portfolio can contain up to 5 files only.' });
    }

    // Create and save the project
    const newProject = new Project({
      creatorId,
      creatorName,
      campaignName,
      description,
      monthlyGoal,
      goalAmount,
      projectTimeline,
      status,
      portfolio,
    });

    const savedProject = await newProject.save();
    res.status(201).json({
      message: 'Recurring fundraiser created successfully.',
      project: savedProject,
    });
  } catch (error) {
    console.error('Error creating recurring fundraiser:', error);
    res.status(500).json({ message: 'Error creating recurring fundraiser.', error: error.message });
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

// Get all approved projects
exports.getApprovedProjects = async (req, res) => {
  try {
    const approvedProjects = await Project.find({ status: 'Approved' }).populate('creatorId', 'name');
    res.status(200).json({ projects: approvedProjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific project by ID
exports.getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId).populate('creatorId', 'username email');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ project });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { campaignName, description, monthlyGoal, goalAmount, projectTimeline } = req.body;

  try {
    // Validate input fields
    const updates = {};
    if (campaignName) updates.campaignName = campaignName;
    if (description) updates.description = description;
    if (monthlyGoal) {
      if (isNaN(monthlyGoal) || monthlyGoal <= 0) {
        return res.status(400).json({ error: 'Invalid monthly goal. Must be a positive number.' });
      }
      updates.monthlyGoal = monthlyGoal;
    }
    if (goalAmount) {
      if (isNaN(goalAmount) || goalAmount <= 0) {
        return res.status(400).json({ error: 'Invalid goal amount. Must be a positive number.' });
      }
      updates.goalAmount = goalAmount;
    }
    if (projectTimeline) updates.projectTimeline = projectTimeline;

    // Ensure no attempt to update the status
    delete updates.status;

    // Update the project
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

//Create a milestone
exports.getProjectMilestones = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Calculate milestone data
    const milestones = {
      monthlyGoal: project.monthlyGoal,
      fundsRaised: project.fundsRaised,
      totalRaised: project.totalRaised,
      goalAmount: project.goalAmount,
      achievedMonthly: project.fundsRaised / project.monthlyGoal * 100, // Percentage of monthly goal achieved
      achievedTotal: project.totalRaised / project.goalAmount * 100, // Percentage of total goal achieved
    };

    res.status(200).json({ milestones });
  } catch (err) {
    console.error('Error fetching milestones:', err);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
};

// Get all projects by a specific creator
exports.getProjectsByCreator = async (req, res) => {
  const { creatorId } = req.params;

  try {
    // Validate creatorId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      return res.status(400).json({ error: 'Invalid creator ID format.' });
    }

    const projects = await Project.find({ creatorId }).populate('creatorId', 'username email');
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this creator.' });
    }

    res.status(200).json({ projects });
  } catch (err) {
    console.error('Error fetching projects by creator:', err);
    res.status(500).json({ error: 'Failed to fetch projects for the creator.' });
  }
};

// Get all projects with optional sorting
exports.getSortedProjects = async (req, res) => {
  const { sortBy } = req.query; // Get the sort parameter from the query string

  let sortOptions = {};
  if (sortBy === 'campaignName') {
    sortOptions.campaignName = 1; // Sort by project name (ascending)
  } else if (sortBy === 'creatorName') {
    sortOptions.creatorName = 1; // Sort by creator name (ascending)
  }

  try {
    const projects = await Project.find().sort(sortOptions).populate('creatorId', 'name email');
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};