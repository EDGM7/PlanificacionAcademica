const db = require('../config/db');

exports.getNextClass = (userId, callback) => {
    const sql = `
    SELECT h.*, m.nombre AS materia_nombre, u.nombre AS profesor_nombre
    FROM horarios h
    JOIN materias m ON h.materia_id = m.id
    JOIN inscripciones i ON m.id = i.materia_id
    JOIN profesores p ON m.profesor_id = p.id
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE i.usuario_id = ?
    ORDER BY FIELD(h.dia, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'), h.hora_inicio
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, []);
        const clases = results.map(row => ({
            dia: row.dia,
            hora_inicio: row.hora_inicio,
            hora_fin: row.hora_fin,
            materia_nombre: row.materia_nombre,
            profesor_nombre: row.profesor_nombre
        }));
        callback(null, clases);
    });
};
