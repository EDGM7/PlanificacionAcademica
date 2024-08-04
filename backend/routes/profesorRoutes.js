const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const profesorController = require('../controllers/profesorController');

router.get('/materias', authMiddleware.verifyToken, profesorController.getMaterias);
router.get('/horario', authMiddleware.verifyToken, profesorController.getHorario);
router.get('/planificacion', authMiddleware.verifyToken, profesorController.getPlanificacion);
router.post('/planificacion', authMiddleware.verifyToken, profesorController.crearPlanificacion);
router.put('/planificacion/:id', authMiddleware.verifyToken, profesorController.actualizarPlanificacion); // Asegúrate de tener la ruta para actualizar
router.delete('/planificacion/:id', authMiddleware.verifyToken, profesorController.eliminarPlanificacion); // Asegúrate de tener la ruta para eliminar

module.exports = router;
