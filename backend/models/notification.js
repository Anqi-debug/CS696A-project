const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Notifications Schema
const notificationSchema = new mongoose.Schema({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // References the Users collection
  message: { type: String, required: true }, // Content of the notification
  isRead: { type: Boolean, default: false }, // Tracks if the notification has been read
  timestamp: { type: Date, default: Date.now } // Creation date of the notification
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the Notification model
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;