const PDFDocument = require('pdfkit');
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.generateReport = (req, res) => {
  const { reportType } = req.body;
  const userId = req.user.id; // Obtenido del token
  const role = req.user.tipo_usuario; // Obtenido del token

  let sql = '';

  switch (reportType) {
    case 'inscripciones':
      sql = `SELECT m.nombre AS materia, COUNT(i.id) AS numero_estudiantes
             FROM inscripciones i
             JOIN materias m ON i.materia_id = m.id
             GROUP BY m.nombre`;
      break;
    case 'uso':
      sql = `SELECT u.nombre AS usuario, COUNT(l.id) AS numero_accesos, AVG(l.duracion) AS tiempo_promedio
             FROM log_accesos l
             JOIN usuarios u ON l.usuario_id = u.id
             GROUP BY u.nombre`;
      break;
    case 'horario':
      if (role === 'profesor') {
        sql = `
          SELECT h.*, m.nombre AS materia_nombre, u.nombre AS profesor_nombre
          FROM horarios h
          JOIN materias m ON h.materia_id = m.id
          JOIN profesores p ON m.profesor_id = p.id
          JOIN usuarios u ON p.usuario_id = u.id
          WHERE p.usuario_id = ${userId}`;
      } else {
        sql = `
          SELECT 
            h.id AS horario_id,
            h.dia,
            h.hora_inicio,
            h.hora_fin,
            m.nombre AS materia_nombre, 
            u.nombre AS profesor_nombre
          FROM horarios h
          JOIN materias m ON h.materia_id = m.id
          JOIN inscripciones i ON m.id = i.materia_id
          JOIN profesores p ON m.profesor_id = p.id
          JOIN usuarios u ON p.usuario_id = u.id
          WHERE i.usuario_id = ${userId}`;
      }
      break;
    default:
      return res.status(400).json({ error: 'Tipo de reporte no válido' });
  }

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al generar el reporte' });
    }

    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const doc = new PDFDocument();
    const filePath = path.join(reportsDir, `${reportType}-report.pdf`);

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text('Reporte de Sistema', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Tipo de Reporte: ${reportType}`, { align: 'left' });
    doc.moveDown();

    const tableTop = doc.y;
    const itemPadding = 5;

    if (reportType === 'inscripciones') {
      doc.fontSize(12).text('Materia', 50, tableTop, { width: 200 }).text('Número de Estudiantes', 300, tableTop);
      drawLine(doc, tableTop + itemPadding);
      results.forEach(row => {
        doc.text(row.materia, 50, doc.y + itemPadding, { width: 200 }).text(row.numero_estudiantes.toString(), 300, doc.y);
        drawLine(doc, doc.y + itemPadding * 2);
      });
    } else if (reportType === 'uso') {
      doc.fontSize(12).text('Usuario', 50, tableTop, { width: 150 }).text('Número de Accesos', 200, tableTop, { width: 150 }).text('Tiempo Promedio (s)', 350, tableTop);
      drawLine(doc, tableTop + itemPadding);
      results.forEach(row => {
        doc.text(row.usuario, 50, doc.y + itemPadding, { width: 150 }).text(row.numero_accesos.toString(), 200, doc.y, { width: 150 });
        const tiempoPromedio = parseFloat(row.tiempo_promedio);
        if (!isNaN(tiempoPromedio)) {
          doc.text(tiempoPromedio.toFixed(2), 350, doc.y);
        } else {
          doc.text('N/A', 350, doc.y);
        }
        drawLine(doc, doc.y + itemPadding * 2);
      });
    } else if (reportType === 'horario') {
      doc.fontSize(12).text('Materia', 50, tableTop, { width: 100 }).text('Día', 150, tableTop, { width: 100 }).text('Hora Inicio', 250, tableTop, { width: 100 }).text('Hora Fin', 350, tableTop, { width: 100 }).text('Profesor', 450, tableTop, { width: 100 });
      drawLine(doc, tableTop + itemPadding);
      results.forEach(row => {
        doc.text(row.materia_nombre, 50, doc.y + itemPadding, { width: 100 }).text(row.dia, 150, doc.y, { width: 100 }).text(row.hora_inicio, 250, doc.y, { width: 100 }).text(row.hora_fin, 350, doc.y, { width: 100 }).text(row.profesor_nombre, 450, doc.y, { width: 100 });
        drawLine(doc, doc.y + itemPadding * 2);
      });
    }

    doc.end();

    writeStream.on('finish', () => {
      res.download(filePath, `${reportType}-report.pdf`, (err) => {
        if (err) {
          console.error('Error al descargar el archivo:', err);
        }
        fs.unlinkSync(filePath); // Elimina el archivo después de la descarga
      });
    });

    writeStream.on('error', (err) => {
      console.error('Error al escribir el archivo:', err);
      res.status(500).json({ error: 'Error al generar el reporte' });
    });
  });
};

function drawLine(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}
