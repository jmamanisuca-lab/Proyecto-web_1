CREATE DATABASE sportzone;
USE sportzone;
CREATE USER 'sportuser'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON sportzone.* TO 'sportuser'@'localhost';
FLUSH PRIVILEGES;
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasenia VARCHAR(255) NOT NULL
);

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL
);

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    total DECIMAL(10, 2),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

INSERT INTO usuarios (nombre_completo, correo, contrasenia) VALUES
('Juan Pérez', 'juan@example.com', MD5('123456')),
('María López', 'maria@example.com', MD5('123456')),
('Carlos Ruiz', 'carlos@example.com', MD5('123456'));

INSERT INTO productos (nombre, precio) VALUES
('Zapatillas Deportivas', 199.90),
('Camiseta Deportiva', 59.90),
('Short Deportivo', 49.90),
('Mochila Deportiva', 89.90);

INSERT INTO pedidos (id_usuario, total) VALUES
(1, 259.80),
(2, 149.90);
