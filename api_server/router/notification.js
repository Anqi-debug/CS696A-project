const express = require('express');
const router = express.Router(); 

const notification_Controller= require('../controller/notification');

// Endpoint to get notifications for a user
router.get('/user/:userId', notification_Controller.getUserNotifications);

// Endpoint to mark a notification as read
router.patch('/:notificationId/read', notification_Controller.markAsRead);

// Endpoint to delete a notification
router.delete('/:notificationId', notification_Controller.deleteNotification);

module.exports = router;

// Create a notification for successful donation
// await notificationService.createNotification(donorId, `You successfully donated $${amount} to the project: ${project.title}`, 'donation');
// create notification for the creator when donor donate successfully 
// create notification when the project create successfully
