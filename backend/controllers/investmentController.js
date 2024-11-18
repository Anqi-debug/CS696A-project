const Investment = require('../models/investment');
const Project = require('../models/project');
const User = require('../models/user');

// Create a new investment
exports.createInvestment = async (req, res) => {
  const { donorId, projectId, investmentAmount, potentialReturns } = req.body;
  try {
    const project = await Project.findById(projectId);
    const user = await User.findById(donorId);

    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newInvestment = new Investment({
      donorId,
      projectId,
      investmentAmount,
      potentialReturns,
    });
    await newInvestment.save();

    res.status(201).json({ message: 'Investment created successfully', newInvestment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all investments for a specific user
exports.getUserInvestments = async (req, res) => {
  const { donorId } = req.params;
  try {
    const investments = await Investment.find({ donorId }).populate('projectId');
    res.status(200).json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an investment status
exports.updateInvestmentStatus = async (req, res) => {
  const { investmentId } = req.params;
  const { status } = req.body;
  try {
    const investment = await Investment.findByIdAndUpdate(
      investmentId,
      { status },
      { new: true }
    );
    if (!investment) return res.status(404).json({ error: 'Investment not found' });
    res.status(200).json({ message: 'Investment status updated', investment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
