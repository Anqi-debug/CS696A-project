const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Donation Schema
const DonationSchema = new mongoose.Schema(
  {
    donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // References the Users collection
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }, // References the Projects collection
    amount: { type: Number, required: true, min: 1 }, // Donation amount
    currency: { type: String, default: 'usd' }, // Currency of the donation
    paymentId: { type: String, required: true }, // Stripe payment ID for transaction reference
    isRecurring: { type: Boolean, default: false }, // Indicates if the donation is recurring
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the Donation model
const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;
