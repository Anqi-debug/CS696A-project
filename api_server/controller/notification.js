const Notification = require('../model/Notification');

// Function to create a new notification
exports.createNotification = async (userId, message, type) => {
    if (!userId || !message || !type) {
        console.error('Invalid parameters provided for creating notification');
        return { success: false, error: 'Invalid parameters provided for creating notification' };
    }

    try {
        const notification = new Notification({
            recipientId: userId,
            message,
            type,
            isRead: false, // By default, the notification is unread
        });

        await notification.save();
        console.log(`Notification created for user ${userId}`);
        return { success: true, message: 'Notification created successfully' };
    } catch (err) {
        console.error(`Error creating notification for user ${userId}:`, error.message);
        return { success: false, err: err };
    }
};

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ recipientId: userId }).sort({ timestamp: -1 });

        res.status(200).send({
            status: 0,
            message: 'Notifications fetched successfully',
            data: notifications,
        });
    } catch (err) {
        console.error(`Error fetching notifications for user ${userId}:`, error.message);
        res.status(500).cc(err);
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        // Find the notification by ID and update the isRead field to true
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).cc( 'Notification not found');
        }

        res.status(200).send({
            status: 0,
            message: 'Notification marked as read',
            data: notification,
        });
    } catch (err) {
        console.error(`Error marking notification ${notificationId} as read:`, error.message);
        res.status(500).cc(err);
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).cc( 'Notification not found');
        }

        res.status(200).send({
            status: 0,
            message: 'Notification deleted successfully',
        });
    } catch (err) {
        console.error(`Error deleting notification ${notificationId}:`, error.message);
        res.status(500).cc(err);
    }
};
