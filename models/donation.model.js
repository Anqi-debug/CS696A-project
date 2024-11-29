const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, enum: ['weekly', 'monthly'], required: true },
    lastPaymentDate: { type: Date },
    nextPaymentDate: { type: Date },
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Donation', donationSchema);
