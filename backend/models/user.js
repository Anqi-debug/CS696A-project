const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['creator', 'donor', 'admin'], required: true },
  createdProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  recurringDonations: [{ type: Schema.Types.ObjectId, ref: 'RecurringDonation' }],
  investments: [{ type: Schema.Types.ObjectId, ref: 'Investment' }],
  socialMediaLinks: [{ type: String }], // Social media links (e.g., LinkedIn, Twitter)
  supporterLevel: { type: String, enum: ['Bronze', 'Silver', 'Gold'], default: 'Bronze' },
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  bio: { type: String, default: '' }, // Creator bio
  portfolioItems: [{ type: String }], // Array of URLs (images, videos, etc.)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;