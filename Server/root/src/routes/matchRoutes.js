// routes/matchRoutes.js

const express = require('express');
const {
    createMatch,
    getMatchesByUserID,
    getReceivedMatches,
    getSentMatches,
    updateMatchStatus,
    addMessageToMatch,
    deleteMatchByID,
    getMatchByID,
    updateMatchDetails
} = require('../controllers/matchController');
const tokenChecker = require('../middleware/tokenChecker');

const router = express.Router();

// Define routes
router.post('/', createMatch);
router.get('/user/:userID', getMatchesByUserID);
router.get('/received/:userID', getReceivedMatches);
router.get('/sent/:userID', getSentMatches);
router.put('/status/:matchID', updateMatchStatus);
router.post('/:matchID/messages', addMessageToMatch);
router.delete('/:matchID', deleteMatchByID);
router.get('/:matchID', getMatchByID);
router.put('/:matchID', updateMatchDetails);

module.exports = router;
