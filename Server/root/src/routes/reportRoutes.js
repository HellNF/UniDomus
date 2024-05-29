const express = require('express');
const tokenChecker = require('../middleware/tokenChecker');
const {
    createReport,
    updateReportReview,
    updateReportResolution,
    getPendingReports,
    getResolvedReports,
    getReviewingReports,
    getReportsByReporter,
    getReportsByTarget,
    getSingleReportById,
    updateReportRemove
} = require('../controllers/reportController');

const router = express.Router();

// Utilizza il middleware tokenChecker per tutte le route
router.use(tokenChecker);

// Definisci le route con i rispettivi controller
router.post('/', createReport);

router.get('/', getPendingReports); // Ottieni tutti i report in sospeso
router.get('/resolved', getResolvedReports); // Ottieni tutti i report risolti
router.get('/reviewing', getReviewingReports); // Ottieni tutti i report in revisione
router.get('/reviewing/:adminID', getReviewingReports); // Ottieni tutti i report in revisione per un admin specifico
router.get('/reporter/:reporterID', getReportsByReporter); // Ottieni tutti i report di un determinato reporter
router.get('/target/:targetID', getReportsByTarget); // Ottieni tutti i report di un determinato target
router.get('/:id', getSingleReportById); // Ottieni un singolo report per ID

// Route per aggiornare i report
router.put('/review', updateReportReview); // Aggiorna il reviewerID, reviewDate e reportStatus
router.put('/resolve', updateReportResolution); // Aggiorna resolvedDate e reportStatus
router.put('/remove', updateReportRemove); // Aggiorna resolvedDate e reportStatus e reviwerID per rimuvovere l'admin della revisione del report

module.exports = router;
