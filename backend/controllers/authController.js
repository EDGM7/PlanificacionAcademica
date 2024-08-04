const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { registrarInicioAcceso, registrarFinAcceso } = require('../models/logAccesoModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.register = async (req, res) => {
    const { nombre, correo, dni, tipo_usuario, usuario, contrasena } = req.body;

    if (!nombre || !correo || !dni || !tipo_usuario || !usuario || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const userData = { nombre, correo, dni, tipo_usuario, usuario, contrasena: hashedPassword };

        userModel.createUsuario(userData, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const usuarioId = result.insertId;

            if (tipo_usuario === 'profesor') {
                userModel.createProfesor({ usuario_id: usuarioId }, (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
                });
            } else if (tipo_usuario === 'estudiante') {
                userModel.createEstudiante({ usuario_id: usuarioId }, (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
                });
            } else {
                return res.status(201).json({ message: 'Usuario registrado exitosamente' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.login = (req, res) => {
    const { correo, contrasena } = req.body;

    userModel.getUsuarioByCorreo(correo, async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
        if (!isPasswordValid) return res.status(400).json({ message: 'Contraseña incorrecta' });

        const inicio = new Date().toISOString();
        const token = jwt.sign({ id: user.id, tipo_usuario: user.tipo_usuario, inicio }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log({ id: user.id, tipo_usuario: user.tipo_usuario, inicio })
        registrarInicioAcceso(user.id, inicio, (err, result) => {
            if (err) {
                console.error('Error al registrar el acceso:', err);
                return res.status(500).json({ error: 'Error al registrar el acceso' });
            }

            res.status(200).json({ token, role: user.tipo_usuario });
        });
    });
};

exports.logout = (req, res) => {
    const userId = req.user.id;
    const fin = new Date().toISOString();

    registrarFinAcceso(userId, fin, (err, result) => {
        if (err) {
            console.error('Error registrando acceso:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }

        return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    });
};




exports.forgotPassword = async (req, res) => {
    const { correo, nuevaContrasena } = req.body;

    userModel.getUsuarioByCorreo(correo, async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        userModel.updatePassword(user.id, hashedPassword, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
        });
    });
};

exports.resetPassword = async (req, res) => {
    const { token, nuevaContrasena } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        userModel.updatePassword(decoded.id, hashedPassword, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
        });
    } catch (error) {
        res.status(400).json({ error: 'Token inválido o expirado' });
    }
};
