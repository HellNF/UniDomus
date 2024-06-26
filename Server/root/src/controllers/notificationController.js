const NotificationModel = require('../models/notificationModel');
const UserModel = require('../models/userModel');
const {notificationStatusEnum, notificationTypeEnum, notificationPriorityEnum} = require('../models/enums');

/**
 * Controller function for creating a notification.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function createNotification(req, res) {
    const { userID, type, message, link, priority } = req.body;

    try {
        const user = await UserModel.findById(userID);

        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newNotification = await NotificationModel.create({
            userID,
            type,
            message,
            link,
            priority
        });

        return res.status(201).json({ message: "Notification created successfully", notification: newNotification });
    } catch (error) {
        console.error("Error creating notification:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}




/**
 * Controller function for updating the status of a notification.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function updateNotificationStatus(req, res) {
    const { notificationId } = req.params;
    const { status } = req.body;

    try {
        const notification = await NotificationModel.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.status = status;
        await notification.save();

        return res.status(200).json({ message: "Notification status updated", notification });
    } catch (error) {
        console.error("Error updating notification status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function for deleting a notification by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function deleteNotificationById(req, res) {
    const { notificationId } = req.params;

    try {
        const notification = await NotificationModel.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function for setting all notifications as read by user ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function setAllNotificationsAsRead(req, res) {
    const { userID } = req.params;

    try {
        await NotificationModel.updateMany({ userID }, { status: notificationStatusEnum.SEEN  });

        return res.status(200).json({ message: "All notifications set as read" });
    } catch (error) {
        console.error("Error updating notification status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * Controller function for retrieving notifications by user ID with filtering on the notification fields.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function getNotificationsByUserId(req, res) {
    const { userID } = req.params;
    const { type, status, priority } = req.query;

    try {
        const query = { userID };

        if (type) {
            query.type = type;
        }

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        const notifications = await NotificationModel.find(query).sort({ createdAt: -1 });

        return res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error retrieving notifications:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Controller function for deleting notifications by user ID with filters.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
async function deleteNotificationsByUserId(req, res) {
    const { userID } = req.params;
    const { type, status, priority } = req.query;

    const filter = { userID };

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    try {
        await NotificationModel.deleteMany(filter);

        return res.status(200).json({ message: "Filtered notifications deleted successfully" });
    } catch (error) {
        console.error("Error deleting notifications:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    createNotification,
    getNotificationsByUserId,
    updateNotificationStatus,
    deleteNotificationById,
    getNotificationsByUserId,
    deleteNotificationsByUserId,
    setAllNotificationsAsRead
};
