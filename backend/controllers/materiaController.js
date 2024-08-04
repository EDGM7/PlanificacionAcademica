const materiaModel = require('../models/materiaModel');
const horarioModel = require('../models/horarioModel');
const planificacionModel = require('../models/planificacionModel');


exports.getMateriasDisponibles = (req, res) => {
    materiaModel.getMateriasDisponibles((err, materias) => {
        if (err) {
            console.error('Error fetching materias:', err); // Log del error
            return res.status(500).json({ error: 'Error fetching materias' });
        }
        res.status(200).json(materias);
    });
};

exports.getMateriasDisponibles = (req, res) => {
  const userId = req.user.id;
  const role = req.user.tipo_usuario;

  console.log('Fetching materias for user ID:', userId, 'with role:', role);

  if (role === 'profesor') {
      planificacionModel.getMateriasByProfesorId(userId, (err, materias) => {
          if (err) {
              console.error('Error fetching materias for profesor:', err); // Log del error
              return res.status(500).json({ error: 'Error fetching materias for profesor' });
          }
          res.status(200).json(materias);
      });
  } else {
      materiaModel.getMateriasDisponibles((err, materias) => {
          if (err) {
              console.error('Error fetching materias:', err); // Log del error
              return res.status(500).json({ error: 'Error fetching materias' });
          }
          res.status(200).json(materias);
      });
  }
};

exports.createMateria = (req, res) => {
    const { nombre, codigo_matricula, descripcion, profesor_id } = req.body.materia;
    const { dia, hora_inicio, hora_fin } = req.body.horario;
  
    const dataMateria = { nombre, codigo_matricula, descripcion, profesor_id };
  
    console.log('Datos recibidos en el backend para crear materia:', dataMateria); // Log para verificar los datos recibidos
    console.log('Datos recibidos en el backend para crear horario:', req.body.horario); // Log para verificar los datos del horario recibidos
  
    materiaModel.createMateria(dataMateria, (err, result) => {
      if (err) {
        console.error('Error creating materia:', err);
        return res.status(500).json({ error: 'Error creating materia' });
      }
  
      const materia_id = result.insertId; // Obtener el ID de la materia recién creada
      const dataHorario = { materia_id, dia, hora_inicio, hora_fin };
  
      horarioModel.createHorario(dataHorario, (err, result) => {
        if (err) {
          console.error('Error creating horario:', err);
          return res.status(500).json({ error: 'Error creating horario' });
        }
        res.status(201).json({ message: 'Materia y horario creados exitosamente' });
      });
    });
  };

exports.updateMateria = (req, res) => {
    const materiaId = req.params.id;
    const materiaData = req.body.materia;
    const horarioData = req.body.horario;

    const combinedData = { ...materiaData, ...horarioData };

    materiaModel.updateMateria(materiaId, combinedData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Materia actualizada exitosamente' });
    });
};

exports.deleteMateria = (req, res) => {
    const id = req.params.id;

    materiaModel.deleteMateria(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Materia eliminada exitosamente' });
    });
};