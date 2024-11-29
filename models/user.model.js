const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },// Name of the user
    email: { type: String, required: true, unique: true },// Unique email ID
    role: { type: String, enum: ['creator', 'admin'], required: true },// Role of the user
    createdProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], // References to created projects
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }], // References to donations made
    recurringDonations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],// References to recurring donations
    socialMediaLink: { type: String },// Map of social media platform and links (e.g., { "Twitter": "url", "LinkedIn": "url" })
    supporterLevel: { 
        type: String, 
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], // Supporter level classification
        default: 'Bronze' 
    },
    notifications: [{ type: String }],// Array of notifications
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically);

module.exports = mongoose.model('User', userSchema);
