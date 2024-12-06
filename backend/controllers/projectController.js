const Project = require('../models/project');
const User = require('../models/user');
const Donation = require('../models/donation');

// Create a new recurring fundraiser
exports.createRecurringFundraiser = async (req, res) => {
  try {
      const {
          creatorId,
          campaignName,
          description,
          monthlyGoal, // Corrected spelling
          goalAmount,
          projectTimeline,
          status,
          portfolio,
          fundsRaised,
          donorCount,
          investmentTerms,
          donationAmount,
          frequency,
      } = req.body;

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
          !donationAmount ||
          !frequency
      ) {
          return res.status(400).json({ message: 'All fields are required.' });
      }

      // Create the project
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
          donations: [],
          recurringDonations: [],
          investments: [],
      });

      // Save the new project
      const savedProject = await newProject.save();

      // Create a recurring donation
      const newDonation = new Donation({
          donorId: creatorId, // Assuming creator is also the donor for recurring donations
          projectId: savedProject._id,
          amount: donationAmount,
          frequency,
          nextPaymentDate: new Date(),
          lastPaymentDate: null,
          isActive: true,
      });

      // Save the donation
      const savedDonation = await newDonation.save();

      // Link the recurring donation to the project
      savedProject.recurringDonations.push(savedDonation._id);
      await savedProject.save();

      res.status(201).json({
          message: 'Recurring fundraiser created successfully',
          project: savedProject,
      });
  } catch (error) {
      console.error('Error creating recurring fundraiser:', error);
      res.status(500).json({
          message: 'Error creating recurring fundraiser',
          error: error.message,
      });
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
