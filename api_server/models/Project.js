const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User who created the project
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  fundingGoal: { type: Number, required: true },  // Funding target amount
  amountRaised: { type: Number, default: 0 },     // Current amount raised, defaults to 0
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  supporters: [{ type: Schema.Types.ObjectId, ref: 'User' }],  // Array of user IDs who donated
  milestones: [{ type: Schema.Types.ObjectId, ref: 'Milestone' }],  // Array of milestone IDs
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }, // Current status
  donorCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }  // Last updated timestamp
});

// Pre-save middleware to automatically complete the project if conditions are met
projectSchema.pre('save', function (next) {
  const currentDate = new Date();

  // Check if endDate has passed and amountRaised meets or exceeds fundingGoal
  if (this.endDate < currentDate && this.amountRaised >= this.fundingGoal) {
    this.status = 'completed';
  }
  next();
});

// Compile and export the model
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

  //const donation = new Donation({ donorId: user._id, amount: 50 });
  //const project=new project({creatorId:user._id})