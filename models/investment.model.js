const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Investment schema
const investmentSchema = new Schema({
    donorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // References the User model for the donor
        required: true 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', // References the Project model for the project this investment is associated with
        required: true 
    },
    investmentAmount: { 
        type: Number, 
        required: true, 
        min: 0 // Ensures the investment amount is a positive number
    },
    potentialReturns: { 
        type: Number, 
        required: true, 
        min: 0 // Ensures potential returns are a positive number
    },
    date: { 
        type: Date, 
        default: Date.now // Tracks the date of the investment
    }
});

// Create and export the Investment model
const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
