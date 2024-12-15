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
  creatorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  creatorName: { type: String, required: true },
  campaignName: { type: String, required: true },
  description: { type: String, required: true },
  monthlyGoal: { type: Number },
  goalAmount: { type: Number, required: true },
  projectTimeline: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  portfolio: {
    type: [String], // Array of strings for file paths
    validate: {
      validator: function (array) {
        return array.length <= 5; // Limit to 5 files
      },
      message: 'Portfolio can contain up to 5 files only.'
    }
  }, // Stores up to 5 portfolio files or images
  //milestones: [milestoneSchema],
  term: { type: Number, default: 1 },
  fundsRaised: { type: Number, default: 0 },
  totalRaised: { type: Number, default: 0 },
  //donorCount: { type: Number, default: 0 },
  //investmentTerms: { type: String },
  donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
  recurringDonations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
  investments: [{ type: Schema.Types.ObjectId, ref: 'Investment' }],
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  promotions: [promotionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export the Project model
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

  