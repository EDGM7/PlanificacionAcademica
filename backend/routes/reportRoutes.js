// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate-report', authMiddleware.verifyToken, reportController.generateReport);

module.exports = router;
