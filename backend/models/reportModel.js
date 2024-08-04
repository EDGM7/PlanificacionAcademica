const db = require('../config/db');

const generateEnrollmentReport = (callback) => {
  const sql = `
    SELECT 
      m.nombre AS materia, 
      COUNT(i.id) AS estudiantes_inscritos 
    FROM 
      inscripciones i 
    JOIN 
      materias m 
    ON 
      i.materia_id = m.id 
    GROUP BY 
      m.nombre
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const generateSystemUsageReport = (callback) => {
  const sql = `
    SELECT 
      u.nombre, 
      COUNT(l.id) AS numero_accesos, 
      AVG(l.duracion) AS tiempo_promedio 
    FROM 
      log_accesos l 
    JOIN 
      usuarios u 
    ON 
      l.usuario_id = u.id 
    GROUP BY 
      u.nombre
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

module.exports = {
  generateEnrollmentReport,
  generateSystemUsageReport
};
