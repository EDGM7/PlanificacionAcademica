const userModel = require('../models/userModel');
const materiaModel = require('../models/materiaModel');
const inscripcionModel = require('../models/inscripcionModel');

exports.getPerfil = (req, res) => {
  const userId = req.user.id;
  userModel.getUsuarioById(userId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(result);
  });
};

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
    userModel.getHorarioByEstudianteId(userId, (err, result) => {
      if (err) {
        console.error('Error fetching student schedule:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Student schedule:', result);
      res.status(200).json(result);
    });
  } else if (role === 'administrador') {
    userModel.getAllHorario((err, result) => {
      if (err) {
        console.error('Error fetching admin schedule:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Admin schedule:', result);
      res.status(200).json(result);
    });
  } else {
    console.warn('Unauthorized access attempt by user ID:', userId);
    res.status(403).json({ message: 'Acceso denegado' });
  }
};

exports.getMateriasDisponibles = (req, res) => {
  materiaModel.getMateriasDisponibles((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(result);
  });
};

exports.inscribirMateria = (req, res) => {
  const userId = req.user.id;
  const { materia_id } = req.body;
  inscripcionModel.inscribirMateria(userId, materia_id, (err, result) => {
    if (err) {
      console.error('Error al inscribir materia:', err);
      return res.status(500).json({ error: 'Error al inscribir materia. Intenta nuevamente.' });
    }
    res.status(201).json({ message: 'Inscripción exitosa' });
  });
};

exports.getProfesores = (req, res) => {
  userModel.getAllProfesores((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(result);
  });
};
