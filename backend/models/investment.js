const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Investments Schema
const investmentSchema = new mongoose.Schema({
  donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // References the Users collection
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }, // References the Projects collection
  investmentAmount: { type: Number, required: true }, // Amount invested
  potentialReturns: { type: Number, default: 0 }, // Projected returns based on project success
  date: { type: Date, default: Date.now }, // Date of investment
  status: { 
    type: String, 
    enum: ['active', 'completed', 'canceled'], 
    default: 'active' // Tracks the investment status
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the Investment model
const Investment = mongoose.model('Investment', investmentSchema);
module.exports = Investment;
