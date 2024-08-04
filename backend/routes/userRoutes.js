const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas para gestion de usuarios
router.get('/perfil', authMiddleware.verifyToken, userController.getPerfil);
router.get('/horario', authMiddleware.verifyToken, userController.getHorario);
router.get('/materias-disponibles', authMiddleware.verifyToken, userController.getMateriasDisponibles);
router.post('/inscribir-materia', authMiddleware.verifyToken, userController.inscribirMateria);
router.get('/profesores', authMiddleware.verifyToken, userController.getProfesores);

module.exports = router;
