const db = require('../config/db');

const formatDateTimeForMySQL = (date) => {
  const d = new Date(date);
  const pad = (n) => n < 10 ? '0' + n : n;

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const registrarInicioAcceso = (usuario_id, inicio, callback) => {
  if (!inicio || isNaN(new Date(inicio))) {
    return callback(new Error("Fecha de inicio es requerida y debe ser válida"));
  }

  const inicioFormatted = formatDateTimeForMySQL(inicio);

  const sql = 'INSERT INTO log_accesos (usuario_id, inicio) VALUES (?, ?)';
  db.query(sql, [usuario_id, inicioFormatted], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const registrarFinAcceso = (usuario_id, fin, callback) => {
  if (!fin || isNaN(new Date(fin))) {
    return callback(new Error("Fecha de fin es requerida y debe ser válida"));
  }

  const finFormatted = formatDateTimeForMySQL(fin);
  const sqlSelect = 'SELECT id, inicio FROM log_accesos WHERE usuario_id = ? ORDER BY inicio DESC LIMIT 1';
  db.query(sqlSelect, [usuario_id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(new Error("No se encontró un acceso de inicio para este usuario"));

    const inicio = new Date(results[0].inicio);
    const duracion = Math.floor((new Date(fin) - inicio) / 1000); // Duración en segundos

    if (isNaN(duracion)) {
      return callback(new Error("La duración calculada es NaN"));
    }

    const sqlUpdate = 'UPDATE log_accesos SET fin = ?, duracion = ? WHERE id = ?';
    db.query(sqlUpdate, [finFormatted, duracion, results[0].id], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  });
};

module.exports = { registrarInicioAcceso, registrarFinAcceso };
