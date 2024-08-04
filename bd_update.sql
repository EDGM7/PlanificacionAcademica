-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `sistema_academico`;

-- Use the database
USE `sistema_academico`;

-- Table structure for table `usuarios`
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `correo` VARCHAR(255) NOT NULL,
  `dni` VARCHAR(20) NOT NULL,
  `tipo_usuario` ENUM('administrador','profesor','estudiante') NOT NULL,
  `usuario` VARCHAR(255) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `usuario` (`usuario`)
);

-- Dumping data for table `usuarios`
LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `dni`, `tipo_usuario`, `usuario`, `contrasena`) VALUES 
  (1, 'salva', 'salva@gmail.com', '29718055', 'profesor', 'salva', '$2a$10$EPp5R61nRPc1n36vXiX2/usBMqgMCwUy9MJxyxm2eupEOqiC0S/DO'),
  (5, 'lucas ', 'lucas@gmail.com', '1231231233', 'profesor', 'lucas', '$2a$10$XZUEMBd9YBjyuRXBKv3IXusV.h8ZtQAGbY2mAa1arbc.CJT6zwhCC'),
  (6, 'sebastian', 'sebas@gmail.com', '123123123', 'estudiante', 'sebas', '$2a$10$khPRroEsp99uo6PdyCMt9eJRZ7CwL/A5t8j7c9vtDp6hnFXVvIsPW'),
  (8, 'roberto', 'rober@gmail.com', '12312312311', 'administrador', 'rober', '$2a$10$35g7Scph6k0004I.Rhd.zOUBNy6qBS/.2kj0QebcsLaabY0CaAxw2'),
  (9, 'anthonella', 'k@gmail.com', '4324232', 'profesor', 'loca', '$2a$10$Lit9zd.UsX/qtmaIYMugKunH5y2tc2WQUU.T4Xsdii.9JbABA8noO');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table `estudiantes`
DROP TABLE IF EXISTS `estudiantes`;
CREATE TABLE `estudiantes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
);

-- Insert sample data into `estudiantes`
INSERT INTO `estudiantes` (`id`, `usuario_id`) VALUES 
  (3, 6),
  (4, 6);

-- Table structure for table `profesores`
DROP TABLE IF EXISTS `profesores`;
CREATE TABLE `profesores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `profesores_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
);

-- Dumping data for table `profesores`
LOCK TABLES `profesores` WRITE;
/*!40000 ALTER TABLE `profesores` DISABLE KEYS */;
INSERT INTO `profesores` (`id`, `usuario_id`) VALUES 
  (2, 5),
  (3, 9);
/*!40000 ALTER TABLE `profesores` ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table `materias`
DROP TABLE IF EXISTS `materias`;
CREATE TABLE `materias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `codigo_matricula` VARCHAR(50) NOT NULL,
  `descripcion` TEXT,
  `profesor_id` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_matricula` (`codigo_matricula`),
  KEY `profesor_id` (`profesor_id`),
  CONSTRAINT `materias_ibfk_1` FOREIGN KEY (`profesor_id`) REFERENCES `profesores` (`id`)
);

LOCK TABLES `materias` WRITE;
/*!40000 ALTER TABLE `materias` DISABLE KEYS */;
INSERT INTO `materias` (`id`, `nombre`, `codigo_matricula`, `descripcion`, `profesor_id`) VALUES 
  (6, 'matematicas ii', 'mate123dD', 'desarrollo de matematica II', 2),
  (7, 'logica', '123asdas', 'logica base de datos ', 2),
  (8, 'aasdasd', 'dsadas123', 'asdasdas', 3),
  (9, 'estadistica', 'asdas566', 'estadistica II ', 3);
/*!40000 ALTER TABLE `materias` ENABLE KEYS */;
UNLOCK TABLES;

CREATE TABLE `horario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profesor_id` int NOT NULL,
  `dia` varchar(50) NOT NULL,
  `hora` varchar(50) NOT NULL,
  `materia` varchar(255) NOT NULL,
  `aula` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `profesor_id` (`profesor_id`),
  CONSTRAINT `horario_ibfk_1` FOREIGN KEY (`profesor_id`) REFERENCES `usuarios` (`id`)
);

-- Table structure for table `horarios`

CREATE TABLE `horarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `materia_id` INT DEFAULT NULL,
  `dia` ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `materia_id` (`materia_id`),
  CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`)
);

INSERT INTO `horarios` (`id`, `materia_id`, `dia`, `hora_inicio`, `hora_fin`) VALUES 
  (6, 6, 'Lunes', '08:02:00', '11:02:00'),
  (7, 7, 'Martes', '00:05:00', '01:30:00'),
  (8, 8, 'Miércoles', '00:25:00', '01:25:00'),
  (9, 9, 'Jueves', '00:38:00', '02:38:00');

-- Table structure for table `inscripciones`
DROP TABLE IF EXISTS `inscripciones`;
CREATE TABLE `inscripciones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `materia_id` INT NOT NULL,
  `estudiante_id` INT DEFAULT NULL,
  `fecha_inscripcion` DATE DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `materia_id` (`materia_id`),
  KEY `estudiante_id` (`estudiante_id`),
  CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`),
  CONSTRAINT `inscripciones_ibfk_3` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`)
);

CREATE TABLE `log_accesos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `inicio` datetime DEFAULT NULL,
  `fin` datetime DEFAULT NULL,
  `duracion` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `log_accesos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
);


-- Table structure for table `registro_materias`
DROP TABLE IF EXISTS `registro_materias`;
CREATE TABLE `registro_materias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `estudiante_id` INT DEFAULT NULL,
  `materia_id` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `estudiante_id` (`estudiante_id`),
  KEY `materia_id` (`materia_id`),
  CONSTRAINT `registro_materias_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`),
  CONSTRAINT `registro_materias_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`)
);

CREATE TABLE `planificacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profesor_id` int NOT NULL,
  `actividad` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `profesor_id` (`profesor_id`),
  CONSTRAINT `planificacion_ibfk_1` FOREIGN KEY (`profesor_id`) REFERENCES `usuarios` (`id`)
);

INSERT INTO `planificacion` (`profesor_id`, `actividad`, `descripcion`, `fecha`) VALUES 
(5, 'Taller de Matemáticas', 'Un taller para revisar conceptos avanzados de cálculo.', '2024-08-10');




