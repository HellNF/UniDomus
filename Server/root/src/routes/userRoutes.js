const express = require('express');
const router = express.Router();

const { registerUser, authenticateUser, getTags, getUserById, updateUserById, updatePassword, requestPasswordChange, getHousingSeekers,getAllUsers } = require('../controllers/userController');
const tokenChecker = require('../middleware/tokenChecker');

// Define routes for user registration
router.post('/registration', registerUser);

// Define routes for user authentication
router.post('/authentication', authenticateUser);

// Use query parameters for filtering users
router.get('/housingseekers', getHousingSeekers);


router.get('/tags', getTags);
router.get('/', getAllUsers);


router.get('/:id', getUserById);
router.put('/:id',tokenChecker, updateUserById);
router.post('/forgotpassword', requestPasswordChange);
router.put('/resetpassword/:token', updatePassword);

// Export router
module.exports = router;
