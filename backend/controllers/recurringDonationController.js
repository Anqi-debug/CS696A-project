const RecurringDonation = require('../models/recurringDonation');
const Project = require('../models/project');
const User = require('../models/user');

// Create a new recurring donation
exports.createRecurringDonation = async (req, res) => {
  const { donorId, projectId, amount, frequency, nextPaymentDate } = req.body;
  try {
    // Validate project and user existence
    const project = await Project.findById(projectId);
    const user = await User.findById(donorId);

    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newDonation = new RecurringDonation({
      donorId,
      projectId,
      amount,
      frequency,
      nextPaymentDate,
    });
    await newDonation.save();

    res.status(201).json({ message: 'Recurring donation created successfully', newDonation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all recurring donations for a specific user
exports.getUserRecurringDonations = async (req, res) => {
  const { donorId } = req.params;
  try {
    const donations = await RecurringDonation.find({ donorId }).populate('projectId');
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a recurring donation (e.g., change amount or frequency)
exports.updateRecurringDonation = async (req, res) => {
  const { donationId } = req.params;
  const { amount, frequency, isActive, nextPaymentDate } = req.body;
  try {
    const updatedDonation = await RecurringDonation.findByIdAndUpdate(
      donationId,
      { amount, frequency, isActive, nextPaymentDate },
      { new: true }
    );
    if (!updatedDonation) return res.status(404).json({ error: 'Donation not found' });
    res.status(200).json({ message: 'Donation updated successfully', updatedDonation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel a recurring donation
exports.cancelRecurringDonation = async (req, res) => {
  const { donationId } = req.params;
  try {
    const donation = await RecurringDonation.findByIdAndUpdate(
      donationId,
      { isActive: false },
      { new: true }
    );
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    res.status(200).json({ message: 'Recurring donation canceled', donation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
