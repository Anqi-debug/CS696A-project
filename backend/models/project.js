const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const milestoneSchema = require('./milestone');

// Define Promotion Schema (embedded in Projects Collection)
const promotionSchema = new Schema({
  platform: { type: String, required: true },
  postDate: { type: Date, required: true },
  analytics: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
}, { _id: false });

// Define Project Schema
const projectSchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  campaignName: { type: String, required: true },
  description: { type: String, required: true },
  monthlyGoal: { type: Number },
  goalAmount: { type: Number, required: true },
  projectTimeline: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  portfolio: [{ type: String, maxlength: 5 }], // Stores up to 5 portfolio files or images
  //milestones: [milestoneSchema],
  fundsRaised: { type: Number, default: 0 },
  donorCount: { type: Number, default: 0 },
  investmentTerms: { type: String },
  recurringDonations: [{ type: Schema.Types.ObjectId, ref: 'RecurringDonation' }],
  investments: [{ type: Schema.Types.ObjectId, ref: 'Investment' }],
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  promotions: [promotionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export the Project model
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

  