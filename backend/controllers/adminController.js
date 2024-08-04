const userModel = require('../models/userModel');
const reportModel = require('../models/reportModel');

exports.getUsuarios = (req, res) => {
  userModel.getUsuarios((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

exports.createUsuario = (req, res) => {
  const userData = req.body;
  userModel.createUsuario(userData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  });
};

exports.updateUsuario = (req, res) => {
  const userData = req.body;
  const userId = req.params.id;
  userModel.updateUsuario(userId, userData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  });
};

exports.deleteUsuario = (req, res) => {
  const userId = req.params.id;
  
  userModel.getUsuarioById(userId, (err, usuario) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: err.message });
    }

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    userModel.deleteUsuario(userId, usuario.tipo_usuario, (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    });
  });
};

exports.generateReport = (req, res) => {
  const { reportType } = req.query;
  reportModel.generateReport(reportType, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(result);
  });
};

exports.getAllAdmins = (req, res) => {
  userModel.getAllAdmins((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};


