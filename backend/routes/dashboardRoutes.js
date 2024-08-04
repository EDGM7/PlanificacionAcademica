const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/users/count', authMiddleware.verifyToken, dashboardController.getUserCount);
router.get('/subjects/count', authMiddleware.verifyToken, dashboardController.getSubjectCount);
router.get('/classes/next', authMiddleware.verifyToken, dashboardController.getNextClass);

module.exports = router;
