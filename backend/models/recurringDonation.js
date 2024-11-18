const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Recurring Donation Schema
const recurringDonationSchema = new mongoose.Schema({
  donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // References the Users collection
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }, // References the Projects collection
  amount: { type: Number, required: true }, // Recurring donation amount
  frequency: { type: String, enum: ['monthly', 'yearly'], required: true }, // Frequency of the donation
  nextPaymentDate: { type: Date, required: true }, // Next scheduled payment date
  lastPaymentDate: { type: Date, default: null }, // Last donation date
  isActive: { type: Boolean, default: true } // Indicates if the recurring donation is active
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the RecurringDonation model
const RecurringDonation = mongoose.model('RecurringDonation', recurringDonationSchema);
module.exports = RecurringDonation;
