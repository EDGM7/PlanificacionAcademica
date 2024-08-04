const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas para la gestión de usuarios
router.get('/usuarios', authMiddleware.verifyToken, adminController.getUsuarios);
router.post('/usuarios', authMiddleware.verifyToken, adminController.createUsuario);
router.put('/usuarios/:id', authMiddleware.verifyToken, adminController.updateUsuario);
router.delete('/usuarios/:id', authMiddleware.verifyToken, adminController.deleteUsuario);

// Ruta para la generación de reportes
router.get('/report', authMiddleware.verifyToken, adminController.generateReport);

// Ruta para obtener todos los administradores
router.get('/admins', authMiddleware.verifyToken, adminController.getAllAdmins);
module.exports = router;