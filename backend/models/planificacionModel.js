const db = require('../config/db');

const getAllPlanificacion = (callback) => {
    const sql = `
        SELECT p.*, u.nombre AS profesor_nombre
        FROM planificacion p
        LEFT JOIN profesores pr ON p.profesor_id = pr.id
        LEFT JOIN usuarios u ON pr.usuario_id = u.id
    `;
    db.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const getPlanificacionByProfesorId = (profesorId, callback) => {
    const sql = `
        SELECT p.*, u.nombre AS profesor_nombre
        FROM planificacion p
        LEFT JOIN profesores pr ON p.profesor_id = pr.id
        LEFT JOIN usuarios u ON pr.usuario_id = u.id
        WHERE p.profesor_id = ?
    `;
    db.query(sql, [profesorId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const crearPlanificacion = (profesorId, actividad, descripcion, fecha, callback) => {
    const sql = 'INSERT INTO planificacion (profesor_id, actividad, descripcion, fecha) VALUES (?, ?, ?, ?)';
    db.query(sql, [profesorId, actividad, descripcion, fecha], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

const actualizarPlanificacion = (id, actividad, descripcion, fecha, callback) => {
    const sql = 'UPDATE planificacion SET actividad = ?, descripcion = ?, fecha = ? WHERE id = ?';
    db.query(sql, [actividad, descripcion, fecha, id], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

const eliminarPlanificacion = (id, callback) => {
    const sql = 'DELETE FROM planificacion WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

const getMateriasByProfesorId = (profesorId, callback) => {
    const sql = `
      SELECT m.id, m.nombre, m.codigo_matricula, m.descripcion, h.dia, h.hora_inicio, h.hora_fin
      FROM materias m
      LEFT JOIN horarios h ON m.id = h.materia_id
      JOIN profesores p ON m.profesor_id = p.id
      WHERE p.usuario_id = ?
    `;
  
    db.query(sql, [profesorId], (err, results) => {
      if (err) {
        console.error('Error fetching materias:', err);
        return callback(err);
      }
      console.log('Materias fetched:', results);
      callback(null, results);
    });
};
  

module.exports = {
    getAllPlanificacion,
    getPlanificacionByProfesorId,
    crearPlanificacion,
    actualizarPlanificacion,
    getMateriasByProfesorId,
    getPlanificacionByProfesorId,
    eliminarPlanificacion
};
