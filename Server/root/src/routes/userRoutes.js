const express = require('express');
const router = express.Router();

const { 
    registerUser, 
    authenticateUser, 
    getTags, 
    getUserById, 
    updateUserById, 
    updatePassword, 
    requestPasswordChange, 
    getHousingSeekers,
    getAllUsers, 
    googleLogin,
    getUsersByUsername,
    deleteUserById,
    banUserById,
    getBannedUsers,
    unbanUserById 
} = require('../controllers/userController');

const tokenChecker = require('../middleware/tokenChecker');

// Define routes for user registration
router.post('/registration', registerUser);

// Define routes for user authentication
router.post('/authentication', authenticateUser);

// Use query parameters for filtering users
router.get('/housingseekers', getHousingSeekers);

router.delete('/:id',tokenChecker,deleteUserById);

router.put('/:id/ban',banUserById);

router.get('/ban',tokenChecker,getBannedUsers);

router.put('/:id/unban',tokenChecker,unbanUserById)


router.get('/tags', getTags);
router.get('/', getAllUsers);
router.get('/search',getUsersByUsername)

router.get('/:id', getUserById);
router.put('/:id',tokenChecker,updateUserById);
router.post('/forgotpassword', requestPasswordChange);
router.put('/resetpassword/:token', updatePassword);
router.post("/auth/google", googleLogin);




// Export router
module.exports = router;
