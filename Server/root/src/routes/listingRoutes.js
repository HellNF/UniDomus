// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const tokenChecker= require('../middleware/tokenChecker')
const router = express.Router();
const { listings, addListing , getListingById } = require('../controllers/listingController');

router.use(bodyParser.urlencoded({ extended: false }));

const Listing = require('../models/listingModel');

/**
 * @swagger
 * components:
 *   schemas:
 *     Listing:
 *       type: object
 *       properties:
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               minLength: 3
 *               maxLength: 50
 *             city:
 *               type: string
 *               minLength: 3
 *               maxLength: 50
 *             cap:
 *               type: string
 *               minLength: 5
 *               maxLength: 5
 *               pattern: '^\d{5}$'
 *             houseNum:
 *               type: string
 *               minLength: 1
 *               maxLength: 5
 *             province:
 *               type: string
 *               minLength: 2
 *               maxLength: 2
 *             country:
 *               type: string
 *               minLength: 3
 *               maxLength: 50
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           maxItems: 10
 *         publisherID:
 *           type: string
 *           format: uuid
 *         tenantsID:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           maxItems: 12
 *         typology:
 *           type: string
 *           maxLength: 30
 *         description:
 *           type: string
 *           maxLength: 1000
 *         price:
 *           type: number
 *           minimum: 10
 *           maximum: 10000
 *         floorArea:
 *           type: number
 *           minimum: 1
 *           maximum: 10000
 *         availability:
 *           type: string
 *         publicationDate:
 *           type: string
 *           format: date-time
 */


/**
 * @swagger
 * /api/listing:
 *   get:
 *     summary: Retrieve listings based on query parameters
 *     description: Retrieve listings based on price range, typology, city, and floor area range.
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: typology
 *         schema:
 *           type: string
 *         description: Typology filter
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City filter
 *       - in: query
 *         name: floorAreaMin
 *         schema:
 *           type: number
 *         description: Minimum floor area filter
 *       - in: query
 *         name: floorAreaMax
 *         schema:
 *           type: number
 *         description: Maximum floor area filter
 *     responses:
 *       '200':
 *         description: A list of listings matching the query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 listings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Listing'
 */


router.get('/',listings);


router.get('/add',addListing)

/**
 * @swagger
 * /api/listing/{id}:
 *   get:
 *     summary: Retrieve a listing by ID
 *     description: Retrieve a listing by its unique identifier.
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the listing to retrieve
 *     responses:
 *       '200':
 *         description: Listing retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       '400':
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Listing not found
 *       '500':
 *         description: Error retrieving listing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving listing
 *                 error:
 *                   type: string
 */
router.get('/:id',getListingById);



// Export router
module.exports = router;