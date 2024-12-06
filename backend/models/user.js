const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  role: { type: String, enum: ['donor', 'creator', 'admin'], required: true },
  createdProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  donations: [{ type: Schema.Types.ObjectId, ref: 'Donation' }],
  recurringDonations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
  investments: [{ type: Schema.Types.ObjectId, ref: 'Investment' }],
  socialMediaLinks: [{ type: String }], // Social media links (e.g., LinkedIn, Twitter)
  supporterLevel: { type: String, enum: ['Bronze', 'Silver', 'Gold'], default: 'Bronze' },
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  bio: { type: String, default: '' }, // Creator bio
  portfolioItems: [{ type: String }], // Array of URLs (images, videos, etc.)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
    if (this.isNew) { // Only set `createdAt` when the document is new
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now(); // Always update `updatedAt`
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;