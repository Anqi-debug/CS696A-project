const Donation = require('../models/donation');
const Project = require('../models/project');
const User = require('../models/user');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
      const { projectId } = req.params;
      const { donorId, amount } = req.body;

      // Validate donorId and amount
      if (!donorId || !amount || isNaN(amount) || amount <= 0) {
          return res.status(400).json({ message: 'Invalid payment data. Please provide donorId and a valid amount.' });
      }

      // Check if the project exists and its status
      const project = await Project.findById(projectId);
      if (!project) {
          return res.status(404).json({ message: 'Project not found' });
      }

      // Prevent donation if the project is cancelled or completed
      if (['cancelled', 'completed'].includes(project.status)) {
          return res.status(400).json({ message: `Payments are not accepted for ${project.status} projects.` });
      }

      // Process payment through Stripe
      const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          payment_method_types: ['card'], // Accept card payments
          metadata: { donorId, projectId }, // Include metadata for tracking
      });

      // Proceed with donation if the project is active
      const donation = new Donation({
          projectId,
          donorId,
          amount,
          paymentId: paymentIntent.id,
          status: paymentIntent.status,
      });
      await donation.save();

      // Increment the amountRaised for the project
      await Project.findByIdAndUpdate(projectId, {
          $inc: { amountRaised: amount }
      });
      
      const updatedProject = await Project.findById(projectId).select('amountRaised');
      
      res.send({
          status: 0,
          message: 'Donation successful',
          data: {
              donation,
              projectId,
              amountRaised: updatedProject.amountRaised
          }
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Fetch all donations for a specific user
exports.getUserDonation = async (req, res) => {
  const { donorId } = req.params;
  try {
    const donations = await Donation.find({ donorId }).populate('projectId');
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a donation (e.g., change amount or frequency)
exports.updateDonation = async (req, res) => {
  const { donationId } = req.params;
  const { amount, frequency, isActive, nextPaymentDate } = req.body;
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
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

// Cancel a donation
exports.cancelDonation = async (req, res) => {
  const { donationId } = req.params;
  try {
    const donation = await Donation.findByIdAndUpdate(
      donationId,
      { isActive: false },
      { new: true }
    );
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    res.status(200).json({ message: 'Donation canceled', donation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
