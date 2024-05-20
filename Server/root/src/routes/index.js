const express = require('express');
const userRoutes = require('./userRoutes');
const tokenRoutes = require('./tokenRoutes');
const listingRoutes = require('./listingRoutes');
const matchRoutes = require('./matchRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/tokens', tokenRoutes);
router.use('/listings', listingRoutes);
router.use('/matches', matchRoutes);

module.exports = router;
