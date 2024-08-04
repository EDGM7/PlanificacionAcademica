const horarioModel = require('../models/horarioModel');
const planificacionModel = require('../models/planificacionModel');
const userModel = require('../models/userModel'); 



exports.getHorario = (req, res) => {
  const userId = req.user.id;
  const role = req.user.tipo_usuario;

  console.log('Fetching schedule for user ID:', userId, 'with role:', role);

  if (role === 'profesor') {
    userModel.getHorarioByProfesorId(userId, (err, result) => {
      if (err) {
        console.error('Error fetching professor schedule:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Professor schedule:', result);
      res.status(200).json(result);
    });
  } else if (role === 'estudiante') {
    userModel.getHorarioByEstudianteId(userId, (err, result) => { // Verifica el nombre de la función aquí
      if (err) {
        console.error('Error fetching student schedule:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Student schedule:', result);
      res.status(200).json(result);
    });
  } else {
    console.warn('Unauthorized access attempt by user ID:', userId);
    res.status(403).json({ message: 'Acceso denegado' });
  }
};

exports.getPlanificacion = (req, res) => {
  const userId = req.user.id;
  const role = req.user.tipo_usuario;

  console.log('Fetching planificacion for user ID:', userId, 'with role:', role);

  if (role === 'profesor') {
    planificacionModel.getPlanificacionByProfesorId(userId, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(result);
    });
  } else if (role === 'administrador') {
    planificacionModel.getAllPlanificacion((err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(result);
    });
  } else {
    res.status(403).json({ message: 'Acceso denegado' });
  }
};

exports.crearPlanificacion = (req, res) => {
  const profesorId = req.user.id;
  const { actividad, descripcion, fecha } = req.body;
  planificacionModel.crearPlanificacion(profesorId, actividad, descripcion, fecha, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Planificación creada exitosamente' });
  });
};

exports.actualizarPlanificacion = (req, res) => {
  const id = req.params.id;
  const { actividad, descripcion, fecha } = req.body;
  planificacionModel.actualizarPlanificacion(id, actividad, descripcion, fecha, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Planificación actualizada exitosamente' });
  });
};

exports.eliminarPlanificacion = (req, res) => {
  const id = req.params.id;
  planificacionModel.eliminarPlanificacion(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Planificación eliminada exitosamente' });
  });
};

exports.getMaterias = (req, res) => {
  const profesorId = req.user.id; // Asumiendo que el ID del profesor está en el token

  planificacionModel.getMateriasByProfesorId(profesorId, (err, materias) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(materias);
  });
};


