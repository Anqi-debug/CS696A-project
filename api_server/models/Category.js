const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, // Ensure each category name is unique
    trim: true // Remove any leading or trailing whitespace
  },
  description: { 
    type: String, 
    required: false, 
    maxlength: 500 // Optional description with a max length
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Automatically set the creation date
  }
});

// Compile and export the Category model
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
