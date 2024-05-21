const express = require('express');
const router = express.Router();
const {
    createNotification,
    getNotificationsByUserId,
    updateNotificationStatus,
    deleteNotificationById,
    deleteAllNotificationsByUserId,
} = require('../controllers/notificationController');
const tokenChecker = require('../middleware/tokenChecker');

router.use(tokenChecker);

router.post('/', createNotification);
router.get('/user/:userID', getNotificationsByUserId);
router.put('/:notificationId/status', updateNotificationStatus);
router.delete('/:notificationId', deleteNotificationById);
router.delete('/user/:userID', deleteAllNotificationsByUserId);


module.exports = router;
