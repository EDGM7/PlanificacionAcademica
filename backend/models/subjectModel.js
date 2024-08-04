const db = require('../config/db');

exports.countSubjects = (callback) => {
    const sql = 'SELECT COUNT(*) AS count FROM materias';
    db.query(sql, (err, result) => {
        if (err) return callback(err);
        callback(null, result[0].count);
    });
};
