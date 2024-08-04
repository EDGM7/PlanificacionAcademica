const db = require('../config/db');

const getHorarioByUsuarioId = (usuarioId, callback) => {
    const sql = `
      SELECT 
        h.id AS horario_id,
        h.dia,
        h.hora_inicio,
        h.hora_fin,
        m.nombre AS materia_nombre,
        u.nombre AS profesor_nombre,
        i.fecha_inscripcion
      FROM horarios h
      JOIN materias m ON h.materia_id = m.id
      JOIN inscripciones i ON m.id = i.materia_id
      JOIN profesores p ON m.profesor_id = p.id
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE i.usuario_id = ?`;
  
    db.query(sql, [usuarioId], (err, result) => {
      if (err) {
        console.error('Error fetching schedule:', err);
        return callback(err);
      }
      console.log('Fetched schedule:', result);
      callback(null, result);
    });
}; 
const getHorarioByEstudianteId = (estudianteId, callback) => {
  const sql = `
    SELECT 
      h.id AS horario_id,
      h.dia,
      h.hora_inicio,
      h.hora_fin,
      m.nombre AS materia_nombre,
      u.nombre AS profesor_nombre,
      i.fecha_inscripcion
    FROM horarios h
    JOIN materias m ON h.materia_id = m.id
    JOIN inscripciones i ON m.id = i.materia_id
    JOIN profesores p ON m.profesor_id = p.id
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE i.usuario_id = ?`;

  db.query(sql, [estudianteId], (err, results) => {
    if (err) {
      console.error('Error fetching student schedule:', err);
      return callback(err);
    }
    const horarios = results.map(row => ({
      horario_id: row.horario_id,
      dia: row.dia,
      hora_inicio: row.hora_inicio,
      hora_fin: row.hora_fin,
      materia_nombre: row.materia_nombre,
      profesor_nombre: row.profesor_nombre,
      fecha_inscripcion: row.fecha_inscripcion
    }));
    callback(null, horarios);
  });
};

const inscribirMateria = (usuarioId, materiaId, callback) => {
  const fecha_inscripcion = new Date(); // Obtener la fecha actual para la inscripción

  // Primero, obtener el estudiante_id asociado con el usuarioId
  const getEstudianteIdSql = 'SELECT id FROM estudiantes WHERE usuario_id = ?';
  db.query(getEstudianteIdSql, [usuarioId], (err, result) => {
    if (err) return callback(err);
    if (result.length === 0) return callback(new Error('Estudiante no encontrado'));

    const estudianteId = result[0].id;

    // Insertar la inscripción incluyendo el estudiante_id
    const sql = 'INSERT INTO inscripciones (usuario_id, materia_id, estudiante_id, fecha_inscripcion) VALUES (?, ?, ?, ?)';
    db.query(sql, [usuarioId, materiaId, estudianteId, fecha_inscripcion], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
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


module.exports = {
    getHorarioByUsuarioId,
    getHorarioByEstudianteId,
    getHorarioByProfesorId,
    inscribirMateria
};
