const db = require('../config/db');

exports.countUsers = (callback) => {
    const sql = 'SELECT COUNT(*) AS count FROM usuarios';
    db.query(sql, (err, result) => {
        if (err) return callback(err);
        callback(null, result[0].count);
    });
};
