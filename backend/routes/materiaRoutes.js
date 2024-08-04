const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materiaController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.verifyToken, materiaController.getMateriasDisponibles);
router.post('/', authMiddleware.verifyToken, materiaController.createMateria);
router.put('/:id', authMiddleware.verifyToken, materiaController.updateMateria);
router.delete('/:id', authMiddleware.verifyToken, materiaController.deleteMateria);

module.exports = router;
