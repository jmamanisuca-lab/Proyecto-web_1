-- CONFIGURACIÓN DE LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS sportzone;
USE sportzone;

-- CREACIÓN DE TABLA USUARIOS (SIN AUTO_INCREMENT)
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    contrasenia VARCHAR(255) NOT NULL
);

-- INSERCIÓN DE DATOS (COPIA FIEL DE TU IMAGEN)
INSERT INTO usuarios (id_usuario, nombre_completo, correo, contrasenia) VALUES
(12468, 'Daniel', 'daniel@gmail.com', '12345678'),
(656057, 'Rodrigo', 'rodrigo@gmail.com', '32165487'),
(698431, 'Mauro', 'mauro@gmail.com', '12365478'),
(889813, 'Sebastian Bernal', 'sbernal@unsa.edu.pe', 'usuario123');