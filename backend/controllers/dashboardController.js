const userModel = require('../models/conteoUserModel');
const subjectModel = require('../models/subjectModel');
const classModel = require('../models/classModel');

exports.getUserCount = (req, res) => {
    userModel.countUsers((err, count) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ count });
    });
};

exports.getSubjectCount = (req, res) => {
    subjectModel.countSubjects((err, count) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ count });
    });
};

exports.getNextClass = (req, res) => {
    const userId = req.user.id;
    classModel.getNextClass(userId, (err, nextClass) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ nextClass });
    });
};
