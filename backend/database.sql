CREATE DATABASE IF NOT EXISTS diocesis_sde CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE diocesis_sde;

-- Tablas Principales
CREATE TABLE vicarias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sacerdotes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  foto_url TEXT,
  ordenacion DATE,
  educacion TEXT,
  experiencia TEXT,
  biografia TEXT,
  titulo VARCHAR(100), -- Ej: "Vicario Episcopal"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sectores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  vicaria_id INT NOT NULL,
  FOREIGN KEY (vicaria_id) REFERENCES vicarias(id) ON DELETE CASCADE
);

CREATE TABLE parroquias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  direccion VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(100),
  sector_id INT NOT NULL,
  sacerdote_id INT,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  imagen_url TEXT,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sector_id) REFERENCES sectores(id) ON DELETE CASCADE,
  FOREIGN KEY (sacerdote_id) REFERENCES sacerdotes(id) ON DELETE SET NULL
);

CREATE TABLE misas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parroquia_id INT NOT NULL,
  dia VARCHAR(50) NOT NULL,
  hora VARCHAR(50) NOT NULL,
  FOREIGN KEY (parroquia_id) REFERENCES parroquias(id) ON DELETE CASCADE
);

-- DATOS INICIALES (Esenciales para que el mapa funcione)
INSERT INTO vicarias (id, nombre, slug, color) VALUES
(1, 'Vicaría I - Villa Duarte / Las Américas', 'villa-duarte', '#89a7b1'),
(2, 'Vicaría II - Los Mina / Ozama', 'los-mina', '#3a415a'),
(3, 'Vicaría III - San Isidro / San Luis', 'san-isidro', '#d4a373'),
(4, 'Vicaría IV - Invivienda / Hainamosa', 'invivienda', '#566981'),
(5, 'Vicaría V - Boca Chica / La Caleta', 'boca-chica', '#4d7c0f');

-- Inserta aquí algunos datos de prueba para verlos en el mapa
INSERT INTO sectores (id, nombre, vicaria_id) VALUES (1, 'Sector Villa Duarte', 1);
INSERT INTO sacerdotes (id, nombre, titulo) VALUES (1, 'Mons. Benito Ángeles', 'Vicario Episcopal');
INSERT INTO parroquias (id, nombre, sector_id, sacerdote_id, latitud, longitud) VALUES 
(1, 'Parroquia San Juan Bosco', 1, 1, 18.4700, -69.8680);