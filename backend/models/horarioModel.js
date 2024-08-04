const db = require('../config/db');

const createHorario = (data, callback) => {
  const { materia_id, dia, hora_inicio, hora_fin } = data;

  const sql = 'INSERT INTO horarios (materia_id, dia, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)';
  db.query(sql, [materia_id, dia, hora_inicio, hora_fin], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};


const getHorariosByMateriaId = (materia_id, callback) => {
  const sql = 'SELECT * FROM horarios WHERE materia_id = ?';
  db.query(sql, [materia_id], (err, results) => {
    if (err) {
      console.error('Error fetching schedules by subject ID:', err);
      return callback(err);
    }
    callback(null, results);
  });
};


const getHorarioByProfesorId = (usuarioId, callback) => {
  const sql = `
    SELECT h.*, m.nombre AS materia_nombre, u.nombre AS profesor_nombre
    FROM horarios h
    JOIN materias m ON h.materia_id = m.id
    JOIN profesores p ON m.profesor_id = p.id
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE p.usuario_id = ?`;
  
  db.query(sql, [usuarioId], (err, results) => {
    if (err) {
      console.error('Error fetching professor schedule:', err);
      return callback(err);
    }
    console.log('Fetched professor schedule:', results);
    const horarios = results.map(row => ({
      horario_id: row.id,
      dia: row.dia,
      hora_inicio: row.hora_inicio,
      hora_fin: row.hora_fin,
      materia_nombre: row.materia_nombre,
      profesor_nombre: row.profesor_nombre
    }));
    callback(null, horarios);
  });
};

const getHorarioByEstudianteId = (estudianteId, callback) => {
  if (!estudianteId) {
    const error = new Error('Estudiante ID no proporcionado');
    console.error('Error:', error.message);
    return callback(error);
  }

  const sql = `
    SELECT 
      h.id AS horario_id,
      h.dia,
      h.hora_inicio,
      h.hora_fin,
      m.nombre AS materia_nombre, 
      u.nombre AS profesor_nombre
    FROM horarios h
    JOIN materias m ON h.materia_id = m.id
    JOIN inscripciones i ON m.id = i.materia_id
    JOIN profesores p ON m.profesor_id = p.id
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE i.usuario_id = ?`;

  console.log('SQL query for student schedule:', sql);

  db.query(sql, [estudianteId], (err, results) => {
    if (err) {
      return callback(err);
    }

    if (results.length === 0) {
      console.warn('No se encontraron horarios para el estudiante con ID:', estudianteId);
      return callback(null, []);
    }

    const horarios = results.map(row => ({
      horario_id: row.horario_id,
      dia: row.dia,
      hora_inicio: row.hora_inicio,
      hora_fin: row.hora_fin,
      materia_nombre: row.materia_nombre,
      profesor_nombre: row.profesor_nombre
    }));

    callback(null, horarios);
  });
};













module.exports = {
  createHorario,
  getHorariosByMateriaId,
  getHorarioByProfesorId,
  getHorarioByEstudianteId
};
