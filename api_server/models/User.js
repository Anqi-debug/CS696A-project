const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    role: { type: String, enum: ['Donor', 'Creator','Admin'], default: 'Donor', required: true },
    createdProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    donations: [{ type: Schema.Types.ObjectId, ref: 'Donation' }],
    recurringDonations: [{ type: Schema.Types.ObjectId, ref: 'Donation' }],
    socialMediaLinks: [{ type: String }],
    supporterLevel: { type: String },
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to update `updatedAt`
userSchema.pre('save', function (next) {
    this.createdAt = Date.now();
    next();
});
// Pre-save hook to update `updatedAt`
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;
