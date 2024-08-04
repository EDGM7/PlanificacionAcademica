const db = require('../config/db');

const getMateriasDisponibles = (callback) => {
    const sql = `
        SELECT 
            m.id,
            m.nombre,
            m.codigo_matricula,
            u.nombre AS profesor_nombre,
            h.dia,
            h.hora_inicio,
            h.hora_fin
        FROM materias m
        LEFT JOIN profesores p ON m.profesor_id = p.id
        LEFT JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN horarios h ON m.id = h.materia_id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching materias:', err);
            return callback(err);
        }
        callback(null, results);
    });
};

const createMateria = (data, callback) => {
    const { nombre, codigo_matricula, descripcion, profesor_id } = data;

    // Verificar que el profesor_id existe en la tabla profesores
    const checkProfesorSql = 'SELECT * FROM profesores WHERE id = ?';
    db.query(checkProfesorSql, [profesor_id], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) {
            console.error('El profesor_id no existe en la tabla profesores:', profesor_id); // Log para verificar el profesor_id
            return callback(new Error('El profesor_id no existe en la tabla profesores.'));
        }

        const sql = 'INSERT INTO materias (nombre, codigo_matricula, descripcion, profesor_id) VALUES (?, ?, ?, ?)';
        db.query(sql, [nombre, codigo_matricula, descripcion, profesor_id], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    });
};


const updateMateria = (materiaId, data, callback) => {
    const { nombre, codigo_matricula, descripcion, profesor_id, dia, hora_inicio, hora_fin } = data;

    const sql = 'UPDATE materias SET nombre = ?, codigo_matricula = ?, descripcion = ?, profesor_id = ? WHERE id = ?';
    db.query(sql, [nombre, codigo_matricula, descripcion, profesor_id, materiaId], (err, result) => {
        if (err) return callback(err);

        const horarioSql = 'UPDATE horarios SET dia = ?, hora_inicio = ?, hora_fin = ? WHERE materia_id = ?';
        db.query(horarioSql, [dia, hora_inicio, hora_fin, materiaId], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    });
};


const deleteMateria = (materiaId, callback) => {
    // Eliminar el horario asociado
    const deleteHorarioSql = 'DELETE FROM horarios WHERE materia_id = ?';
    db.query(deleteHorarioSql, [materiaId], (err, result) => {
        if (err) return callback(err);

        // Eliminar la materia
        const sql = 'DELETE FROM materias WHERE id = ?';
        db.query(sql, [materiaId], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    });
};

module.exports = {
    getMateriasDisponibles,
    createMateria,
    updateMateria,
    deleteMateria
};
