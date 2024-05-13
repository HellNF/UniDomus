// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const { registerUser,authenticateUser,getTags, getUserById, updateUserById, updatePassword, requestPasswordChange, getUserByFilters } = require('../controllers/userController');

router.use(bodyParser.urlencoded({ extended: false }));


// Define routes for user registration
router.post('/registration', registerUser);


//Define routes for user authentication
router.post('/authentication', authenticateUser);

router.get('/tags', getTags);

router.get('/getByFilters',getUserByFilters)

router.get('/:id', getUserById);

router.put('/:id', updateUserById);

router.post('/forgotpassword',requestPasswordChange)

router.put('/resetpassword/:token',updatePassword)



// Export router
module.exports = router;