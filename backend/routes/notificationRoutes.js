const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Route to create a new notification
router.post('/', notificationController.createNotification);

// Route to get all notifications for a specific user
router.get('/user/:userId', notificationController.getNotificationsByUser);

// Route to mark a notification as read
router.patch('/:notificationId/read', notificationController.markNotificationAsRead);

// Route to delete a notification
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;

