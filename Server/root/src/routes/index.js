const express = require('express');
const userRoutes = require('./userRoutes');
const tokenRoutes = require('./tokenRoutes');
const listingRoutes = require('./listingRoutes');
const matchRoutes = require('./matchRoutes');
const notificationRoutes = require('./notificationRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/tokens', tokenRoutes);
router.use('/listings', listingRoutes);
router.use('/matches', matchRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
