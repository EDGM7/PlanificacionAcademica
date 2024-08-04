const db = require('../config/db');

const getUsuarioById = (id, callback) => {
    const sql = 'SELECT * FROM usuarios WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return callback(err);
        callback(null, result[0]);
    });
};

const getUsuarioByCorreo = (correo, callback) => {
    const sql = 'SELECT * FROM usuarios WHERE correo = ?';
    db.query(sql, [correo], (err, result) => {
        if (err) return callback(err);
        callback(null, result[0]);
    });
};

const getUsuarios = (callback) => {
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const createUsuario = (data, callback) => {
    const { nombre, correo, dni, tipo_usuario, usuario, contrasena } = data;
    const sql = 'INSERT INTO usuarios (nombre, correo, dni, tipo_usuario, usuario, contrasena) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombre, correo, dni, tipo_usuario, usuario, contrasena], (err, result) => {
        if (err) return callback(err);

        const usuario_id = result.insertId; // Obtener el ID del nuevo usuario
        console.log('Usuario creado con ID:', usuario_id);

        // Si el tipo de usuario es profesor, crear el registro en la tabla profesores
        if (tipo_usuario === 'profesor') {
            createProfesor({ usuario_id }, (err) => {
                if (err) return callback(err); // Manejar error en la inserción del profesor
                console.log('Profesor creado con éxito para usuario ID:', usuario_id);
                callback(null, result); // Llamar al callback con el resultado del usuario
            });
        } else if (tipo_usuario === 'estudiante') { // Agregado para manejar estudiantes
            createEstudiante({ usuario_id }, (err) => { // Llamar a createEstudiante
                if (err) return callback(err); // Manejar error en la inserción del estudiante
                console.log('Estudiante creado con éxito para usuario ID:', usuario_id);
                callback(null, result); // Llamar al callback con el resultado del usuario
            });
        } else {
            callback(null, result); // Llamar al callback con el resultado del usuario
        }
    });
};

const createProfesor = (data, callback) => {
    const { usuario_id } = data;

    // Verificar si el usuario ya está en la tabla profesores
    const checkProfesorSql = 'SELECT * FROM profesores WHERE usuario_id = ?';
    db.query(checkProfesorSql, [usuario_id], (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) {
            console.log('El usuario ya está registrado como profesor.');
            return callback(null, results[0]); // Devolver el registro existente
        }

        // Insertar nuevo registro si no existe
        const sql = 'INSERT INTO profesores (usuario_id) VALUES (?)';
        db.query(sql, [usuario_id], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    });
};

const createEstudiante = (data, callback) => {
    const { usuario_id } = data;
    const sql = 'INSERT INTO estudiantes (usuario_id) VALUES (?)';
    db.query(sql, [usuario_id], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

const updateUsuario = (id, data, callback) => {
    const { nombre, correo, dni, tipo_usuario, usuario, contrasena } = data;
    const sql = 'UPDATE usuarios SET nombre = ?, correo = ?, dni = ?, tipo_usuario = ?, usuario = ?, contrasena = ? WHERE id = ?';
    db.query(sql, [nombre, correo, dni, tipo_usuario, usuario, contrasena, id], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};


const deleteUsuario = (id, tipo_usuario, callback) => {
    if (tipo_usuario === 'profesor') {
        // Primero, eliminar dependencias en la tabla 
        const deletePlanificacionSql = 'DELETE FROM planificacion WHERE profesor_id IN (SELECT id FROM profesores WHERE usuario_id = ?)';
        const deleteInscripcionesSql = `
            DELETE FROM inscripciones WHERE materia_id IN 
            (SELECT id FROM materias WHERE profesor_id IN 
            (SELECT id FROM profesores WHERE usuario_id = ?));
        `;
        const deleteHorariosSql = `
            DELETE FROM horarios WHERE materia_id IN 
            (SELECT id FROM materias WHERE profesor_id IN 
            (SELECT id FROM profesores WHERE usuario_id = ?));
        `;
        const deleteMateriasSql = 'DELETE FROM materias WHERE profesor_id IN (SELECT id FROM profesores WHERE usuario_id = ?)';
        const deleteProfesoresSql = 'DELETE FROM profesores WHERE usuario_id = ?';

        db.query(deletePlanificacionSql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting planificacion:', err);
                return callback(err);
            }

            db.query(deleteInscripcionesSql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting inscripciones:', err);
                    return callback(err);
                }

                db.query(deleteHorariosSql, [id], (err, result) => {
                    if (err) {
                        console.error('Error deleting horarios:', err);
                        return callback(err);
                    }

                    db.query(deleteMateriasSql, [id], (err, result) => {
                        if (err) {
                            console.error('Error deleting materias:', err);
                            return callback(err);
                        }

                        db.query(deleteProfesoresSql, [id], (err, result) => {
                            if (err) {
                                console.error('Error deleting profesor:', err);
                                return callback(err);
                            }

                            const deleteUsuarioSql = 'DELETE FROM usuarios WHERE id = ?';
                            db.query(deleteUsuarioSql, [id], (err, result) => {
                                if (err) {
                                    console.error('Error deleting user:', err);
                                    return callback(err);
                                }
                                callback(null, result);
                            });
                        });
                    });
                });
            });
        });
    } else if (tipo_usuario === 'estudiante') {
        const deleteEstudiantesSql = 'DELETE FROM estudiantes WHERE usuario_id = ?';
        const deleteInscripcionesSql = 'DELETE FROM inscripciones WHERE usuario_id = ?';

        db.query(deleteInscripcionesSql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting inscripciones:', err);
                return callback(err);
            }

            db.query(deleteEstudiantesSql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting estudiante:', err);
                    return callback(err);
                }

                const deleteUsuarioSql = 'DELETE FROM usuarios WHERE id = ?';
                db.query(deleteUsuarioSql, [id], (err, result) => {
                    if (err) {
                        console.error('Error deleting user:', err);
                        return callback(err);
                    }
                    callback(null, result);
                });
            });
        });
    } else {
        const deleteUsuarioSql = 'DELETE FROM usuarios WHERE id = ?';
        db.query(deleteUsuarioSql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting user:', err);
                return callback(err);
            }
            callback(null, result);
        });
    }
};



const updatePassword = (id, nuevaContrasena, callback) => {
    const sql = 'UPDATE usuarios SET contrasena = ? WHERE id = ?';
    db.query(sql, [nuevaContrasena, id], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

const getAllProfesores = (callback) => {
    const sql = 'SELECT p.id AS profesor_id, u.nombre FROM usuarios u JOIN profesores p ON u.id = p.usuario_id';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching professors:', err); // Log del error
            return callback(err);
        }
        callback(null, results);
    });
};
const getAllAdmins = (callback) => {
    const sql = 'SELECT * FROM usuarios WHERE tipo_usuario = "administrador"';
    db.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
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
  
  const getAllHorario = (callback) => {
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
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching schedule:', err);
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
  

module.exports = {
    getUsuarios,
    getUsuarioById,
    getUsuarioByCorreo,
    createUsuario,
    createProfesor,
    createEstudiante,
    updateUsuario,
    deleteUsuario,
    updatePassword,
    getAllAdmins,
    getAllProfesores,
    getHorarioByEstudianteId,
    getHorarioByProfesorId,
    getAllHorario
};