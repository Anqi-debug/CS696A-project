const Donation = require('../models/donation');
const Project = require('../models/project');
const mongoose = require('mongoose');
const Notification = require('../models/notification');
const Stripe = require('stripe');
require('dotenv').config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.processStripePayment = async (req, res) => {
  const { amount, currency, projectId, donorId, token } = req.body;

  console.log('Processing Stripe Payment:', { amount, currency, projectId, donorId, token }); // Debug log

  try {
    if (!mongoose.Types.ObjectId.isValid(donorId)) {
      return res.status(400).json({ error: 'Invalid donorId format' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: currency || 'usd',
      source: token,
      description: `Donation for Project: ${project.campaignName}`,
    });

    const donation = new Donation({
      projectId,
      donorId: new mongoose.Types.ObjectId(donorId),
      amount,
      currency: currency || 'usd',
      paymentId: charge.id,
    });
    await donation.save();

    project.fundsRaised += amount;

    // Check if fundsRaised exceeds monthlyGoal
    if (project.fundsRaised >= project.monthlyGoal) {
      project.totalRaised += project.fundsRaised;
      project.fundsRaised = 0; // Reset fundsRaised for the next term

      const notification = new Notification({
        recipientId: project.creatorId,
        message: `Congratulations! Your project "${project.campaignName}" has exceeded its term ${project.term} goal.`,
      });
      await notification.save();
      project.term += 1;

      // Send the notification via WebSocket if configured
      const io = req.app.get('socketio');
      if (io) {
        io.to(project.creatorId.toString()).emit('notification', notification);
      }
    }

    // Check if totalRaised exceeds goalAmount
    if (project.totalRaised >= project.goalAmount) {
      const notification = new Notification({
        recipientId: project.creatorId,
        message: `Amazing! Your project "${project.campaignName}" has reached its overall goal.`,
      });
      await notification.save();

      // Send the notification via WebSocket if configured
      const io = req.app.get('socketio');
      if (io) {
        io.to(project.creatorId.toString()).emit('notification', notification);
      }
    }

    await project.save();

    res.status(200).json({ message: 'Donation successful', donation });
  } catch (err) {
    console.error('Error processing payment:', err.message);
    res.status(500).json({ error: 'Payment processing failed', details: err.message });
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
