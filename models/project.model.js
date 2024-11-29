const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    campaignName: { type: String, required: true },
    description: { type: String, required: true },
    montlyGoal: { type: Number, required: true },
    goalAmount: { type: Number, required: true },
    projectTimeline: { type: String, required: true },
    status: { type: String, default: 'active' },
    portfolio: { type: String },
    fundsRaised: { type: Number, default: 0 },
    donorCount: { type: Number, default: 0 },
    investmentTerms: { type: String },
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
    recurringDonations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
    investments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
    updates: [{ type: String }],
});

module.exports = mongoose.model('Project', projectSchema);
